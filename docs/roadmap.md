# Development roadmap

Updated October 29, 2026. This roadmap separates reviewed implementation from
evidence still needed and future product work. It is not a release commitment.

## Reviewed implementation

- nRF54L15/Zephyr control loop and current timed IMU driver.
- Confirmed pressure-based sessions and separate personal-calibration/manual-pause behavior.
- Applied athlete/calibration checks before recording admission.
- Persistent workout totals/timeline, checkpoints, recovery, and bounded jobs.
- Versioned live telemetry, optional raw capture, and data-quality accounting.
- Signed-image update support, state-based eligibility, and health-gated confirmation.
- Native local-first iOS companion and separate browser engineering tools.

The [validation table](validation-status.md) records which logic was executed in
host tests. A reviewed implementation is not a complete physical qualification.

## Target and device validation

- Repeat the current pinned SDK build and emulator tests with retained artifacts.
- Measure sample rate/jitter, sensor error accounting, and main-loop delays during storage work.
- Measure storage latency, stack headroom, power behavior, and battery calibration.
- Validate phone-to-band profile/calibration, session, pause/resume, and reconnect behavior.
- Test signed update transfer, interrupted transfer, test boot, confirmation, and rollback on physical hardware.
- Implement and validate owner enrollment/authentication before enabling production history transfer.
- Retest local save/recovery/deletion behavior and review the final iOS distribution configuration.

## Hardware and metrics

Continue custom-board sensor bring-up and document each interface separately.
Collect labeled motion recordings across users and mounting positions before
asserting classification performance. Compare any learned model with the
explainable baseline using subject-separated validation.

## Product work

Validate the first useful customer workflow, support scope, privacy/export
behavior, distribution signing, and any store submission. There is no announced
release date, price, or subscription requirement. Add cloud accounts or coach
sharing only when justified by the product requirements.

Tendon-response sensing remains a separate exploratory research direction;
it does not establish tendon stiffness, force, pathology, or injury-risk capability.
