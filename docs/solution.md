# Current solution

The prototype uses C firmware on an nRF54L15 running Zephyr RTOS. Timed sensor acquisition and session control run in the main thread. IMU batches feed versioned BLE telemetry, while a bounded queue hands recording jobs to a separate storage owner.

Data streams over BLE to a native iOS app and a web dashboard. Raw IMU streaming is opt-in; device-side recording does not require a raw stream or a connected phone.

See [system architecture](system-architecture.md) for execution contexts. The [public synthetic dashboard](demo.md) demonstrates charts, bounded storage and export behavior without Bluetooth or a physical band.

[Project overview](project-overview.md) · [Validation evidence](validation-status.md)
