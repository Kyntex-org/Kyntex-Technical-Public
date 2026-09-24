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
