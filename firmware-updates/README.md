# Kyntex firmware updates

This folder hosts signed firmware images and the small manifest read by the
Kyntex iOS app. A connected band is offered an update only when the manifest is
for its hardware, its current firmware already supports Bluetooth updates, and
the listed version is newer.

Release images are cryptographically signed. The iOS app also verifies the
published SHA-256 digest before transfer. The private signing key is not stored
in this public repository.

Firmware older than `1.6.0-nrf54` requires a one-time USB-C update before it can
receive later releases over Bluetooth.

## Release status — October 3, 2026

The existing manifest and signed image are retained as the previously published
release. They have not been replaced with a development build. The integrated
launch-readiness implementation includes additional update/retry and boot-health
safeguards, but a new production-signed release still requires physical
validation and owner approval. A signature establishes image authenticity; it
does not by itself establish authenticated access to the device.

The public C modules are engineering samples, not a replacement firmware image.
See [development validation](../docs/validation-status.md) for current evidence.
