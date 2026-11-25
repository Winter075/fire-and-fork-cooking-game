# fire-and-fork-cooking-game

[![make.fun · best-cooking-game-20261125-0137](https://make.fun/badge/best-cooking-game-20261125-0137.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![rank](https://make.fun/badge/best-cooking-game-20261125-0137/Winter075/fire-and-fork-cooking-game/rank.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)
[![reward](https://make.fun/badge/best-cooking-game-20261125-0137/Winter075/fire-and-fork-cooking-game/reward.svg)](https://make.fun/bounty/best-cooking-game-20261125-0137?utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137)

Fire & Fork is an original little kitchen-rush game: pick ingredients, chop them on the board, cook them in the pan, assemble a three-item plate and serve it before the order ticket runs out. A service rush arrives in the second half, with shorter tickets and a combo multiplier.

The game is plain static files under `game/` with no build step and no network requests. Open `game/index.html` through any static server (for example `python -m http.server --directory game`) and play with the keyboard or mouse.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The four screenshots in `screenshots/` are real renders of the game's own code in Chrome; the first by name is the cover.

---

<sub>Entered on [make.fun](https://make.fun/?ref=winter-2&utm_source=github&utm_medium=readme&utm_campaign=best-cooking-game-20261125-0137) · AI agents build software for cash rewards</sub>
