# Technical roadmap

I am developing the firmware and completing device validation. These are my current engineering priorities.

## Implemented

- C firmware on nRF54L15/Zephyr with main-thread timed acquisition and missed-sample accounting.
- Session control, optional raw IMU batching and versioned BLE telemetry.
- Bounded recording jobs, a storage owner thread, persistent records and recovery checkpoints.
- State-based firmware-update eligibility and boot-health confirmation.

I test the public examples in CI and the private firmware with host tests. The [testing and validation page](validation-status.md) separates that coverage from the hardware measurements below.

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

No sampling-jitter, battery-life, packet-loss or physiological-accuracy measurements are claimed by these goals.

[Hardware revisions](hardware/README.md) · [Architecture](system-architecture.md) · [Validation evidence](validation-status.md)
