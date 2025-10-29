import { addMinutes, hoursToMilliseconds, parseISO, subMinutes } from 'date-fns';
import { useState } from 'react';
import {
  RangeToolbar,
  generateItems,
  generateRows,
  Range,
  TimelineContextProvider,
  useTimeline,
} from 'chronon-timeline';
import { SpectimeTimeline } from './components/SpectimeTimeline/SpectimeTimeline';

const DEFAULT_RANGE_HOUR: Range = {
  start: subMinutes(new Date(), 30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
};

const ROWS = generateRows(2);

const ITEMS = generateItems(
  50_0000,
  {
    start: parseISO('2020-10-26').getTime(),
    end: parseISO('2025-12-26').getTime(),
  },
  ROWS,
  {
    minDuration: hoursToMilliseconds(5),
    maxDuration: hoursToMilliseconds(15),
  },
);

const App = () => {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const timelineAttributes = useTimeline({ range, onRangeChanged: setRange });
  return (
    <TimelineContextProvider {...timelineAttributes}>
      <RangeToolbar setRange={setRange} />
      <SpectimeTimeline items={ITEMS} rows={ROWS} />
    </TimelineContextProvider>
  );
};

export default App;
