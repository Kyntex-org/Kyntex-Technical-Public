#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#define KX_MOTION_MAX_WINDOW_SAMPLES 200U

enum kx_movement {
    KX_MOVE_UNKNOWN,
    KX_MOVE_STATIONARY,
    KX_MOVE_WALKING,
    KX_MOVE_RUNNING,
};

struct kx_imu_sample {
    float ax_g;
    float ay_g;
    float az_g;
    float gx_dps;
    float gy_dps;
    float gz_dps;
};

struct kx_motion_config {
    uint16_t sample_rate_hz;
    uint16_t rms_window_ms;
    float stationary_gyro_dps;
    float walking_rms_g;
    float running_enter_rms_g;
    float running_exit_rms_g;
    float gravity_learn_alpha;
};

struct kx_motion_features {
    float total_accel_g;
    float dynamic_accel_g;
    float motion_rms_g;
    float gyro_rms_dps;
    float gravity_reference_g;
    enum kx_movement movement;
};

struct kx_motion_engine {
    struct kx_motion_config config;
    float motion_sq[KX_MOTION_MAX_WINDOW_SAMPLES];
    float gyro_sq[KX_MOTION_MAX_WINDOW_SAMPLES];
    size_t window_samples;
    size_t head;
    size_t count;
    float motion_sum_sq;
    float gyro_sum_sq;
    float gravity_reference_g;
    bool gravity_valid;
    enum kx_movement movement;
};

bool kx_motion_init(struct kx_motion_engine *engine,
                    const struct kx_motion_config *config);
struct kx_motion_features kx_motion_update(
    struct kx_motion_engine *engine,
    const struct kx_imu_sample *sample
);
