import {
  buildVisibleRowSubrows,
  groupItemsByRowSorted,
  groupItemsToSubrows,
  ItemDefinition,
  RowDefinition,
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
import reactLogo from '../../assets/react.svg';
import { SpectimeIcon } from '../SpectimeIcon/SpectimeIcon';
import { SpectimeText } from '../SpectimeText/SpectimeText';
import { SpectimeItemRedMarker } from '../SpectimeItemRedMarker/SpectimeRedMarker';
import { SpectimeRowsContainer } from '../SpectimeRowsCotainer/SpectimeRowsCotainer';

import { SpectimeSidebar } from '../SpectimeSidebar/spectimeSidebar';

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

  const subrowsByRow = useMemo(() => groupItemsToSubrows(items), [items]);

  const visibleSubrows = useMemo(() => {
    const rangeStart = range.start;
    const rangeEnd = range.end;

    const result: Record<string, Array<{ laneIndex: number; items: ItemDefinition[] }>> = {};

    for (const [rowId, lanes] of Object.entries(subrowsByRow)) {
      const visibleLanes: Array<{
        laneIndex: number;
        items: ItemDefinition[];
      }> = [];

      lanes.forEach((lane, laneIndex) => {
        const itemsInRange = lane.filter(
          (item) => item.span.start < rangeEnd && item.span.end > rangeStart,
        );

        if (itemsInRange.length) {
          visibleLanes.push({ laneIndex, items: itemsInRange });
        }
      });

      if (visibleLanes.length) {
        result[rowId] = visibleLanes;
      }
    }

    return result;
  }, [subrowsByRow, range.start, range.end]);

  const now = new Date();

  return (
    <SpectimeTimelineContainer>
      <SpectimeTimeCursor at={now} />
      <SpectimeTimeAxis />
      <SpectimeRowsContainer>
        {rows.map((row, rowIndex) => (
          <SpectimeRow
            key={row.id}
            id={row.id}
            ignoreRefs={rowIndex !== 0}
            subrowHeight={45}
            sidebar={<SpectimeSidebar title={row.id} />}
            virtualScroll={{
              itemHeight: 45,
              overscan: 3,
            }}
          >
            {visibleSubrows[row.id]?.map(({ items: subrowItems, laneIndex }) => (
              <SpectimeSubrow key={`${row.id}-lane-${laneIndex}`}>
                {subrowItems.map((item) => (
                  <SpectimeItem key={item.id} id={item.id} span={item.span}>
                    <SpectimeItemRedMarker />
                    <SpectimeIcon src={reactLogo} alt="lol" />
                    <SpectimeText>גזרת שדרה {item.id}</SpectimeText>
                    <SpectimeIcon src={reactLogo} alt="lol" />
                    <div />
                  </SpectimeItem>
                ))}
              </SpectimeSubrow>
            ))}
          </SpectimeRow>
        ))}
      </SpectimeRowsContainer>
    </SpectimeTimelineContainer>
  );
};
