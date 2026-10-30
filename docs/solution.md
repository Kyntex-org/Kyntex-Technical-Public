# Current solution

The band acquires motion and fit inputs, applies calibrated processing and
confirmed session transitions, and supplies versioned Bluetooth summaries.
The native iOS app is the consumer companion; the browser dashboard is an
engineering tool. The local-first experience does not require a Kyntex account.

See [system architecture](system-architecture.md) for the maintained data path
and execution contexts. The [public demo](demo.md) is a separate synthetic
application: it bounds retained samples/history and labels partial exports.
It does not connect to a band or reproduce full device recording.

[Project scope](project-overview.md) ·
[Evidence and limitations](validation-status.md)
