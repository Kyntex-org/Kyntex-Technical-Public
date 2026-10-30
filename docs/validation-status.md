# Testing and validation

[![Build and test](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml/badge.svg?branch=main)](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml)

I use GitHub Actions to build and test the public examples on pushes to main and on pull requests.

## Public CI

| Check | What runs |
| --- | --- |
| Documentation | Relative Markdown file and image links are checked. |
| JavaScript | Syntax checks and the seven dashboard regression tests run with Node.js 24. |
| C examples | CMake builds the C11 modules with strict warnings, then CTest runs the test executable. That executable contains seven named test functions. |

[Open the build and test workflow](https://github.com/Kyntex-org/Kyntex-Technical-Public/actions/workflows/validate.yml) for the current result. The [workflow definition](../.github/workflows/validate.yml) shows the exact commands.

## Private firmware tests

I use host tests for boot-health checks, update eligibility, session behavior, profile admission, recording, recovery and build gates. On October 29, 2026, those development suites passed, including simulated interrupted writes, reconnects and full-store behavior.

These tests run the device logic against host shims and simulated storage. The implementation and its tests stay in the private repository; the public CI builds and tests the standalone examples published here.

The firmware application contains about 13,000 physical lines across its C source and header files, including comments and blank lines. The boot-health, update-policy, OTA-contract, workout-engine and offline-store suites contain 86 host tests, plus nine storage fault-injection sweeps. This is a count of those suites, not the entire firmware test collection.

## Device validation

The band is a working prototype. I am still validating physical timing, power and update behavior. The next measurements are:

- Effective sampling rate and jitter during storage and radio activity.
- Flash latency, stack headroom and power consumption.
- Sensor repeatability and missed-read accounting.
- Session continuity through disconnects and reconnects.
- Firmware transfer, test boot, confirmation and rollback on hardware.

History transfer remains disabled by default until owner authentication is implemented. Sensor-derived training metrics are not validated measurements of joint force, tissue stress or injury risk.

## Run the public checks

From the repository root:

```text
npm test
npm run check:docs
cmake -S firmware-core -B build/firmware
cmake --build build/firmware
ctest --test-dir build/firmware --output-on-failure
```

See the [C example guide](../firmware-core/README.md) for compiler requirements and the [dashboard demo](demo.md) for its synthetic-data scope.
