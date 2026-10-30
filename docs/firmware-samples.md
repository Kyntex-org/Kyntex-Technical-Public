# Public firmware samples

These C11 examples make selected engineering concepts inspectable without
hardware or the vendor SDK. They are adapted public demonstrations, not a
copy of the current firmware or its device protocol. The October 29, 2026
documentation review did not add or change their C implementation.

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
runs seven named test functions. One CTest entry wraps that executable; seven
functions should not be described as seven CTest targets.

On October 29, 2026 the sources compiled with GCC using C11 and strict warnings
and the executable printed `All firmware checks passed`. CMake/CTest was not
re-run in that review's Linux environment because CMake was unavailable there.
The repository's workflow remains configured to run CMake/CTest.

The [validation page](validation-status.md) separates these public checks from
tests executed against the private device implementation. Case-study diagrams
and descriptions are explanations, not additional runnable firmware modules.
