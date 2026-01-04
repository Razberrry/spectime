# spectime

<img width="1440" height="781" alt="Screenshot 2026-01-04 at 10 33 39" src="https://github.com/user-attachments/assets/6575ce2d-4fda-4036-a34f-49dd19900cef" />
<img width="1440" height="778" alt="Screenshot 2026-01-04 at 10 33 49" src="https://github.com/user-attachments/assets/16928284-1c38-4ff9-a858-1eff496f9a11" />

`spectime` is an opinionated UI layer on top of my library  `chronon-timeline`.


## Interaction controls

- Scroll (mouse wheel / trackpad) or drag the scrollbar to move vertically through rows.
- Click + drag to pan left/right through time.
- Hold `Ctrl` (or `⌘ Cmd` on macOS) and scroll over the timeline to zoom in/out.


It doesn’t reimplement the timeline engine — you still use `chronon-timeline` for the core primitives (`Timeline`, `Row`, `Subrow`, `Item`), the data model (`Range`, `RowDefinition`, `ItemDefinition`), and state helpers like `useTimeline()` (re-exported as `useSpectimeTimeline()` from `spectime`). `spectime` adds styling, convenience wrappers, and a small hook for turning a flat list of items into subrows (lanes).

## Composition pattern (how you build UIs with it)

`chronon-timeline` is built around the composition pattern: instead of a single “mega timeline component”, you compose a timeline from small primitives:

- `Timeline` (shell + context)
- `TimeAxis` (markers/labels)
- `Row` (one row in the timeline, with optional sidebar)
- `Subrow` (a lane inside a row)
- `Item` (a span in time)

`spectime` keeps that same model: you compose your own layout, but with pre-styled wrappers and a helper hook for lane packing.

Mentally, it looks like:

```
SpectimeTimelineProvider (context + interactions)
  SpectimeTimelineContainer (shell)
    SpectimeTimeAxis (headers)
    SpectimeRow[] (rows)
      SpectimeSubrow[] (lanes)
        SpectimeItem[] (items)
```

## Installation

`spectime` depends on `chronon-timeline` and expects these peer deps to be installed in your app:

```sh
npm i spectime chronon-timeline react react-dom react-virtuoso
```

## Building blocks (what each exported piece does)

Core wrappers:
- `SpectimeTimelineProvider`: wraps `TimelineContextProvider` and enables mouse pan/zoom + “autopan until user interaction”; exposes `useSpectimeTimelineContext()` for `resetAutopan()`.
- `SpectimeTimelineContainer`: wraps `Timeline` and applies the Spectime shell styling (and default RTL direction unless you override).
- `SpectimeTimeAxis`: renders the main time axis (plus the smaller hour axis + optional highlight row) using Spectime’s marker definitions.
- `SpectimeRow`: wraps `chronon-timeline`’s `VirtualizedRow` and turns on `virtualizeSubrows` (subrow virtualization) for better performance with many lanes.
- `SpectimeSubrow`: a styled wrapper around `Subrow`.
- `SpectimeItem`: a styled wrapper around `Item` with an inner container for your custom content.

Common add-ons:
- `SpectimeSidebar`: a styled sidebar renderer you can pass as `sidebar` to a row.
- `SpectimeTimeCursor` / `SpectimeCurrentTimeCursor`: cursor components for rendering “now” or an arbitrary timestamp.

Helpers/hooks:
- `useSpectimeTimeline`: re-export of `chronon-timeline`’s `useTimeline()` hook (range + zoom state).
- `useVisibleTimelineItems`: groups items into non-overlapping lanes (subrows) for the current visible range (must be used inside `SpectimeTimelineProvider`).
- `currentTimeAtom`: a Jotai atom that ticks `Date.now()` every second (used by `SpectimeCurrentTimeCursor` and autopan).

## Basic usage

