# Development roadmap

Updated October 3, 2026. Completed engineering work is distinct from public
release approval, physical-device evidence, and future product plans.

## Integrated software foundation

- nRF54L15/nRF Connect SDK firmware and V3–V5 companion telemetry support
- Arduino/nRF52840 firmware archived and V2 telemetry paths retired
- workout save/recovery and deletion fixes, with defect-specific regression proofs
- bounded firmware-download buffering and coordinated update/retry handling
- boot-health confirmation safeguards and signed-image development builds
- accessible navigation, Reduce Motion support, and isolated sample walkthroughs
- bundled license notices and revised in-app privacy/storage disclosures
- iOS, dashboard, contract, and firmware regression/build workflows

The owner's Mac validation report records 42 package tests, 119 app tests,
four UI tests, unsigned Release builds, and both fail-before/pass-after proofs.
Coordinator validation also passed 30 firmware host cases with Linux sanitizers,
45 shared contract vectors, a real nRF54 development build, and 43 QEMU cases.
These are local development results; they do not establish physical reliability
or clinical accuracy. GitHub Actions execution is currently billing-blocked.

## Before public launch

- finish authenticated device access and enrollment policy/implementation
- resolve the boot policy for sensors that never recover
- validate fit, battery calibration, power behavior, update/rollback, and
  delete/relaunch behavior on physical bands
- finish Apple team/signing, supported-device scope, support ownership, and
  privacy/export declarations; inspect the final distribution archive
- complete production signing and owner-approved beta/store submission

## Product development

- prioritize the changes needed for the first useful customer experience
- test revised flows and firmware behavior before public distribution
- evaluate hardware sales and optional recurring services against customer
  demand and actual support/manufacturing costs
- add accounts only when features such as cloud sync or coach sharing need them

There is no announced subscription requirement, account requirement, price, or
release date. The current companion app stores data locally without sign-in.

## Hardware and algorithm work

- continue XIAO assembly validation and custom PCB bring-up with accessible SWD
- add hardware-in-the-loop regression testing and power profiling
- define a labeled recording protocol and data dictionary
- collect across users and placements; use subject-separated validation
- compare learned models against the explainable threshold baseline

## Research track

Tendon-response or relative-stiffness sensing would require dedicated hardware
and controlled validation. It remains exploratory, not a current capability.
