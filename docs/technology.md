# Platform and hardware architecture

The current nRF54L15 prototype runs C firmware on Zephyr RTOS. The main thread paces IMU reads using elapsed uptime and sleeps; acquisition is not triggered by a sensor interrupt or an application timer callback. Analog sensing and battery monitoring are also serviced by the firmware.

The [system architecture](system-architecture.md) shows IMU batching, versioned BLE telemetry, bounded recording jobs and the storage owner. It matches the portfolio README.

The XIAO nRF54L15 Sense development board uses its onboard CMSIS-DAP probe for programming. Earlier custom-board work uses the NINA-B302/nRF52 and KiCad; its power and J-Link/SWD bring-up are described in the [hardware guide](hardware/README.md). These are different platforms.

Private build, flash and signing procedures are not published here. The [C examples](firmware-samples.md) are hardware-independent demonstrations rather than replacement device firmware.

[Sensors and calibration](case-studies/sensors-calibration.md) · [Technical roadmap](roadmap.md)
