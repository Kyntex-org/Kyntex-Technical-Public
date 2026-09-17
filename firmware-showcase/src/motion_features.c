#include "kyntex/motion_features.h"

#include <math.h>
#include <string.h>

static float magnitude3(float x, float y, float z)
{
    return sqrtf((x * x) + (y * y) + (z * z));
}

bool kx_motion_init(struct kx_motion_engine *engine,
                    const struct kx_motion_config *config)
{
    if (engine == NULL || config == NULL || config->sample_rate_hz == 0U ||
        config->rms_window_ms == 0U) {
        return false;
    }

    size_t samples = ((size_t)config->sample_rate_hz * config->rms_window_ms + 999U) / 1000U;
    if (samples == 0U || samples > KX_MOTION_MAX_WINDOW_SAMPLES) {
        return false;
    }

    memset(engine, 0, sizeof(*engine));
    engine->config = *config;
    engine->window_samples = samples;
    engine->gravity_reference_g = 1.0f;
    engine->movement = KX_MOVE_UNKNOWN;
    return true;
}

struct kx_motion_features kx_motion_update(
    struct kx_motion_engine *engine,
    const struct kx_imu_sample *sample)
{
    const float total_g = magnitude3(sample->ax_g, sample->ay_g, sample->az_g);
    const float gyro_dps = magnitude3(sample->gx_dps, sample->gy_dps, sample->gz_dps);
    const float reference = engine->gravity_valid ? engine->gravity_reference_g : 1.0f;
    const float dynamic_g = fabsf(total_g - reference);

    engine->motion_sum_sq -= engine->motion_sq[engine->head];
    engine->gyro_sum_sq -= engine->gyro_sq[engine->head];
    engine->motion_sq[engine->head] = dynamic_g * dynamic_g;
    engine->gyro_sq[engine->head] = gyro_dps * gyro_dps;
    engine->motion_sum_sq += engine->motion_sq[engine->head];
    engine->gyro_sum_sq += engine->gyro_sq[engine->head];
    engine->head = (engine->head + 1U) % engine->window_samples;
    if (engine->count < engine->window_samples) {
        engine->count++;
    }

    const float motion_rms = sqrtf(fmaxf(0.0f, engine->motion_sum_sq / (float)engine->count));
    const float gyro_rms = sqrtf(fmaxf(0.0f, engine->gyro_sum_sq / (float)engine->count));

    if (gyro_rms <= engine->config.stationary_gyro_dps && total_g >= 0.75f && total_g <= 1.25f) {
        if (!engine->gravity_valid) {
            engine->gravity_reference_g = total_g;
            engine->gravity_valid = true;
        } else {
            engine->gravity_reference_g += engine->config.gravity_learn_alpha *
                (total_g - engine->gravity_reference_g);
        }
    }

    if (gyro_rms <= engine->config.stationary_gyro_dps) {
        engine->movement = KX_MOVE_STATIONARY;
    } else {
        const float running_threshold = engine->movement == KX_MOVE_RUNNING ?
            engine->config.running_exit_rms_g : engine->config.running_enter_rms_g;
        if (motion_rms >= running_threshold) {
            engine->movement = KX_MOVE_RUNNING;
        } else if (motion_rms >= engine->config.walking_rms_g) {
            engine->movement = KX_MOVE_WALKING;
        } else {
            engine->movement = KX_MOVE_UNKNOWN;
        }
    }

    return (struct kx_motion_features) {
        .total_accel_g = total_g,
        .dynamic_accel_g = dynamic_g,
        .motion_rms_g = motion_rms,
        .gyro_rms_dps = gyro_rms,
        .gravity_reference_g = engine->gravity_reference_g,
        .movement = engine->movement,
    };
}
