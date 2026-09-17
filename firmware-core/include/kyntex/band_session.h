#pragma once

#include <stdbool.h>
#include <stdint.h>

enum kx_band_event {
    KX_BAND_NO_EVENT,
    KX_BAND_SESSION_STARTED,
    KX_BAND_SESSION_STOPPED,
};

struct kx_band_config {
    uint8_t start_fit_min;
    uint8_t stop_fit_max;
    uint32_t tighten_confirm_ms;
    uint32_t release_confirm_ms;
};

struct kx_band_session {
    uint32_t candidate_since_ms;
    bool candidate_active;
    bool workout_active;
};

void kx_band_session_init(struct kx_band_session *session);
enum kx_band_event kx_band_session_update(
    struct kx_band_session *session,
    const struct kx_band_config *config,
    uint8_t fit_score,
    uint32_t now_ms
);
