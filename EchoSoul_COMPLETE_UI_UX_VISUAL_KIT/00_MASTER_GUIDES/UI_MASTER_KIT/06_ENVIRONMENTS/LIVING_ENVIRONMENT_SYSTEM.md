# Living Environment System

EchoSoul environments are layered cinematic spaces, never a single flat background.

## Layer stack
1. sky / base atmosphere
2. sun or moon
3. stars
4. distant clouds
5. distant mountains / skyline
6. midground trees / architecture
7. windows / curtains / plants
8. lamps / candles / local light sources
9. foreground leaves / grass / objects
10. mist / rain / snow
11. particles / light motes
12. UI glass and content

## Interactions
- Clouds drift independently.
- Leaves sway with irregular timing and low amplitude.
- Lamps/candles flicker and glow.
- Light sources subtly brighten nearby surfaces.
- Mountains use extremely subtle parallax/haze.
- Weather can change gradually.
- Cursor creates local, restrained influence; never make the whole scene chase the cursor.
- Scroll can change environmental depth/state.
- Scenes can respond to user-selected intent and context.

## Performance
Prefer CSS transforms, Motion, Canvas only where necessary, and pre-rendered video for complex cinematic sequences.
Pause/degrade animation when tab is hidden or device performance is poor.
