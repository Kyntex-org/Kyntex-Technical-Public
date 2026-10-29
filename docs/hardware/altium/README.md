# Altium design documentation template

> Incomplete template preserved from the former project overview repository.
> Bracketed prompts and suggested exports are not completed design evidence.

Use this page to present Altium work as an engineering case study rather than a
raw file dump. Replace the bracketed prompts as documentation becomes ready.

## Design overview

- **Board/revision:** [name and revision]
- **Purpose:** [one-sentence description]
- **Your role:** schematic capture, component selection, PCB layout, design
  review, fabrication package, and/or bring-up
- **Tool version:** [Altium Designer version]
- **Status:** concept, routed, fabricated, or validated

## System architecture

[Add a block diagram or short description of the power, processing, sensing,
communications, and programming/debug sections.]

## Design decisions

Document three to five decisions that demonstrate judgment. Useful examples
include:

- power-tree and regulator selection;
- analog/digital grounding and return paths;
- sensor placement and routing constraints;
- USB, ESD, battery, and charging protection;
- SWD/J-Link access and manufacturing test points; and
- component availability and package tradeoffs.

## Review images

Add recruiter-friendly PNG or PDF exports and link them here:

- [Schematic overview]
- [PCB top-layer view]
- [PCB bottom-layer view]
- [3D board render]
- [Fabricated board photograph]

Keep each caption focused on what the image proves. Avoid screenshots that are
too dense to read at normal GitHub width.

## Verification and bring-up

| Test | Expected result | Measured result | Status |
| --- | --- | --- | --- |
| Input power | [value] | [value] | Not documented |
| Main rail | [value] | [value] | Not documented |
| SWD/J-Link connection | Device identified | [result] | Not documented |
| Sensor interface 1 | [result] | [result] | Not documented |
| Sensor interface 2 | [result] | [result] | Not documented |

## Known issues and next revision

[Describe observed failures without hiding them. State the evidence, likely
cause, and the change planned for the next board revision.]

## Suggested public file structure

```text
altium/
├── README.md
├── images/
│   ├── schematic-overview.png
│   ├── pcb-top.png
│   ├── pcb-bottom.png
│   ├── board-3d.png
│   └── fabricated-board.jpg
└── exports/
    ├── schematic.pdf
    └── fabrication-drawing.pdf
```

## Before publishing

- Remove API keys, credentials, serial numbers, personal addresses, and vendor
  account details.
- Confirm that every third-party symbol, footprint, and reference document may
  be redistributed.
- Exclude proprietary calibration values, product-specific protocol details,
  and confidential manufacturing data.
- Export review PDFs and images instead of publishing editable source files
  unless you intentionally want to release the design.
- Verify that all claims match repeatable bench evidence.
