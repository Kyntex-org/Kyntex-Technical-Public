# Platform and hardware architecture

The maintained architecture is now in [system architecture](system-architecture.md).
The current nRF54L15 implementation uses timed acquisition, direct I2C sensor
access, ADC-based fit/battery sensing, Zephyr execution contexts, and Bluetooth.
It does not use the interrupt-driven IMU path described by earlier documentation.

Development programming uses the XIAO module's USB-connected CMSIS-DAP probe.
A future production fixture needs accessible programming/debug signals.
Build, flash, and signing procedures remain in private development documentation.
The public portfolio does not provide a device programming package.

Earlier custom-board work is separated in the [hardware revision table](hardware/README.md).
Algorithm explanations and their limits appear in the
[sensor case study](case-studies/sensors-calibration.md) and [roadmap](roadmap.md).
