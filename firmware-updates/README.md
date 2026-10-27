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

## Release status — October 27, 2026

The latest published update is **1.6.1-nrf54**, approved by the owner for the
existing iOS update feed. The signed application is 236,004 bytes. Its MCUboot
header, Device Information revision and manifest version agree. The SHA-256
checksum is recorded in `manifest.json`; the SHA-512 image hash and ED25519
signature were verified against the existing band's bootloader public key.
Bands must trust that signing key and support the KDFU/1 update contract.
The previous `1.6.0-nrf54` binary remains available.

The NCS 3.2.3 board build, firmware host suites and 116 dashboard tests passed.
This is not yet a hardware-validated production release: the iOS build checks
and physical iPhone-to-band transfer, restart, confirmation, interrupted-upload
and rollback tests remain pending. A signature establishes image authenticity;
it does not by itself establish authenticated access to the device.

In the iOS app, connect the band and open **Settings & About → Firmware Updates
→ Check for Updates**. Review the offered release and tap **Update Band**.
End the workout, charge the band to at least 40%, keep it close to the iPhone
and keep the app open. A band without the compatible bootloader or KDFU/1
capability needs a one-time USB-C setup first.

The public C modules are engineering samples, not a replacement firmware image.
See [development validation](../docs/validation-status.md) for current evidence.
