#include "kyntex/band_session.h"

#include <string.h>

void kx_band_session_init(struct kx_band_session *session)
{
    memset(session, 0, sizeof(*session));
}

static bool dwell_complete(struct kx_band_session *session, uint32_t now_ms,
                           uint32_t required_ms)
{
    if (!session->candidate_active) {
        session->candidate_active = true;
        session->candidate_since_ms = now_ms;
        return false;
    }

    /* Unsigned subtraction remains correct when a 32-bit millisecond clock wraps. */
    return (uint32_t)(now_ms - session->candidate_since_ms) >= required_ms;
}

enum kx_band_event kx_band_session_update(
    struct kx_band_session *session,
    const struct kx_band_config *config,
    uint8_t fit_score,
    uint32_t now_ms)
{
    if (session->workout_active) {
        if (fit_score > config->stop_fit_max) {
            session->candidate_active = false;
            return KX_BAND_NO_EVENT;
        }
        if (!dwell_complete(session, now_ms, config->release_confirm_ms)) {
            return KX_BAND_NO_EVENT;
        }
        session->candidate_active = false;
        session->workout_active = false;
        return KX_BAND_SESSION_STOPPED;
    }

    if (fit_score < config->start_fit_min) {
        session->candidate_active = false;
        return KX_BAND_NO_EVENT;
    }
    if (!dwell_complete(session, now_ms, config->tighten_confirm_ms)) {
        return KX_BAND_NO_EVENT;
    }
    session->candidate_active = false;
    session->workout_active = true;
    return KX_BAND_SESSION_STARTED;
}
