import { useState } from 'react';
import { addHours, parseISO, subHours } from 'date-fns';
import { generateItems, generateRows, Range, useTimeline } from 'chronon-timeline';

import { SpectimeTimelineProvider } from '../../components/SpectimeTimelineProvider/SpectimeTimelineProvider';
import { currentTimeAtom } from '../../currentTimeAtom';
import { SpectimeTimelineExample } from '../spectimeTimelineExample/SpectimeTimelineExample';

const DEFAULT_RANGE_HOUR: Range = {
  start: subHours(new Date(), 12).getTime(),
  end: addHours(new Date(), 12).getTime(),
};

const ROWS = generateRows(2);

const ITEMS = generateItems(
  50000,
  {
    start: parseISO('2025-01-01').getTime(),
    end: parseISO('2026-12-31').getTime(),
  },
  ROWS,
);

export const SpectimeExampleApp = () => {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);
  const timelineAttributes = useTimeline({ range, setRange });

  return (
    <SpectimeTimelineProvider {...timelineAttributes} currentTimeAtom={currentTimeAtom}>
      <SpectimeTimelineExample items={ITEMS} rows={ROWS} />
    </SpectimeTimelineProvider>
  );
};
