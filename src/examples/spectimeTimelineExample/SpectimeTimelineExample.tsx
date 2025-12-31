import { ItemDefinition, RowDefinition } from 'chronon-timeline';
import { SpectimeItem } from '../../components/SpectimeItem/SpectimeItem';
import { SpectimeTimelineContainer } from '../../components/SpectimeTimelineContainer/SpectimeTimelineContainer';
import { SpectimeRow } from '../../components/SpectimeRow/SpectimeRow';
import { SpectimeSubrow } from '../../components/SpectimeSubrow/SpectimeSubrow';
import { SpectimeTimeAxis } from '../../components/SpectimeTimeAxis/SpectimeTimeAxis';
import reactLogo from '../../assets/react.svg';
import { SpectimeIcon } from '../../components/SpectimeIcon/SpectimeIcon';
import { SpectimeText } from '../../components/SpectimeText/SpectimeText';
import { SpectimeItemRedMarker } from '../../components/SpectimeItemRedMarker/SpectimeRedMarker';
import { SpectimeRowsContainer } from '../../components/SpectimeRowsCotainer/SpectimeRowsCotainer';
import { SpectimeSidebar } from '../../components/SpectimeSidebar/spectimeSidebar';
import { useVisibleTimelineItems } from '../../hooks/useVisibleTimelineItems/useVisibleTimelineItems';
import { currentTimeAtom } from '../../currentTimeAtom';
import { SpectimeCurrentTimeCursor } from '../../components/SpectimeCurrentTimeCursor';
import { RangePresetsToolbar } from '../rangePresetsToolbar/RangePresetsToolbar';

export interface SpectimeTimelineExampleProps {
  rows: RowDefinition[];
  items: ItemDefinition[];
}

const NORMAL_SUBROW_HEIGHT = 60;
const WEEKLY_SUBROW_HEIGHT = 40;
export const SpectimeTimelineExample = ({ rows, items }: SpectimeTimelineExampleProps) => {
  const {
    subrowsByRow: visibleSubrows,
    rowIdWithMostVisibleLanes: rowIdWhoseRefsCount,
    isWeekly,
  } = useVisibleTimelineItems({
    rows,
    items,
  });

  return (
    <SpectimeTimelineContainer>
      <SpectimeCurrentTimeCursor currentTimeAtom={currentTimeAtom} />
      <SpectimeTimeAxis isWeekly={isWeekly} startElement={<RangePresetsToolbar />} />
      <SpectimeRowsContainer>
        {rows.map((row) => (
          <SpectimeRow
            key={row.id}
            id={row.id}
            ignoreRefs={row.id !== rowIdWhoseRefsCount}
            subrowHeight={isWeekly ? WEEKLY_SUBROW_HEIGHT : NORMAL_SUBROW_HEIGHT}
            sidebar={<SpectimeSidebar title={row.id} />}
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
