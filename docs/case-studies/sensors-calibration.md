# Sensors and calibration

## Requirement and constraints

The firmware needs consistent motion and fit inputs across sensor sleep/wake cycles and session transitions. A sensor responding on the bus does not establish correct configuration or reliable sampling.

## Implementation approach

I use direct I2C register access for the IMU fitted to the current board. I track requested versus known sampling state and report failed transitions. The main thread checks elapsed uptime, sleeps between checks and initiates reads when due; acquisition is not triggered by a sensor interrupt or an application timer callback.

The board uses an LSM6DS3TR-C, while the nRF Connect SDK 3.2.3 board declaration identifies an LSM6DSO. I use a narrow I2C driver to support the fitted sensor without changing the installed SDK. Failed reads and missed sampling periods feed data-quality accounting.

Session admission depends on confirmed device state and the required configuration being applied. Calibration and sensing algorithms, constants and thresholds are not documented in this public case study.

Battery measurement enables the measurement circuit, waits asynchronously for settling, then lets the main thread finish the ADC read. This avoids putting the settling delay directly in the acquisition path.

## Tradeoffs

Thread-paced acquisition is straightforward to integrate, but other loop work and scheduling can delay reads. A configured sampling rate is not proof of the effective rate or jitter on hardware.

Explicit driver state makes failed power transitions observable. Retrying initialization or a power-state request is different from assuming the requested state was applied.

## Testing and next measurements

I test session boundaries and profile admission with host tests. Public CI separately tests the standalone C examples.

My next device measurements cover effective rate, jitter, missed-read accounting, mounting repeatability and power. I am also debugging the mixed-signal sensor interfaces on the earlier custom NINA-B302/nRF52 board.

[Public sample guide](../firmware-samples.md) · [Hardware revisions](../hardware/README.md) · [Validation evidence](../validation-status.md)
