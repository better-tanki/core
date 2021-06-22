# BetterTanki Core

# This project is abandoned

No new changes are expected to land.
I abandoned this project because of game's perfomance issues and falling number of online players.
You still can freely fork repository.

# Work in Process

A lot of features are in WIP state no documentation is provided.
There will be compile errors, ignore them.

# Miscellaneous snippets and resources

Available in [misc/](misc/) directory.
A lot of commented out snippets can be found in [src/early-init.ts](src/early-init.ts) file

## Keybinding

`Ctrl + Shift + I` - Toggle DevTools
`Ctrl + R` - Refresh page
~~`F2` - Toggle speedhack~~ (relevant code was deleted)
~~`F3` - Toggle spectator mode~~ (replaced with console)
`F3` - Toggle packets capture
`F4` - Toggle packets delaying
`F6` - Toggle packets ignore
`F9` - Toggle console
`F11` - Toggle fullscreen (already implemented in game)
`F12` - Make screenshot

## API

BetterTanki API is available through `Bt` global variable.
Game's Redux store is available through `Bt.Internals.TankiStore`
Game's Redux state is available through `Bt.Internals.TankiStore.state`
Refresh Redux store: `Bt.Internals.TankiStore.dispatchFunction({})`

## Features

`FEATURE(Assasans): SHIFT_ON_RIGHT-CLICK` - [src/preload.ts](src/preload.ts)
`FEATURE(Assasans): THEME_GLASS` - [src/preload.ts](src/preload.ts)
`FEATURE(Assasans): FATAL_ERROR_IGNORE` - [src/preload.ts](src/preload.ts)
`FEATURE(Assasans): IGNORE_CHAT_USERS` - [src/early-init.ts](src/early-init.ts)
`FEATURE(Assasans): CORE_MODIFICATIONS` - [src/early-init.ts](src/early-init.ts)
`FEATURE(Assasans): SCREENSHOT_ON_GOLD` - [src/early-init.ts](src/early-init.ts) (disabled by default)
`FEATURE(Assasans): WALLHACK` - [src/early-init.ts](src/early-init.ts)

## Why Shift is being pressed on right-click

This feature was implemented for Hopper events on Skyscrapers map
Search for `FEATURE(Assasans): SHIFT_ON_RIGHT-CLICK` in [src/preload.ts](src/preload.ts) to disable
