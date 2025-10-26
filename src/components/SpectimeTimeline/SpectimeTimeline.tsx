import {
  groupItemsToSubrows,
  HOUR_AXIS_MARKERS,
  ItemDefinition,
  RowDefinition,
  Sidebar,
  TIME_AXIS_MARKERS,
  useTimelineBehavior,
  useTimelineContext,
} from 'chronon-timeline';
import { useMemo } from 'react';
import { SpectimeItem } from '../SpectimeItem/SpectimeItem';
import { SpectimeTimelineContainer } from '../SpectimeTimelineContainer/SpectimeTimelineContainer';
import { SpectimeRow } from '../SpectimeRow/SpectimeRow';
import { SpectimeSubrow } from '../SpectimeSubrow/SpectimeSubrow';
import { SpectimeTimeCursor } from '../SpectimeTimeCursor/SpectimeTimeCursor';
import { SpectimeTimeAxis } from '../SpectimeTimeAxis/SpectimeTimeAxis';

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

export const SpectimeTimeline = ({ rows, items }: TimelineProps) => {
  const { range } = useTimelineContext();
  useTimelineBehavior();
  const groupedSubrows = useMemo(() => groupItemsToSubrows(items), [items]);

  const visibleSubrows = useMemo(() => {
    const next: Record<string, ItemDefinition[][]> = {};

    Object.entries(groupedSubrows).forEach(([rowId, subrows]) => {
      const filtered = subrows
        .map((subrow) =>
          subrow.filter((item) => item.span.start < range.end && item.span.end > range.start),
        )
        .filter((subrow) => subrow.length > 0);

      if (filtered.length) {
        next[rowId] = filtered;
      }
    });

    return next;
  }, [groupedSubrows, range]);
  const now = new Date();

  return (
    <SpectimeTimelineContainer>
      <SpectimeTimeCursor at={now} />
      <SpectimeTimeAxis timeAxisMarkers={HOUR_AXIS_MARKERS} />
      <SpectimeTimeAxis timeAxisMarkers={TIME_AXIS_MARKERS} />
      {rows.map((row) => (
        <SpectimeRow id={row.id} key={row.id} sidebar={<Sidebar row={row} />}>
          {visibleSubrows[row.id]?.map((subrow, index) => (
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
