import { ItemDefinition, RowDefinition, useTimelineMousePanAndZoom } from 'chronon-timeline';
import { SpectimeItem } from '../SpectimeItem/SpectimeItem';
import { SpectimeTimelineContainer } from '../SpectimeTimelineContainer/SpectimeTimelineContainer';
import { SpectimeRow } from '../SpectimeRow/SpectimeRow';
import { SpectimeSubrow } from '../SpectimeSubrow/SpectimeSubrow';
import { SpectimeTimeAxis } from '../SpectimeTimeAxis/SpectimeTimeAxis';
import reactLogo from '../../assets/react.svg';
import { SpectimeIcon } from '../SpectimeIcon/SpectimeIcon';
import { SpectimeText } from '../SpectimeText/SpectimeText';
import { SpectimeItemRedMarker } from '../SpectimeItemRedMarker/SpectimeRedMarker';
import { SpectimeRowsContainer } from '../SpectimeRowsCotainer/SpectimeRowsCotainer';
import { SpectimeSidebar } from '../SpectimeSidebar/spectimeSidebar';
import { useVisibleTimelineItems } from '../../hooks/useVisibleTimelineItems/useVisibleTimelineItems';
import { currentTimeAtom } from '../../currentTimeAtom';
import { SpectimeCurrentTimeCursor } from '../SpectimeCurrentTimeCursor';

export interface TimelineProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

const NORMAL_SUBROW_HEIGHT = 60;
const WEEKLY_SUBROW_HEIGHT = 40;
export const SpectimeTimeline = ({ rows, items }: TimelineProps) => {
  const {
    subrowsByRow: visibleSubrows,
    rowIdWithMostVisibleLanes: rowIdWhoseRefsCount,
    isWeekly,
  } = useVisibleTimelineItems({
    rows,
    items,
  });

  useTimelineMousePanAndZoom();
  return (
    <SpectimeTimelineContainer>
      <SpectimeCurrentTimeCursor currentTimeAtom={currentTimeAtom} />
      <SpectimeTimeAxis />
      <SpectimeRowsContainer>
        {rows.map((row) => (
          <SpectimeRow
            key={row.id}
            id={row.id}
            ignoreRefs={row.id !== rowIdWhoseRefsCount}
            subrowHeight={isWeekly ? WEEKLY_SUBROW_HEIGHT : NORMAL_SUBROW_HEIGHT}
            sidebar={<SpectimeSidebar title={row.id} />}
            virtualScroll={{
              itemHeight: isWeekly ? WEEKLY_SUBROW_HEIGHT : NORMAL_SUBROW_HEIGHT,
            }}
          >
            {visibleSubrows[row.id]?.map((subrowItems, laneIndex) => (
              <SpectimeSubrow key={`${row.id}-lane-${laneIndex}`}>
                {subrowItems.map((item) => (
                  <SpectimeItem key={item.id} id={item.id} span={item.span}>
                    <SpectimeItemRedMarker />
                    <SpectimeIcon src={reactLogo} alt="lol" />
                    <SpectimeText>גזרת שדרה {item.id}</SpectimeText>
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
