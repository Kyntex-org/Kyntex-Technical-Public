# Review Kyntex in five minutes

Kyntex combines a physical wearable, embedded firmware, a Bluetooth boundary,
and companion applications. Ben Harris is co-founder and sole engineer. This
portfolio is a selected public view of the project, not the full device source.

## A short review

1. Read the [README architecture and engineering highlights](../README.md).
2. Follow one [recording and recovery](case-studies/recording-recovery.md) or
   [update and boot-health](case-studies/updates-boot-health.md) decision.
3. Inspect a [public C sample and its test](firmware-samples.md).
4. Read the [validation table](validation-status.md) for what was actually run.
5. Use the [hardware revision table](hardware/README.md) to distinguish the
   current development platform from earlier custom-board work.

## Topics for a technical discussion

| Topic | Useful questions |
| --- | --- |
| Recording | What continues after a disconnection? What happens when storage or a queue fills? |
| Recovery | Which state is durable? What can be lost since the last checkpoint? |
| Concurrency | Which execution context owns storage? Which operations must not block sampling? |
| Updates | What permits an update? Who confirms a newly booted image? |
| Sensors | How does timed acquisition work? What does calibration correct? |
| Compatibility | How are unsupported data formats and old device generations handled? |

## Independently runnable material

The [C samples](../firmware-core/README.md) and [synthetic dashboard](demo.md)
can be run without a band. They demonstrate selected concepts and are not
wire-compatible replacements for the device implementation. Real band photos
and a real-device video are currently marked as placeholders.
