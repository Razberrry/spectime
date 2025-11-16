import { addHours, parseISO, subHours } from 'date-fns';
import { useState } from 'react';
import { generateItems, generateRows, useTimeline, Range } from 'chronon-timeline';

import { SpectimeTimelineProvider } from './SpectimeTimelineProvider';
import { SpectimeTimeline, type TimelineProps } from '../SpectimeTimeline/SpectimeTimeline';
import { currentTimeAtom } from '../../currentTimeAtom';
import { RangeToolbar } from '../rangeToolBar/rangeToolbar';

const DEFAULT_RANGE_HOUR: Range = {
  start: subHours(new Date(), 12).getTime(),
  end: addHours(new Date(), 12).getTime(),
};

const ROWS = generateRows(2);

const ITEMS = generateItems(
  5000,
  {
    start: parseISO('2025-01-01').getTime(),
    end: parseISO('2025-12-31').getTime(),
  },
  ROWS,
);

interface SpectimeTimelineWithToolbarProps {
  rows?: TimelineProps['rows'];
  items?: TimelineProps['items'];
}

export const SpectimeTimelineWithToolbar = ({
  rows = ROWS,
  items = ITEMS,
}: SpectimeTimelineWithToolbarProps) => {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);
  const timelineAttributes = useTimeline({ range, setRange });
  return (
    <SpectimeTimelineProvider {...timelineAttributes} currentTimeAtom={currentTimeAtom}>
      <RangeToolbar />
      <SpectimeTimeline items={items} rows={rows} />
    </SpectimeTimelineProvider>
  );
};
