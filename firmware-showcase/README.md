# Firmware engineering showcase

This directory is a sanitized, host-buildable extraction of engineering
patterns used in the Kyntex wearable firmware. It demonstrates:

- a time-based band-wear state machine with confirmation windows and
  hysteresis;
- mounting-independent motion features with a sample-rate-stable rolling RMS;
- movement classification with running-state hysteresis;
- a versioned binary telemetry envelope with a checksum and integrity counters;
  and
- deterministic tests for timing boundaries, false-contact rejection,
  orientation independence, corruption detection, and packet-gap accounting.

The public interfaces, packet layout, and test constants are illustrative.
They are not wire-compatible with a Kyntex device and intentionally omit board
configuration, BLE UUIDs, production calibration values, and hardware drivers.

## Build and test

```text
cmake -S firmware-showcase -B build/firmware
cmake --build build/firmware
ctest --test-dir build/firmware --output-on-failure
```

The implementation is standard C11 so reviewers can build it without the nRF
Connect SDK. The production project uses the same separation between pure,
testable algorithms and Zephyr-specific I/O.
