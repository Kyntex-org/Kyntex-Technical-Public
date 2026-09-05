# Kyntex — Software Portfolio

[![Validate portfolio](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml/badge.svg)](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml)

Portfolio release: **1.0.0**

This repository is a public, resume-oriented view of selected Kyntex software
work. It focuses on how the user experience and data pipeline are designed,
without publishing product-specific device protocols, hardware configuration,
calibration methods, or production firmware.

## Included

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
| Front end | standards-based HTML, CSS, and JavaScript modules |
| Visualization | responsive Canvas charts |
| State | event-driven store with bounded session summaries |
| Offline use | installable Progressive Web App shell |
| Demo data | deterministic synthetic telemetry; no device required |
| Validation | automated JavaScript syntax checks on pushes and pull requests |

## Run the demo

Serve the repository with any static-file server, then open
[`dashboard/`](dashboard/) in a browser. For example:

```text
python -m http.server 8000
```

Then visit `http://localhost:8000/dashboard/`.

## Public scope

All dashboard values are synthetic and illustrative. This repository does not
connect to a device, collect personal data, make medical or clinical claims, or
include proprietary protocol, control, hardware, calibration, or release
materials.

## Private technical walkthrough

A deeper technical walkthrough and private implementation review are available
on request, subject to appropriate confidentiality and ownership constraints.

For product context, architecture goals, and the development roadmap, visit the
[Kyntex project overview](https://github.com/Kyntex-org/Kyntex).

## License

Source is shared for portfolio review only. See [LICENSE](LICENSE).
