# Public firmware samples

I use these standalone C11 examples to demonstrate selected engineering concepts without hardware or the vendor SDK. Their interfaces and test configuration differ from the private device implementation.

## Read the code with its test

| Sample | Code and test | What it demonstrates | Difference from the band |
| --- | --- | --- | --- |
| Session timing | [band_session.c](../firmware-core/src/band_session.c); confirmation, brief-contact, and hysteresis cases in [test_firmware.c](../firmware-core/tests/test_firmware.c) | Confirmation windows, state transitions, and elapsed-time arithmetic | Standalone state/timing example; the complete device session logic remains private |
| Motion features | [motion_features.c](../firmware-core/src/motion_features.c); window/orientation/hysteresis tests | A bounded rolling-window example with deterministic tests | An illustrative public example; not the complete sensing or training-metric implementation |
| Telemetry framing | [telemetry.c](../firmware-core/src/telemetry.c); integrity and sequence tests | Explicit little-endian encoding, checksums, validation, and gap accounting | Uses a standalone example envelope, not the band packet layout, UUIDs, or command set |

The sample constants describe its tests. They are not device calibration values
or recommended physiological thresholds. Array/window sizing and test sample
rates should not be read as measured hardware performance.

## Build and verification

Use the [CMake instructions](../firmware-core/README.md). The test executable
runs seven named test functions. CTest reports one test entry for that executable.

GitHub Actions builds these examples with CMake and runs them through CTest on pushes to main and on pull requests. [See the current build result](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml).

The [validation page](validation-status.md) describes public CI, private firmware tests and the device measurements still in progress.
