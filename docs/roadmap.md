# Technical roadmap

This roadmap separates the implementation reviewed on October 29, 2026 from device evidence still needed. It is not a release commitment.

## Reviewed implementation

- C firmware on nRF54L15/Zephyr with main-thread timed acquisition and missed-sample accounting.
- Session control, optional raw IMU batching and versioned BLE telemetry.
- Bounded recording jobs, a storage owner thread, persistent records and recovery checkpoints.
- State-based firmware-update eligibility and boot-health confirmation.

The [validation evidence](validation-status.md) identifies the source snapshots and host checks. Reviewed code and host results do not establish physical-device performance.

## Device validation

- Measure effective sample rate, jitter and missed-period accounting during storage and radio work.
- Measure storage latency, stack headroom and power behavior.
- Verify session continuity and data-quality accounting during disconnects and reconnects.
- Test signed update transfer, interruption, test boot, confirmation and rollback on hardware.
- Implement and validate owner authentication before enabling production history transfer.

## Hardware and public evidence

- Continue mixed-signal sensor-interface debugging on the earlier custom NINA-B302/nRF52 PCB.
- Retain revision-specific power and programming records.
- Add approved board photographs and device demonstrations when available.
- Document a personal debugging investigation only after its observations, change and verification are available.

No sampling-jitter, battery-life, packet-loss or physiological-accuracy measurements are claimed by these goals.

[Hardware revisions](hardware/README.md) · [Architecture](system-architecture.md) · [Validation evidence](validation-status.md)
