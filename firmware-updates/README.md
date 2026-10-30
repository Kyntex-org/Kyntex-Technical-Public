# Compatibility firmware update feeds

These existing feed URLs remain available for installed clients while firmware distribution moves to [Kyntex-Firmware-Updates](https://github.com/Kyntex-org/Kyntex-Firmware-Updates). Publishing the dedicated repository does not by itself migrate installed clients. Do not remove or redirect these URLs until client migration is validated.

## Retained feeds

| Feed | Referenced signed firmware |
| --- | --- |
| [Legacy manifest](manifest.json) | 1.6.1-nrf54 |
| [Profile-capable manifest](profile-v1/manifest.json) | 1.6.2-nrf54 |

The compatibility feeds remain separate. Each manifest records its hardware and firmware requirements, package URL, digest and applicable compatibility fields. This documentation update changes no manifest or image bytes.

The earlier 1.6.0-nrf54 signed image is also retained. These binaries are not the hardware-independent examples under [firmware-core](../firmware-core/README.md).

## Verification boundary

A signature establishes image authenticity; a matching download digest establishes byte integrity. Neither proves authenticated device ownership or physical update/rollback reliability.

The portfolio summarizes historical host checks in [validation evidence](../docs/validation-status.md). It does not publish a new firmware release or claim new target/device validation.
