# Cranberry Hollow notes

## Phase 1 (this session)

A third-person chase runs in the browser. Tom Wattles is a low-poly turkey with a run cycle and a jump pose. Farmer Hank chases, lunges, searches, and corners. The track dresses itself as farmyard, then barn and porch, then kitchen (oven burst and carving knife). Lives, score, distance, a farmer gauge, and cue banners are on the HUD. Title and end cards sit over the live scene, with a restart button. WebAudio blips and a best-score save are in. `?shot=cover&seed=1` freezes a mid-jump farmyard near-miss. Cover screenshot is `screenshots/1-cover.jpg`.

## Missing for later phases

- Kitchen and title and end JPEGs are not in `screenshots/` yet (the scenes do render).
- The farmer's boots often sit on the bottom edge of the chase cam. Pull him fully into frame without shrinking the turkey.
- Tail fan and wing-flap should read bigger from behind. The knife can fill the lens when the camera clips it.
- Hide spots, decoy, and hats need a clearer on-screen tell. Barn chickens should squawk a visible SPOTTED.
- Escape woods ending needs its own pose and fanfare moment, not only the caught card.
- Stronger autumn contrast: deeper shadows, leaf piles, mud that reads as a hazard, oven heat haze.

## Ideas

Frame the kitchen shot so the oven door and the knife warning stripe are both obvious, with the turkey sliding under the blade. Give Hank a shout bubble ("Come back here, dinner!"). Add a side-step that is smoother than a lane snap so near-misses feel chosen.

## Phase 2

Hank now runs a real state machine: CHASE closes when Tom slows or is hit, SEARCH sweeps a lantern cone with a "?" while the out-of-sight meter fills (stay too long and he finds you), CORNER cuts across a lane with a red stripe and "!", LUNGE swings the net and a dodge is a near miss. Chickens squawk a SPOTTED. Hay, corn, barrels and cabinets hide; Q drops a decoy; Shift spends a stamina bar. Kitchen shows the oven burst and the carving knife slam. Banners, shake, feather puffs, hit flash and a short slow-mo are in, plus the fiddle loop and mute. Best score, best stage and hats show on the title and the caught card. All four shots are real frozen frames: cover chase, kitchen near-miss, title over the yard, caught end card.

## Phase 3

The chase cam sits lower so the yard fills the frame. Tom's tail is a wide bronze, rust, and cream fan that reads from behind, with wings out on the jump. Cover is a live mid-air near-miss: Hank in hat and plaid, net up, slim HUD (SCORE, DIST, LIVES, STAGE 1 FARMYARD, farmer gauge) and NEAR MISS!. The kitchen is a room: checkerboard, cabinets, ceiling, oven fire, and a carving knife with a red warning edge across the dodge, STAGE 3 KITCHEN. The title card sits on the live yard with both characters, the controls, and the best score. The caught card is on the right so Tom and Hank stay visible, with RUN AGAIN (R / ENTER). Sun is lower, fog is closer. All four JPEGs were recaptured under 256 KiB. `node main.ts` into out/ writes dossier.json, game/index.html, and the four shots.

## Phase 4

The kitchen shot was the weak frame: the blade sat in the lens as a white wall and hid the oven. The carving knife is now a pointed steel blade with a wood handle and a red edge, sitting on the checkerboard in front of Tom. The oven is dark iron with the door open and fire showing beside him. Tom stays a readable jump, Hank stays on the right, and the HUD still says STAGE 3 KITCHEN, NEAR MISS!, and FARMER 2.4 m. Cover, title, and end were left as they were. All four shot scenes render with no console errors. Two runs of main.ts wrote the same dossier.json. vendor/makefun-game.ts matches the kit. three.module.min.js was not touched. Pushed as "Final polish".
