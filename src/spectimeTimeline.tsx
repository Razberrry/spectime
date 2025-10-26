import {
  groupItemsToSubrows,
  HOUR_AXIS_MARKERS,
  ItemDefinition,
  RowDefinition,
  TIME_AXIS_MARKERS,
  useTimelineBehavior,
  useTimelineContext,
} from 'chronon-timeline';
import React, { useMemo } from 'react';
import { SpectimeItem } from './SpectimeItem';
import { SpectimeRow } from './SpectimeRow';
import { SpectimeSidebar } from './SpectimeSidebar';
import { SpectimeSubrow } from './SpectimeSubrow';
import { SpectimeTimeAxis } from './SpectimeTimeAxis';
import { SpectimeTimeCursor } from './SpectimeTimeCursor';
import { SpectimeTimelineContainer } from './SpectimeTimelineContainer';

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export const SpectimeTimeline = ({ rows, items }: TimelineProps) => {
  const { range } = useTimelineContext();
  useTimelineBehavior();

  const groupedSubrows = useMemo(() => groupItemsToSubrows(items, range), [items, range]);
  const now = new Date();

  return (
    <SpectimeTimelineContainer>
      <SpectimeTimeCursor at={now} />
      <SpectimeTimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <SpectimeTimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
      {rows.map((row) => (
        <SpectimeRow id={row.id} key={row.id} disabled={row.disabled} sidebar={<SpectimeSidebar row={row} />}>
          {groupedSubrows[row.id]?.map((subrow, index) => (
            <SpectimeSubrow key={`${row.id}-${index}`}>
              {subrow.map((item) => (
                <SpectimeItem id={item.id} key={item.id} span={item.span}>
                  גזרת שדרה {item.id}
                </SpectimeItem>
              ))}
            </SpectimeSubrow>
          ))}
        </SpectimeRow>
      ))}
    </SpectimeTimelineContainer>
  );
};
