# Firmware core

These modules isolate the state and signal-processing code from the hardware
drivers used by the band. They cover:

- a time-based band-wear state machine with confirmation windows and
  hysteresis;
- mounting-independent motion features with a sample-rate-stable rolling RMS;
- movement classification with running-state hysteresis;
- a versioned binary telemetry envelope with a checksum and integrity counters;
  and
- deterministic tests for timing boundaries, false-contact rejection,
  orientation independence, corruption detection, and packet-gap accounting.

The packet layout and constants in this directory are only used by these tests.
They are not wire-compatible with a Kyntex band. Board configuration, BLE UUIDs,
device calibration, and hardware drivers remain outside this repository.

## Build and test

```text
cmake -S firmware-core -B build/firmware
cmake --build build/firmware
ctest --test-dir build/firmware --output-on-failure
```

The implementation uses standard C11 and has no SDK dependencies. Keeping these
modules separate from Zephyr-specific I/O makes their behavior reproducible on
a development computer and on the target.
