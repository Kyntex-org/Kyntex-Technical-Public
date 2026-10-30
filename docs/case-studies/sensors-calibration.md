# Sensors and calibration

## Requirement and constraints

The firmware needs consistent motion and fit inputs across sensor sleep/wake cycles and session transitions. A sensor responding on the bus does not establish correct configuration or reliable sampling.

## Implementation approach

The reviewed IMU driver uses direct I2C register access for the sensor fitted to the current board. It tracks requested versus known sampling state and reports failed transitions. The main thread checks elapsed uptime, sleeps between checks and initiates reads when due; acquisition is not triggered by a sensor interrupt or an application timer callback.

Failed reads and missed sampling periods feed data-quality accounting. The source documents a board-sensor/SDK-driver mismatch; the narrow driver avoids changing the installed SDK.

Session admission depends on confirmed device state and the required configuration being applied. Calibration and sensing algorithms, constants and thresholds are not documented in this public case study.

Battery measurement enables the measurement circuit, waits asynchronously for settling, then lets the main thread finish the ADC read. This avoids putting the settling delay directly in the acquisition path.

## Tradeoffs

Thread-paced acquisition is straightforward to integrate, but other loop work and scheduling can delay reads. A configured sampling rate is not proof of the effective rate or jitter on hardware.

Explicit driver state makes failed power transitions observable. Retrying initialization or a power-state request is different from assuming the requested state was applied.

## Recorded evidence and remaining work

The October 29, 2026 development host review covered engine/session boundaries and profile admission. The public C examples have their own tests. Neither establishes physical IMU or ADC behavior.

Effective rate, jitter, missed-read accounting, mounting repeatability, power and interface behavior require device measurements. The earlier custom NINA-B302/nRF52 board remains in mixed-signal sensor-interface debugging.

[Public sample guide](../firmware-samples.md) · [Hardware revisions](../hardware/README.md) · [Validation evidence](../validation-status.md)
