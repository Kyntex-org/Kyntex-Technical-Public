#include "kyntex/telemetry.h"

static void write_u32_le(uint8_t *destination, uint32_t value)
{
    destination[0] = (uint8_t)value;
    destination[1] = (uint8_t)(value >> 8U);
    destination[2] = (uint8_t)(value >> 16U);
    destination[3] = (uint8_t)(value >> 24U);
}

static uint32_t read_u32_le(const uint8_t *source)
{
    return (uint32_t)source[0] |
        ((uint32_t)source[1] << 8U) |
        ((uint32_t)source[2] << 16U) |
        ((uint32_t)source[3] << 24U);
}

static uint8_t checksum(const uint8_t *data, size_t size)
{
    uint8_t sum = 0U;
    for (size_t index = 0U; index < size; ++index) {
        sum = (uint8_t)(sum + data[index]);
    }
    return (uint8_t)(0xFFU - sum);
}

size_t kx_telemetry_encode(uint8_t *output, size_t capacity,
                           const struct kx_telemetry_header *header,
                           const uint8_t *payload, size_t payload_size)
{
    const size_t packet_size = KX_TELEMETRY_HEADER_SIZE + payload_size + 1U;
    if (output == NULL || header == NULL || payload_size > KX_TELEMETRY_MAX_PAYLOAD ||
        (payload_size > 0U && payload == NULL) || capacity < packet_size) {
        return 0U;
    }

    output[0] = header->version;
    output[1] = header->type;
    output[2] = (uint8_t)payload_size;
    output[3] = 0U;
    write_u32_le(&output[4], header->sequence);
    write_u32_le(&output[8], header->first_sample);
    write_u32_le(&output[12], header->dropped_samples);
    for (size_t index = 0U; index < payload_size; ++index) {
        output[KX_TELEMETRY_HEADER_SIZE + index] = payload[index];
    }
    output[packet_size - 1U] = checksum(output, packet_size - 1U);
    return packet_size;
}

bool kx_telemetry_decode(const uint8_t *packet, size_t packet_size,
                         struct kx_telemetry_header *header,
                         const uint8_t **payload, size_t *payload_size)
{
    if (packet == NULL || header == NULL || payload == NULL || payload_size == NULL ||
        packet_size < KX_TELEMETRY_HEADER_SIZE + 1U) {
        return false;
    }

    const size_t encoded_payload_size = packet[2];
    if (packet[0] != KX_TELEMETRY_VERSION || encoded_payload_size > KX_TELEMETRY_MAX_PAYLOAD ||
        packet_size != KX_TELEMETRY_HEADER_SIZE + encoded_payload_size + 1U ||
        packet[packet_size - 1U] != checksum(packet, packet_size - 1U)) {
        return false;
    }

    *header = (struct kx_telemetry_header) {
        .version = packet[0],
        .type = packet[1],
        .sequence = read_u32_le(&packet[4]),
        .first_sample = read_u32_le(&packet[8]),
        .dropped_samples = read_u32_le(&packet[12]),
    };
    *payload = &packet[KX_TELEMETRY_HEADER_SIZE];
    *payload_size = encoded_payload_size;
    return true;
}

uint32_t kx_sequence_observe(struct kx_sequence_tracker *tracker,
                             uint32_t sequence)
{
    if (!tracker->initialized) {
        tracker->initialized = true;
        tracker->expected_sequence = sequence + 1U;
        return 0U;
    }

    const uint32_t gap = sequence - tracker->expected_sequence;
    if (gap < UINT32_MAX / 2U) {
        tracker->missing_packets += gap;
        tracker->expected_sequence = sequence + 1U;
        return gap;
    }

    /* Duplicate or reordered packets do not move the expected sequence back. */
    return 0U;
}
