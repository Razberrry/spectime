import { addMinutes, parseISO, subMinutes } from 'date-fns';
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

function App() {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);

  const [rows] = useState(generateRows(3));
  const [items] = useState(
    generateItems(
      10000,
      {
        start: parseISO('2020-10-26').getTime(),
        end: parseISO('2025-12-26').getTime(),
      },
      rows,
    ),
  );
  const timelineAttributes = useTimeline({ range, onRangeChanged: setRange });

  return (
    <TimelineContextProvider {...timelineAttributes}>
      <RangeToolbar setRange={setRange} />
      <SpectimeTimeline items={items} rows={rows} />
    </TimelineContextProvider>
  );
}

export default App;
