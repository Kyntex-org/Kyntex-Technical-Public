#include "kyntex/band_session.h"
#include "kyntex/motion_features.h"
#include "kyntex/telemetry.h"

#include <math.h>
#include <stdio.h>
#include <string.h>

static int failures;

#define CHECK(condition) do { \
    if (!(condition)) { \
        fprintf(stderr, "FAIL %s:%d: %s\n", __FILE__, __LINE__, #condition); \
        failures++; \
    } \
} while (0)

static const struct kx_band_config band_config = {
    .start_fit_min = 80U,
    .stop_fit_max = 15U,
    .tighten_confirm_ms = 1200U,
    .release_confirm_ms = 2500U,
};

static const struct kx_motion_config motion_config = {
    .sample_rate_hz = 100U,
    .rms_window_ms = 500U,
    .stationary_gyro_dps = 5.0f,
    .walking_rms_g = 0.08f,
    .running_enter_rms_g = 0.25f,
    .running_exit_rms_g = 0.18f,
    .gravity_learn_alpha = 0.02f,
};

static void test_band_confirmation_and_hysteresis(void)
{
    struct kx_band_session session;
    kx_band_session_init(&session);
    CHECK(kx_band_session_update(&session, &band_config, 80U, 100U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 80U, 1299U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 80U, 1300U) == KX_BAND_SESSION_STARTED);
    CHECK(kx_band_session_update(&session, &band_config, 50U, 1500U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 15U, 2000U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 50U, 3000U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 15U, 4000U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 15U, 6500U) == KX_BAND_SESSION_STOPPED);
}

static void test_brief_contact_is_rejected(void)
{
    struct kx_band_session session;
    kx_band_session_init(&session);
    CHECK(kx_band_session_update(&session, &band_config, 95U, 10U) == KX_BAND_NO_EVENT);
    CHECK(kx_band_session_update(&session, &band_config, 79U, 1209U) == KX_BAND_NO_EVENT);
    CHECK(!session.workout_active);
}

static void test_motion_window_and_orientation(void)
{
    struct kx_motion_engine engine;
    CHECK(kx_motion_init(&engine, &motion_config));
    CHECK(engine.window_samples == 50U);

    struct kx_imu_sample sample = { .ax_g = 1.0f };
    struct kx_motion_features features = kx_motion_update(&engine, &sample);
    CHECK(features.movement == KX_MOVE_STATIONARY);
    CHECK(fabsf(features.total_accel_g - 1.0f) < 0.0001f);

    struct kx_motion_engine rotated;
    CHECK(kx_motion_init(&rotated, &motion_config));
    sample = (struct kx_imu_sample) { .ay_g = 1.0f };
    features = kx_motion_update(&rotated, &sample);
    CHECK(features.movement == KX_MOVE_STATIONARY);
    CHECK(fabsf(features.dynamic_accel_g) < 0.0001f);
}

static void test_window_duration_tracks_sample_rate(void)
{
    struct kx_motion_engine engine;
    struct kx_motion_config config = motion_config;
    config.sample_rate_hz = 25U;
    CHECK(kx_motion_init(&engine, &config));
    CHECK(engine.window_samples == 13U);
    config.sample_rate_hz = 200U;
    CHECK(kx_motion_init(&engine, &config));
    CHECK(engine.window_samples == 100U);
}

static void test_movement_hysteresis(void)
{
    struct kx_motion_engine engine;
    CHECK(kx_motion_init(&engine, &motion_config));
    struct kx_motion_features features = { 0 };

    for (size_t index = 0U; index < engine.window_samples; ++index) {
        const float total_g = (index % 2U == 0U) ? 1.2f : 0.8f;
        const struct kx_imu_sample sample = { .az_g = total_g, .gx_dps = 20.0f };
        features = kx_motion_update(&engine, &sample);
    }
    CHECK(features.movement == KX_MOVE_WALKING);

    for (size_t index = 0U; index < engine.window_samples; ++index) {
        const float total_g = (index % 2U == 0U) ? 1.4f : 0.6f;
        const struct kx_imu_sample sample = { .az_g = total_g, .gx_dps = 30.0f };
        features = kx_motion_update(&engine, &sample);
    }
    CHECK(features.movement == KX_MOVE_RUNNING);

    /* The lower exit threshold avoids rapid running/walking oscillation. */
    for (size_t index = 0U; index < engine.window_samples; ++index) {
        const float total_g = (index % 2U == 0U) ? 1.2f : 0.8f;
        const struct kx_imu_sample sample = { .az_g = total_g, .gx_dps = 20.0f };
        features = kx_motion_update(&engine, &sample);
    }
    CHECK(features.movement == KX_MOVE_RUNNING);
}

static void test_telemetry_integrity(void)
{
    const uint8_t source_payload[] = { 4U, 8U, 15U, 16U, 23U, 42U };
    const struct kx_telemetry_header source_header = {
        .version = KX_TELEMETRY_VERSION,
        .type = 3U,
        .sequence = 19U,
        .first_sample = 152U,
        .dropped_samples = 2U,
    };
    uint8_t packet[KX_TELEMETRY_HEADER_SIZE + KX_TELEMETRY_MAX_PAYLOAD + 1U];
    const size_t packet_size = kx_telemetry_encode(
        packet, sizeof(packet), &source_header, source_payload, sizeof(source_payload));
    CHECK(packet_size > 0U);

    struct kx_telemetry_header decoded;
    const uint8_t *decoded_payload = NULL;
    size_t decoded_size = 0U;
    CHECK(kx_telemetry_decode(packet, packet_size, &decoded, &decoded_payload, &decoded_size));
    CHECK(decoded.sequence == source_header.sequence);
    CHECK(decoded.first_sample == source_header.first_sample);
    CHECK(decoded.dropped_samples == source_header.dropped_samples);
    CHECK(decoded_size == sizeof(source_payload));
    CHECK(memcmp(decoded_payload, source_payload, sizeof(source_payload)) == 0);

    packet[5] ^= 0x20U;
    CHECK(!kx_telemetry_decode(packet, packet_size, &decoded, &decoded_payload, &decoded_size));
}

static void test_sequence_gap_accounting(void)
{
    struct kx_sequence_tracker tracker = { 0 };
    CHECK(kx_sequence_observe(&tracker, 100U) == 0U);
    CHECK(kx_sequence_observe(&tracker, 101U) == 0U);
    CHECK(kx_sequence_observe(&tracker, 105U) == 3U);
    CHECK(tracker.missing_packets == 3U);
    CHECK(kx_sequence_observe(&tracker, 105U) == 0U);
    CHECK(tracker.missing_packets == 3U);
}

int main(void)
{
    test_band_confirmation_and_hysteresis();
    test_brief_contact_is_rejected();
    test_motion_window_and_orientation();
    test_window_duration_tracks_sample_rate();
    test_movement_hysteresis();
    test_telemetry_integrity();
    test_sequence_gap_accounting();

    if (failures != 0) {
        fprintf(stderr, "%d firmware checks failed\n", failures);
        return 1;
    }
    puts("All firmware checks passed");
    return 0;
}
