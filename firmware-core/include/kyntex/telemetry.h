#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#define KX_TELEMETRY_VERSION 1U
#define KX_TELEMETRY_HEADER_SIZE 16U
#define KX_TELEMETRY_MAX_PAYLOAD 32U

struct kx_telemetry_header {
    uint8_t version;
    uint8_t type;
    uint32_t sequence;
    uint32_t first_sample;
    uint32_t dropped_samples;
};

struct kx_sequence_tracker {
    uint32_t expected_sequence;
    uint32_t missing_packets;
    bool initialized;
};

size_t kx_telemetry_encode(uint8_t *output, size_t capacity,
                           const struct kx_telemetry_header *header,
                           const uint8_t *payload, size_t payload_size);
bool kx_telemetry_decode(const uint8_t *packet, size_t packet_size,
                         struct kx_telemetry_header *header,
                         const uint8_t **payload, size_t *payload_size);
uint32_t kx_sequence_observe(struct kx_sequence_tracker *tracker,
                             uint32_t sequence);
