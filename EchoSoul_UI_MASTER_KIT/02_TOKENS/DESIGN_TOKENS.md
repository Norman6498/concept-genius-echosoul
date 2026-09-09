# EchoSoul Design Tokens

## Core palette
--ink: #050B10
--deep: #08131B
--panel: #0C1B25
--panel-2: #102531
--ivory: #F5EBD6
--muted-ivory: #CFC5B5
--gold: #D9A441
--gold-soft: #F2C86A
--gold-glow: rgba(242,200,106,.22)
--mist: #9AA8B0
--success: #8DBA8F
--danger: #D97777
--focus: #8FAED9

Use CSS variables; do not hard-code colors repeatedly.

## Typography
Display: Cormorant Garamond or another licensed/equivalent elegant serif.
Body/UI: Inter or another highly legible sans-serif.
Literary text: a high-quality serif with excellent Devanagari coverage when Hindi/Urdu-in-Devanagari is displayed.

Suggested hierarchy:
Display 56–88px desktop / 40–56px mobile
H1 40–56px
H2 28–40px
H3 20–28px
Body 15–18px
Caption 12–14px

Do not ship a font file from this kit. Load a properly licensed web font or self-host a licensed font in the project.

## Shape
Cards: 14–22px radius
Controls: 10–16px radius
Avoid excessive rounded “everything is a pill”.

## Borders
1px low-opacity warm border; stronger gold border only for active/important states.

## Shadows
Soft deep shadow + very restrained warm glow for primary actions.

## Spacing
Use an 8px base system. Prefer 16/24/32/48/64 spacing steps.
