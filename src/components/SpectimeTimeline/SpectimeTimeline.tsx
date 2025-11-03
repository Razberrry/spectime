import {
  buildVisibleRowSubrows,
  groupItemsByRowSorted,
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

  const sortedItemsByRow = useMemo(() => groupItemsByRowSorted(items), [items]);

  const groupedSubrows = useMemo(
    () => buildVisibleRowSubrows(sortedItemsByRow, range),
    [sortedItemsByRow, range],
  );
  const now = new Date();

  return (
    <SpectimeTimelineContainer>
      <SpectimeTimeCursor at={now} />
      <SpectimeTimeAxis />
      <SpectimeRowsContainer>
        {rows.map((row) => (
          <SpectimeRow id={row.id} key={row.id} sidebar={<SpectimeSidebar title={row.id} />}>
            {groupedSubrows[row.id]?.map((subrow, index) => (
              <SpectimeSubrow key={`${row.id}-${index}`}>
                {subrow.map((item) => {
                  return (
                    <SpectimeItem id={item.id} key={item.id} span={item.span}>
                      <SpectimeItemRedMarker />
                      <SpectimeIcon src={reactLogo} alt="lol" />
                      <SpectimeText>גזרת שדרה {item.id}</SpectimeText>
                      <SpectimeIcon src={reactLogo} alt="lol" />
                      <div />
                    </SpectimeItem>
                  );
                })}
              </SpectimeSubrow>
            ))}
          </SpectimeRow>
        ))}
      </SpectimeRowsContainer>
    </SpectimeTimelineContainer>
  );
};
