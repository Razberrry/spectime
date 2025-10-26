import { addMinutes, endOfDay, startOfDay, subMinutes } from 'date-fns';
import { useState } from 'react';
import {
  RangeToolbar,
  generateItems,
  generateRows,
  Range,
  TimelineContextProvider,
  useTimeline,
} from 'chronon-timeline';
import { SpectimeTimeline } from './spectimeTimeline';

const DEFAULT_RANGE_HOUR: Range = {
  start: subMinutes(new Date(), 30).getTime(),
  end: addMinutes(new Date(), 30).getTime(),
};

const DEFAULT_ROWS = generateRows(3);
const DEFAULT_ITEMS = generateItems(
  1000,
  {
    start: startOfDay(new Date(Date.now() - 10 * 86400000)).getTime(),
    end: endOfDay(new Date(Date.now() + 20 * 86400000)).getTime(),
  },
  DEFAULT_ROWS,
);

const App = () => {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(DEFAULT_ROWS);
  const [items] = useState(DEFAULT_ITEMS);
  const timelineAttributes = useTimeline({ range, onRangeChanged: setRange });
  return (
    <TimelineContextProvider {...timelineAttributes}>
      <RangeToolbar setRange={setRange} />
      <SpectimeTimeline items={items} rows={rows} />
    </TimelineContextProvider>
  );
};

export default App;
