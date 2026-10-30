# Hardware-free software demonstration

The public dashboard generates deterministic synthetic signals. It does not
connect to a physical Kyntex band, access Bluetooth, or require a cloud account.

## Run

From the repository root with Python 3:

```text
python -m http.server 8000
```

Open `http://localhost:8000/dashboard/`. Inspect the charts, session state,
history, and JSON/CSV exports. Restarting the stream exercises a new synthetic
session. This demonstration does not establish real sensor performance.

## Storage scope

The demo keeps at most 50 summaries, 6,000 samples per in-memory session, and
256 recent movement changes. Statistics continue accumulating after sample
retention is capped; partial exports are disclosed. Reload restores summaries,
not raw demo samples. Failed history writes are visible.

The full engineering dashboard has a different recording role, including
device diagnostics and durable raw capture. The public demo is not a copy of
that Bluetooth or persistence implementation.

## Tests

With Node.js 24 or later, `npm test` checks JavaScript syntax and runs seven
dashboard regression cases. See [dated verification](validation-status.md).
