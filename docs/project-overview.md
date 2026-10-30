# Kyntex project overview

Kyntex is developing wearable technology to help athletes and their support
teams better understand the physical demands of training. Perceived effort
does not tell the whole story of the load the body experiences.

The goal is to use movement data to help athletes understand loading patterns
across workouts, providing more context for training and recovery decisions.
The Kyntex band captures movement during training, paired with software for
reviewing patterns across workouts. It remains a working prototype, with
hardware refinement and real-world validation in progress.

This repository is a public engineering snapshot of that work. See the
[company landing page](https://github.com/Kyntex-org) for the product overview.

## Contribution

Ben Harris is co-founder and sole engineer. Engineering work spans firmware,
Bluetooth data contracts, native and browser companion software, prototype
integration, and custom schematic/PCB work. Individual hardware revisions and
their evidence are separated in the [hardware portfolio](hardware/README.md).
The public examples are adapted demonstrations; the complete implementation
and product-specific configuration remain private.

## Design goals

- Start and finish sessions through confirmed device state rather than transient contact.
- Keep sensing and workout processing independent of the phone connection.
- Account for missing data rather than silently displaying a complete record.
- Bound memory and distinguish reduced detail from loss of aggregate totals.
- Make calibration, athlete selection, and applied device state consistent.
- Keep firmware-update eligibility and boot confirmation explicit.
- Provide useful local history without requiring a cloud account.

## Current system

| Layer | Role |
| --- | --- |
| XIAO nRF54L15 Sense | Current wearable development platform; onboard IMU, external fit sensor, battery monitoring |
| Zephyr firmware | Timed acquisition, calibrated/filtering paths, workout state, persistent recording, BLE, and update controls |
| Native iOS app | Consumer-facing setup, calibration, workout controls, summaries, and local history |
| Browser engineering dashboard | Sensor inspection, diagnostics, calibration capture, and engineering exports |
| Public synthetic dashboard | Separate hardware-free demonstration of browser UI, bounded data, and export behavior |

Normal workouts process motion on the band; raw IMU streaming is opt-in for
calibration or engineering capture. The on-band store records workout totals
and timeline summaries, not an unlimited raw-sample archive. The browser's
engineering recording path and the public demo have different storage scopes.

## Status and boundaries

The October 29, 2026 review checked the development source and executed host
tests. It did not certify a release, repeat a target SDK build, or test a band.
See [validation](validation-status.md) for the dated evidence. The current iOS
experience is local-first; cloud sync, account-based coaching, subscriptions,
pricing, and a public release date are not asserted here.

Training-load and impact scores are sensor-derived proxies, not direct measures
of joint force, tissue stress, or injury risk. Tendon-response research is a
separate exploratory effort and is not a demonstrated capability of this band.

[Architecture](system-architecture.md) · [Roadmap](roadmap.md) ·
[Original migrated-document usage terms](../assets/branding/LICENSE)
