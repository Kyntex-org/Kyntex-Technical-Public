# Kyntex — Software Portfolio

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

## Run the demo

Serve the repository with any static-file server, then open
[`dashboard/`](dashboard/) in a browser. For example:

```text
python -m http.server 8000
```

Then visit `http://localhost:8000/dashboard/`.

## Engineering role

Designed and implemented as an embedded-connected software portfolio project:
interaction design, client-side state management, data visualization, offline
behavior, and export workflows are all represented in the public demo.

## Public scope

All dashboard values are synthetic and illustrative. This repository does not
connect to a device, collect personal data, make medical or clinical claims, or
include proprietary protocol, control, hardware, calibration, or release
materials.

## Private technical walkthrough

A deeper technical walkthrough and private implementation review are available
on request, subject to appropriate confidentiality and ownership constraints.

## License

Source is shared for portfolio review only. See [LICENSE](LICENSE).
