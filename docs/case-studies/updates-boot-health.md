# Firmware updates and boot health

## Requirement and constraints

A signed firmware image still needs a controlled installation lifecycle.
The band should not accept disruptive update operations during a workout or
confirm a newly booted image before its required subsystems work.

## Implementation approach

```mermaid
flowchart LR
    A[Compatible image selected] --> B[Device eligibility checks]
    B --> C[Image-bound update window]
    C --> D[Transfer and image checks]
    D --> E[MCUboot test boot]
    E --> F{Required health checks pass}
    F -->|Yes| G[Confirm running image]
    F -->|No| H[Withhold confirmation]
    H --> I[Revert on a later reset]
```

The update window binds the intended image's identity and size to the request.
Management-operation policy checks workout state, battery validity/freshness,
and the current image's confirmation state. Transfer and image-state operations
are checked at the management boundary rather than relying only on an app UI.

MCUboot verifies the image signature. After a test boot, application health
checks own confirmation; a client must not bypass that decision by permanently
marking an image. A failed subsystem keeps confirmation pending, with recovery
behavior considered separately from a normal update.

## Tradeoffs

Confirming immediately after boot is simpler but can make a broken image
permanent. Health-gated confirmation adds state and recovery cases. Withholding
confirmation is not the same as an automatic reset: with my update policy, a test image can remain unconfirmed until a later reset. Persistent sensor-failure policy and
physical recovery behavior still need validation.

Image authenticity, transfer integrity, application eligibility, and ownership
authorization are different properties. Signed images do not establish who may
control a device. Production owner authentication remains unfinished.

## Verification

On October 29, 2026, my 30 combined boot-health, management-policy and update-contract host tests passed, along with the shared update vectors. I test
unknown/stale battery, active workouts, wrong-image binding, transfer completion,
reconnects, timeout, and refusal to bypass boot confirmation.

Physical transfer, interrupted updates and rollback remain on my device-validation checklist. The published signed images are separate release artifacts; host test results alone do not qualify them.

## Public material to inspect

Read the [architecture](../system-architecture.md) and
[validation table](../validation-status.md). Full update implementation,
device-specific commands, signing configuration, and keys are excluded from
the public samples. A useful interview walkthrough follows a successful
update and then repeats it with one failed boot-health check.
