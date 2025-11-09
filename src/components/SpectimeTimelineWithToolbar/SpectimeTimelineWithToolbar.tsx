import { addHours, parseISO, subHours } from 'date-fns';
import { useState } from 'react';
import {
  generateItems,
  generateRows,
  Range,
  TimelineContextProvider,
  useTimeline,
} from 'chronon-timeline';

import { SpectimeTimelineToolbarContent } from './SpectimeTimelineToolbarContent';
import { type TimelineProps } from '../SpectimeTimeline/SpectimeTimeline';

const DEFAULT_RANGE_HOUR: Range = {
  start: subHours(new Date(), 12).getTime(),
  end: addHours(new Date(), 12).getTime(),
};

const ROWS = generateRows(2);

const ITEMS = generateItems(
  50000,
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
  console.log(timelineAttributes);
  return (
    <TimelineContextProvider {...timelineAttributes}>
      <SpectimeTimelineToolbarContent items={items} rows={rows} />
    </TimelineContextProvider>
  );
};
