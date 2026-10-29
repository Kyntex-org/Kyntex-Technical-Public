# Firmware examples

Three hardware-independent C11 examples demonstrate session confirmation,
rolling motion features, and telemetry integrity. They are adapted public
demonstrations of Kyntex concepts, not the complete current device logic.

Read the [sample guide](../docs/firmware-samples.md) for code-to-test links,
provenance, and the differences from the current band. The sample packet layout
is not wire-compatible with a Kyntex device. Configuration values are test
fixtures, not current product calibration values.

## Build and test

With CMake 3.20 or later and a C compiler:

```text
cmake -S firmware-core -B build/firmware
cmake --build build/firmware
ctest --test-dir build/firmware --output-on-failure
```

Run these commands from the repository root. The one test executable contains
seven named test functions for confirmation, brief-contact rejection, motion
orientation/windowing/hysteresis, packet corruption, and sequence accounting.

For a direct GCC check without CMake, also from the repository root:

```sh
gcc -std=c11 -Wall -Wextra -Wpedantic -Werror -Ifirmware-core/include   firmware-core/src/band_session.c firmware-core/src/motion_features.c   firmware-core/src/telemetry.c firmware-core/tests/test_firmware.c   -lm -o /tmp/kyntex-firmware-tests
/tmp/kyntex-firmware-tests
```

This last command uses a POSIX shell and GCC. On Windows, use the CMake route
with an installed compiler or run the GCC command in a Linux environment.
