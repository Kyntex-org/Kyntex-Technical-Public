# Current solution

Kyntex combines an embedded sensor platform with native and browser-based
companion applications, joined by one explicitly versioned data contract.

## On the device

- A six-axis IMU captures acceleration and angular velocity.
- A force-sensitive resistor estimates relative band fit.
- The workout engine derives explainable motion features and event counts.
- Versioned BLE notifications carry checksums and version-specific recording-integrity information.
- Event-driven acquisition and asynchronous battery measurement reduce
  unnecessary processor and sensor activity.

## In the applications

- Live views show motion, fit, battery, and workout state.
- Current applications accept nRF54 V3–V5 telemetry; Arduino V2 telemetry is retired.
- Raw samples are written incrementally instead of growing an unbounded memory
  buffer.
- Session summaries record observed gaps and remain exportable as CSV or JSON.
- The web portfolio demo uses deterministic synthetic data and requires no
  physical hardware.

The native app also includes tested session recovery and deletion behavior,
guided sample experiences separated from real workout data, accessibility
improvements, and an accessible third-party license viewer. No Kyntex sign-in is
required for the current local-first experience.

The public demo is a separate synthetic-data application. It keeps 50 summaries,
up to 6,000 samples per in-memory session, and 256 recent movement changes.
Sample exports are identified as partial when the cap is reached. Browser
reload restores summaries, not raw demo samples.

## Why two companion applications?

The web dashboard provides a fast, installable interface on browsers that
support Web Bluetooth. The SwiftUI app uses CoreBluetooth for native iPhone
support. Keeping the protocol boundary explicit lets both clients interpret the
same versioned device data while using platform-appropriate storage.
