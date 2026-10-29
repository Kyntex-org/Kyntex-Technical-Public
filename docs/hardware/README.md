# Hardware design and bring-up

This section documents the progression from development-board prototypes to a
reviewable embedded product architecture. It is intended to show engineering
judgment, design ownership, and verification work without publishing sensitive
production details.

## Current hardware snapshot

| Item | Status |
| --- | --- |
| Custom V1 PCB | Fabricated |
| Core module | u-blox NINA-B302 / Nordic nRF52 architecture |
| Power-up | Verified |
| J-Link/SWD access | Verified |
| Sensor interfaces | Debugging in progress |
| Design tools | KiCad and Altium Designer |

## Documentation areas

- [Altium documentation template — incomplete](altium/README.md) — schematic, layout, design
  decisions, and review exports
- [Technical architecture](../technology.md) — system-level data path and
  embedded stack
- [Development roadmap](../roadmap.md) — completed foundations and remaining
  validation work

## Bring-up evidence to add

The strongest portfolio evidence is concise and visual. Add only artifacts that
you are comfortable making public:

1. An annotated board photograph with major functional blocks labeled.
2. A power-rail checklist showing expected and measured values.
3. A J-Link/SWD connection screenshot or debugger log.
4. A short sensor-interface debug note: symptom, hypothesis, measurement, and
   next revision.
5. A revision summary explaining what V1 proved and what will change in V2.

## Scope and claims

The board has completed initial power and programming bring-up. Individual
sensor interfaces should be marked **verified**, **in progress**, or **not
tested**. Do not describe the revision as fully validated until every stated
function has a repeatable test result.
