# Development validation and release status

Updated October 3, 2026. Launch-readiness work is integrated, but the product is
not represented here as publicly released or ready for unrestricted use.

## Production development evidence

| Evidence | Result and scope |
| --- | --- |
| Owner's Mac report | 42 package tests, 119 app tests, four UI tests, both unsigned Release builds, and both defect-specific fail-before/pass-after proofs passed; raw Mac result bundles were not independently inspected by the coordinator |
| Dashboard | 14 production dashboard tests passed locally |
| Firmware logic | 30 host cases passed with Linux AddressSanitizer/UndefinedBehaviorSanitizer; 45 shared contract vectors passed |
| Real board build | nRF54 development-signed sysbuild passed; compiled SHA-512 configuration and signed-image hash verified |
| Firmware emulator | All 43 QEMU cases passed: boot health, management policy, OTA contract, and workout engine |

QEMU exposed a test-harness stack overflow: a roughly 4 KB test frame exceeded
the 2 KB default test stack. The test stack was increased to 8 KB, preserving
assertions and production behavior; the full suite then passed.

These results belong to the private integrated implementation. Public C modules
and dashboard code have their own independently runnable tests; the counts
above are not a claim that production source is mirrored here.

## Public repository checks

Run `npm test` for JavaScript syntax and seven dashboard regression cases. Run
the CMake/CTest commands in the README for the C11 sample suite. GitHub workflows
are configured; their status must be read from the actual run rather than
inferred from local results. Production Actions execution has been blocked by
account billing, not by executed test failures.

## Remaining launch work

Authenticated device enrollment/access, unrecoverable-sensor boot policy,
physical update/rollback and session validation, production signing, final
privacy/export declarations, support ownership, device scope, and App Store
submission remain separate requirements. Local tests do not establish clinical
accuracy, real-device reliability, regulatory status, or production key custody.

Existing public firmware artifacts are historical releases. This documentation
update does not publish a new production-signed image or certify those artifacts
as containing the integrated launch changes.
