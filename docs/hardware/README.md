# Hardware revisions and bring-up

The hardware history includes multiple platforms. They are separate revisions;
the current XIAO band should not be presented as running on the earlier custom
NINA-B302 board.

| Revision | Purpose and contribution | Available public evidence | Verification boundary |
| --- | --- | --- | --- |
| Early ESP32 prototype | Earlier sensing/analog/haptic integration | [Surviving schematic print](../../Resources/PTMR-PROTO-V1-schematic.pdf) | Historical drawing; not the current band schematic or proof that every circuit function worked |
| Custom NINA-B302/nRF52 V1 PCB | Custom schematic/layout, fabrication, and bench bring-up work described in the project record | Project description; measured bring-up record and design exports still to be added | Power and SWD/J-Link access are reported verified; sensor interfaces remain in debugging; measurements are not published |
| XIAO nRF54L15 Sense band | Current development platform using the module's onboard IMU plus an external fit sensor and battery monitoring | [System architecture](../system-architecture.md) and module mechanical reference in [Resources](../../Resources/README.md) | Firmware host tests do not validate assembled-board timing, power, or sensor performance |

![Placeholder for an actual assembled XIAO band photograph.](../media/band-placeholder.svg)

## Bring-up evidence to add

Add a labeled photograph for each board being discussed, then record expected
and measured power rails, programming/debug access, and per-interface status.
Use **verified**, **in progress**, and **not tested** against specific tests.
Include board revision, firmware snapshot, test date, equipment, and the result.
No measured values are invented in this portfolio.

For the custom board, suitable public artifacts are schematic/layout review
exports, an annotated fabricated-board photo, and a concise issue/revision note.
The STEP file is a module mechanical reference; it is not evidence of custom
PCB layout ownership. The earlier schematic must retain its revision label.

## Optional documentation template

The [Altium documentation template](altium/README.md) is retained for future
authoring. It is incomplete and is not finished design or verification evidence.
It is intentionally outside the main reviewer route.

[Sensor integration](../case-studies/sensors-calibration.md) ·
[Validation](../validation-status.md) · [Roadmap](../roadmap.md)
