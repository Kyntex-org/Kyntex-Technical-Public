# Sensor integration and calibration

## Requirement and constraints

The device needs consistent motion and fit inputs across mounting positions,
sensor sleep/wake cycles, and session transitions. A sensor's apparent presence
does not prove its initialization, scaling, or power-state behavior is correct.

## Implementation approach

The reviewed IMU driver uses direct I2C register access for the actual sensor
fitted to the current board. It tracks requested versus known sampling state,
reports failed transitions, and uses timed waits rather than an interrupt
callback. The source documents a mismatch between the board sensor and an SDK
driver declaration; the narrow driver avoids changing the installed SDK.

Static calibration estimates gyro offset and corrects acceleration magnitude.
It preserves physical axes rather than assuming a particular axis points up.
A single static pose cannot independently identify every axis bias. Filtered
values feed the workout engine; calibrated, unfiltered values are available
for optional engineering/calibration capture. Failed reads and timing stalls
contribute to missed-sample accounting.

Fit input uses median filtering, a loose baseline, and confirmed session
transitions. Athlete calibration and stored configuration must match the
engine's applied state before recording is admitted. Sensor calibration and
personal movement calibration have different purposes.

## Tradeoffs

Timed sampling is straightforward to integrate but needs physical timing and
rate measurements. A requested rate is not proof that every sensor sample was
acquired. Filtering suppresses noise while altering peaks and delay; retaining
an unfiltered capture path helps separate those effects during validation.

Battery measurement enables its divider, waits asynchronously for settling,
then completes the ADC read. Voltage-based charge estimation is a proxy;
battery health is not inferred from one voltage measurement.

## Verification and remaining evidence

The October 29, 2026 host suite passed engine/session boundaries and profile
codec/admission checks. The public samples exercise motion windowing,
orientation handling, and classification hysteresis. Those tests do not
exercise the physical IMU or ADC driver. Actual rate, jitter, clipping, mounting
repeatability, power consumption, and accuracy require recorded device data.

## Public material to inspect

- [Motion features and tests](../firmware-samples.md)
- [Hardware revisions and available artifacts](../hardware/README.md)
- [Validation scope](../validation-status.md)
- [Personal debugging narrative - placeholder](debugging-story.md)

The implementation explanation above is source-based. The author's personal
investigation, measurements, and decisions are not inferred from commit authorship.
