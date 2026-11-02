# Public firmware samples

These standalone C11 examples use illustrative constants and packet formats; they demonstrate selected concepts without hardware or the vendor SDK.

## Read the code with its test

| Sample | Code and test | What it demonstrates |
| --- | --- | --- |
| Session timing | [band_session.c](../firmware-core/src/band_session.c); confirmation, brief-contact, and hysteresis cases in [test_firmware.c](../firmware-core/tests/test_firmware.c) | Confirmation windows, state transitions, and elapsed-time arithmetic |
| Motion features | [motion_features.c](../firmware-core/src/motion_features.c); window/orientation/hysteresis tests | A bounded rolling-window example with deterministic tests |
| Telemetry framing | [telemetry.c](../firmware-core/src/telemetry.c); integrity and sequence tests | Explicit little-endian encoding, checksums, validation, and gap accounting |

## Build and verification

Use the [CMake instructions](../firmware-core/README.md). The test executable
runs seven named test functions. CTest reports one test entry for that executable.

GitHub Actions builds these examples with CMake and runs them through CTest on pushes to main and on pull requests. [See the current build result](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml).

The [validation page](validation-status.md) describes public CI, private firmware tests and the device measurements still in progress.
