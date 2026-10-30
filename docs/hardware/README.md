# Hardware revisions and bring-up

Ben Harris is co-founder, CTO, and sole engineer. The current development platform and earlier custom PCB are separate hardware revisions.

| Revision | Contribution and status | Evidence boundary |
| --- | --- | --- |
| Current XIAO nRF54L15 Sense prototype | C firmware and Zephyr integration, onboard IMU, analog sensing and battery monitoring | [Architecture](../system-architecture.md) describes the implementation; effective timing, power and sensor performance still need physical measurements. |
| Earlier custom NINA-B302/nRF52 PCB | Designed in KiCad, fabricated and brought up; power delivery and J-Link/SWD programming verified | Mixed-signal sensor-interface debugging is in progress. Bench measurements and approved board photographs are not published here. |
| Earlier ESP32 prototype | Historical sensing and hardware exploration | Separate from both the custom nRF52 board and current nRF54 development platform. |

The current firmware runs on the XIAO board, not the earlier custom PCB. The XIAO board uses its onboard CMSIS-DAP probe for development programming; the J-Link/SWD bring-up claim belongs to the earlier custom board.

## Public hardware evidence

Approved board photographs and high-level block diagrams can document the physical work. Full schematics, PCB layout, Gerbers and manufacturing outputs are excluded. The [module mechanical reference](../../Resources/README.md) is a third-party module reference, not evidence of custom PCB layout ownership.

## Bring-up records

When measurements are available, identify the board revision, firmware snapshot, equipment, test date, expected result and measured result. Keep verified power/programming access separate from sensor interfaces still in debugging. No measured power, timing or battery-life values are claimed here.

See [visual evidence status](../media/README.md) and [validation evidence](../validation-status.md).

[Sensors and calibration](../case-studies/sensors-calibration.md) · [Technical roadmap](../roadmap.md) · [Portfolio](../../README.md)
