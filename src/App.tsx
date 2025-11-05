import { addHours, parseISO, subHours } from 'date-fns';
import { useState } from 'react';
import {
  RangeToolbar,
  generateItems,
  generateRows,
  Range,
  TimelineContextProvider,
  useTimeline,
  generateFixedLengthItems,
} from 'chronon-timeline';

import { SpectimeTimeline } from './components/SpectimeTimeline/SpectimeTimeline';
const DEFAULT_RANGE_HOUR: Range = {
  start: subHours(new Date(), 12).getTime(),
  end: addHours(new Date(), 12).getTime(),
};

const ROWS = generateRows(2);

const ITEMS = generateItems(
  20000,
  {
    start: parseISO('2025-01-01').getTime(),
    end: parseISO('2025-12-31').getTime(),
  },
  ROWS,
);

const App = () => {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);
  const timelineAttributes = useTimeline({ range: range, onRangeChanged: setRange });
  return (
    <TimelineContextProvider {...timelineAttributes}>
      <RangeToolbar setRange={setRange} />
      <SpectimeTimeline items={ITEMS} rows={ROWS} />
    </TimelineContextProvider>
  );
};

export default App;
