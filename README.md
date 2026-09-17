# Kyntex Technical

[![Build and test](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml/badge.svg)](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml)

This repository contains selected software from the Kyntex wearable project.
The hardware-independent parts are kept here so they can be built and reviewed
without a development board or the nRF Connect SDK.

## Firmware core

[`firmware-core/`](firmware-core/) contains three small C11 modules:

- band wear and workout start/stop timing;
- motion feature extraction and movement classification; and
- telemetry framing, checksums, and packet-gap tracking.

The tests cover timing boundaries, interrupted band contact, sensor orientation,
sample-rate changes, corrupt packets, and missing sequence numbers. Board pins,
BLE UUIDs, hardware drivers, and device calibration values are not included.

Build and run the tests with:

```text
cmake -S firmware-core -B build/firmware
cmake --build build/firmware
ctest --test-dir build/firmware --output-on-failure
```

## Dashboard

[`dashboard/`](dashboard/) is a dependency-free browser application for viewing
motion signals and session summaries. It includes live Canvas charts, bounded
session history, JSON and CSV export, and an offline application shell. A local
signal generator feeds the interface when no band is connected.

To run it locally:

```text
python -m http.server 8000
```

Open `http://localhost:8000/dashboard/`.

## Scope

The signal generator and firmware constants in this repository are intended for
software testing. This code does not connect to a Kyntex band and does not
contain production protocol definitions, hardware wiring, credentials, or user
data.

Hardware design and bring-up notes are maintained in the
[Kyntex project repository](https://github.com/Kyntex-org/Kyntex/tree/main/docs/hardware),
including the
[Altium workspace](https://github.com/Kyntex-org/Kyntex/blob/main/docs/hardware/altium/README.md).

## License

Copyright and usage terms are in [LICENSE](LICENSE).