```tsx
import { useState } from 'react';
import type { ItemDefinition, Range, RowDefinition } from 'chronon-timeline';

import {
  SpectimeItem,
  SpectimeRow,
  SpectimeSubrow,
  SpectimeTimeAxis,
  SpectimeTimelineContainer,
  SpectimeTimelineProvider,
  currentTimeAtom,
  useSpectimeTimeline,
  useVisibleTimelineItems,
} from 'spectime';

export const MyTimeline = ({
  rows,
  items,
}: {
  rows: RowDefinition[];
  items: ItemDefinition[];
}) => {
  const [range, setRange] = useState<Range>(() => {
    const now = Date.now();
    return { start: now - 60 * 60 * 1000, end: now + 60 * 60 * 1000 };
  });

  const timeline = useSpectimeTimeline({ range, setRange });

  return (
    <SpectimeTimelineProvider {...timeline} currentTimeAtom={currentTimeAtom}>
      <TimelineContents rows={rows} items={items} />
    </SpectimeTimelineProvider>
  );
};

const TimelineContents = ({
  rows,
  items,
}: {
  rows: RowDefinition[];
  items: ItemDefinition[];
}) => {
  const SUBROW_HEIGHT_PX = 60;

  const { subrowsByRow, rowIdWithMostVisibleLanes, isWeekly } = useVisibleTimelineItems({
    rows,
    items,
  });

  return (
    <SpectimeTimelineContainer>
      <SpectimeTimeAxis isWeekly={isWeekly} />

      {rows.map((row) => (
        <SpectimeRow
          key={row.id}
          {...row}
          subrowHeight={SUBROW_HEIGHT_PX}
          ignoreRefs={row.id !== rowIdWithMostVisibleLanes}
        >
          {(subrowsByRow[row.id] ?? []).map((lane, laneIndex) => (
            <SpectimeSubrow key={`${row.id}-${laneIndex}`}>
              {lane.map((item) => (
                <SpectimeItem key={item.id} id={item.id} span={item.span}>
                  {String(item.id)}
                </SpectimeItem>
              ))}
            </SpectimeSubrow>
          ))}
        </SpectimeRow>
      ))}
    </SpectimeTimelineContainer>
  );
};
```

Notes:
- `SpectimeRow` wraps `chronon-timeline`’s `VirtualizedRow` and enables `virtualizeSubrows` by default.
- This package ships styles bundled into the JS build (no separate CSS import).

## Subrows (lanes) and `useVisibleTimelineItems`

In `chronon-timeline`, each `Row` can contain multiple `Subrow`s. A subrow is effectively a “lane” used to display items that would otherwise overlap in time.

`useVisibleTimelineItems({ rows, items })` is a convenience hook that:
- Must be called from a component rendered inside `SpectimeTimelineProvider` (it reads the current `range` from timeline context).
- Filters items to what intersects the current timeline range.
- Groups items by `rowId` and packs them into the minimum number of non-overlapping lanes (subrows) so items in the same lane never overlap in time.
- Exposes `isWeekly`, a boolean derived from the current visible range size, which is typically used to switch time-axis marker density and to optionally expand item spans to full-day blocks when zoomed out.

Return shape:
- `subrowsByRow`: `Record<string, ItemDefinition[][]>` (each inner array is one lane/subrow)
- `rowIdWithMostVisibleLanes`: a helper for the `ignoreRefs` optimization pattern
- `isWeekly`: whether the visible range is “zoomed out” (currently ~3+ days)

### Why a fixed `subrowHeight` helps performance

`subrowHeight` is intentionally a required input, because it removes a whole class of expensive layout work:

- **No DOM measuring for lane sizing.** When every subrow has a known fixed height, the row layout can be expressed via a single CSS variable (`--tl-subrow-height`) instead of repeatedly measuring content.
- **Virtualization becomes predictable.** `SpectimeRow` uses `VirtualizedRow` + `react-virtuoso` for subrow virtualization. A stable `subrowHeight` lets the virtualizer compute scroll offsets and overscan purely from math (`defaultItemHeight`), instead of doing extra work to guess/measure heights.
- **Less churn when lots of subrows exist.** If you have many lanes, keeping their height fixed prevents “useless recalculations” (reflow/relayout passes triggered by variable heights) and makes scrolling/panning smoother.

Practical tip: treat `subrowHeight` as a constant per zoom mode (e.g. `60` for dense view, `40` for weekly), and avoid dynamically changing it per lane.

## Provider helpers

`SpectimeTimelineProvider` is a thin wrapper around `chronon-timeline`’s `TimelineContextProvider` that also enables:
- mouse pan + zoom
- auto-pan that keeps “now” moving until the user interacts

If you need access to timeline context plus `resetAutopan()`, use `useSpectimeTimelineContext()`. This is useful when you jump the range programmatically (e.g. a “preset range” toolbar) and want auto-pan to resume.

## Local demo (this repo)

This repo contains dev-only examples under `src/examples/*` (not shipped in the npm package):

```sh
npm install
npm run dev
```
