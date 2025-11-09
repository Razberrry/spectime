import { useCallback } from 'react';
import { Range, useTimelineContext } from 'chronon-timeline';

import {
  SpectimeTimeline,
  type TimelineProps,
} from '../SpectimeTimeline/SpectimeTimeline';
import { RangeToolbar } from '../rangeToolBar/rangeToolbar';
import { currentTimeAtom } from '../../currentTimeAtom';
import { useTimelineAutoPanUntilInteraction } from '../../hooks/useTimelineAutoPanUntilInteraction';

type SpectimeTimelineToolbarContentProps = TimelineProps;

export const SpectimeTimelineToolbarContent = ({
  rows,
  items,
}: SpectimeTimelineToolbarContentProps) => {
  const { setRange } = useTimelineContext();
  const { resetAutopan } = useTimelineAutoPanUntilInteraction({ currentTimeAtom });

  const handleSetRange = useCallback(
    (nextRange: Range) => {
      resetAutopan();
      setRange(nextRange);
    },
    [resetAutopan, setRange],
  );

  return (
    <>
      <RangeToolbar setRange={handleSetRange} />
      <SpectimeTimeline items={items} rows={rows} />
    </>
  );
};
