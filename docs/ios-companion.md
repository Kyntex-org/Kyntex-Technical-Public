# iOS companion app case study

The Kyntex iOS application is a native SwiftUI and CoreBluetooth client for the
wearable. Its job is to make connection quality, band fit, live movement, and
session load understandable without exposing the underlying sensor pipeline to
the athlete.

## Product flow

1. **Onboarding and fit** — setup explains placement below the kneecap, connects
   the band, and confirms a stable fit.
2. **Personal calibration** — the user stands naturally and then walks at a
   comfortable pace. The app derives a personal baseline and sends the compact
   profile to compatible firmware.
3. **Live workout** — Kynny walks, runs, or jumps with the detected activity.
   A settle delay prevents the character from snapping to idle during a brief
   hesitation.
4. **Background feedback** — ActivityKit keeps elapsed time, activity, steps,
   and load visible through a Live Activity while the app is backgrounded.
5. **Pause and recap** — pausing brings up the information most useful during
   the session; ending produces a focused recap.
6. **History** — a side drawer exposes recent sessions, weekly load, and
   lifetime totals. Deleting a session removes its summary and associated raw
   recording.

## Application structure

| Component | Responsibility |
| --- | --- |
| SwiftUI views | Setup, live dashboard, calibration flow, history, recap, and explanatory sheets |
| App model | Session lifecycle, bounded chart data, calibration samples, history, export, and mascot smoothing |
| BLE manager | Discovery, connection restoration, reconnect backoff, subscriptions, writes, and compatibility checks |
| Protocol layer | Checksum validation and backward-compatible decoding of versioned binary telemetry |
| ActivityKit controller | Starts, updates, animates, and ends the lock-screen/Dynamic Island Live Activity |
| Local persistence | Bounded summaries plus per-session raw CSV files stored outside the UI state |

## Knee Load UX

The interface presents three related values:

- **Motion Load** accumulates personalized acceleration and lower-leg rotation
  over time with walking, running, and squatting context.
- **Impact Load** captures landing severity using the measured landing window.
- **Knee Load** is the combined session total.

Landing windows are excluded from Motion Load before Impact Load is added.
Step and jump counts are descriptive and do not add fixed bonus points. The
information sheet explicitly describes the score as a personal movement proxy,
not a clinical measurement of knee force or injury risk.

## Reliability decisions

- Protocol versions are validated before a connection is declared ready.
- Raw samples include integrity counters, allowing exports to identify gaps.
- Reconnect work is single-flight with bounded backoff.
- Calibration writes are sequenced before the temporary calibration session is
  stopped, preventing one command from replacing another.
- Old saved sessions remain decodable when new optional fields are introduced.
- Long recordings stream to disk instead of remaining entirely in memory.

## Public scope

The production iOS source is not mirrored here because it contains the private
device protocol and product-specific calibration implementation. This case
study documents the architecture, user experience, reliability work, and
engineering limits that are appropriate for portfolio review.
