# Problem and design goals

Wearable prototypes often produce attractive live charts without answering
three harder engineering questions:

1. Was the device fitted consistently enough for the data to be useful?
2. Was the entire training session captured without silent packet or sample
   loss?
3. Can a user review trends later without the application exhausting memory or
   losing the raw record?

Kyntex treats those three questions as the product, not as afterthoughts. Fit
sensing gates capture on confirmed band contact, explicit integrity metadata
makes any gap in the record visible, and durable session storage keeps the raw
data intact without exhausting memory. Motion summaries are designed as
engineering feedback, not as diagnoses or predictions about injury.

## Design goals

- clear feedback while fitting and using the band
- repeatable, timestamped motion capture across long sessions
- visible accounting for missing samples and reconnections
- companion applications that work without a cloud dependency
- a firmware architecture that can move from development hardware to a
  production programming and update process
- conservative language around unvalidated sensor-derived metrics

## Out of scope today

The current prototype does not measure tendon stiffness, diagnose pain, assess
injury risk, or recommend return-to-sport decisions. Those claims would require
different sensing hardware and controlled validation.
