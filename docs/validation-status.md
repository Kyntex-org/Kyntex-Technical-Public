# Validation evidence and limits

Updated October 29, 2026. Results below describe their named source snapshot
and test environment. They do not certify public release or physical reliability.

## Checks executed for this review

| Scope | Method and result | What it establishes | Limit |
| --- | --- | --- | --- |
| Public C samples | GCC C11 compile with strict warnings; test executable passed all seven named test functions | Public timing, motion-feature, framing, and sequence examples execute successfully | No board/SDK; one executable, not seven CTest targets |
| Public dashboard | Node.js regression suite: 7 passed, 0 failed | Bounded samples/history, delete/reload, persistence failures, malformed history, and partial exports | Synthetic data; no band connection |
| Development boot/update policy | 30/30 host ztest cases plus update vectors passed | Boot health, update eligibility, image binding, and window state | Private source; host shim, not physical MCUboot execution |
| Development engine/session logic | 28/28 host ztest cases passed | Session/calibration boundaries, movement/impact behavior, pause rules, and regression cases | Algorithm outputs are not physiological accuracy results |
| Development profile logic | Wire codec and admission checks passed | Profile validation and applied/stored generation predicates | Does not establish owner authentication |
| Development persistent store | 28 cases passed, including 9 interrupted-write sweep scenarios; vector checks passed | Simulated corruption/recovery, schema protection, identity, acknowledgement, and reclamation behavior | Simulated media, not physical flash timing or endurance |
| Development runtime integration | Integration executable reported all runtime tests passed | Real engine/recording logic over simulated storage; reconnects, bounded queues, recovery, clocks, and raw-stream independence | Does not compile or execute all Zephyr integration against the SDK |
| Development release gates | Gate-combination checks and SDK-stub/static checks passed | Disallowed history-control configurations fail; source boundaries remain explicit | Stub/static checks are weaker evidence than a target build |

The public source snapshot for the C/dashboard run was `54fd745`; the subsequent
portfolio changes do not alter that C or dashboard implementation. The development
firmware snapshot was `858ae65`. Host tests ran under Linux/GCC with AddressSanitizer
and UndefinedBehaviorSanitizer as configured by the development test harness.
The public GCC check did not use sanitizers. Public CMake/CTest was not rerun
in that Linux environment because CMake was unavailable.

## Reproduce the public checks

Use the [C sample build instructions](../firmware-core/README.md), run `npm test`
for the dashboard and JavaScript syntax, and `npm run check:docs` for Markdown
file links. The [configured workflow](../.github/workflows/validate.yml) runs
the public checks; read its actual result rather than inferring CI success
from a local result. The [evidence manifest](evidence/review-2026-10-29.json)
records the source identifiers and scope.

Private firmware tests are summarized here for context; their source and raw
logs are not published, so this public repository cannot independently reproduce
those development-suite results.

## Target and physical evidence

This review did not repeat an nRF Connect SDK build, QEMU run, iOS/Mac build,
physical sensor test, battery/power measurement, or Bluetooth update/rollback
test. Earlier October 3 documentation reported Mac builds/tests, a target build,
and 43 emulator cases; those are historical reports, not reruns against this
reviewed snapshot, and their raw artifacts were not re-inspected here.

Priority measurements remain effective sample rate and jitter, flash/erase
latency during sensing, stack headroom, power behavior, sensor/calibration
repeatability, and real-device disconnect/update/rollback scenarios.

History transfer is disabled by default pending owner authentication. Firmware
signing, a host authorization test, and engineering-only access do not prove
production enrollment or ownership protection. Sensor-derived training metrics
are not validated measures of joint force, tissue stress, or injury risk.
