# Kyntex — Software Portfolio

[![Validate portfolio](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml/badge.svg)](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml)

Portfolio release: **1.1.0**

This repository is a public, resume-oriented view of selected Kyntex software
work. It now includes both a hardware-independent firmware engineering sample
and the interactive dashboard, without publishing product-specific device
protocols, hardware configuration, calibration values, or production firmware.

## Included

[`firmware-showcase/`](firmware-showcase/) is a standard C11 sample derived
from the production architecture. It demonstrates a confirmed wear-state
machine, mounting-independent motion features, rolling RMS processing,
versioned telemetry checksums and counters, and deterministic unit tests. It is
deliberately host-buildable and contains no board pins, BLE UUIDs, or production
thresholds.

[`dashboard/`](dashboard/) is a dependency-free, installable web dashboard that
demonstrates:

- event-driven telemetry handling with a clean transport boundary;
- live Canvas visualizations and a responsive instrument-panel UI;
- local session history, summary views, and JSON/CSV export;
- an offline-capable PWA shell; and
- deterministic synthetic data, so the demo runs without hardware or a network
  service.

## Technical highlights

| Area | Approach |
| --- | --- |
| Embedded algorithms | C11 state machines, rolling signal features, explicit configuration |
| Telemetry reliability | versioned envelope, checksum, sequence and missing-packet accounting |
| Firmware validation | deterministic host tests plus strict compiler warnings in CI |
| Front end | standards-based HTML, CSS, and JavaScript modules |
| Visualization | responsive Canvas charts |
| State | event-driven store with bounded session summaries |
| Offline use | installable Progressive Web App shell |
| Demo data | deterministic synthetic telemetry; no device required |
| Validation | automated JavaScript syntax checks on pushes and pull requests |

## Build the firmware sample

```text
cmake -S firmware-showcase -B build/firmware
cmake --build build/firmware
ctest --test-dir build/firmware --output-on-failure
```

## Run the dashboard demo

Serve the repository with any static-file server, then open
[`dashboard/`](dashboard/) in a browser. For example:

```text
python -m http.server 8000
```

Then visit `http://localhost:8000/dashboard/`.

## Public scope

All dashboard values and firmware constants are synthetic and illustrative.
This repository does not connect to a device, collect personal data, make
medical or clinical claims, or include production protocol, hardware wiring,
calibration, credentials, or release materials.

## Private technical walkthrough

A deeper technical walkthrough and private implementation review are available
on request, subject to appropriate confidentiality and ownership constraints.

For product context, architecture goals, and the development roadmap, visit the
[Kyntex project overview](https://github.com/Kyntex-org/Kyntex).

Public schematic, PCB, and bring-up material is organized in the
[Kyntex hardware documentation](https://github.com/Kyntex-org/Kyntex/tree/main/docs/hardware),
including a dedicated
[Altium documentation workspace](https://github.com/Kyntex-org/Kyntex/blob/main/docs/hardware/altium/README.md).

## License

Source is shared for portfolio review only. See [LICENSE](LICENSE).
