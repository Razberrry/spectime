import { addHours, millisecondsToHours, parseISO, subHours } from 'date-fns';
import { useState } from 'react';
import {
  RangeToolbar,
  generateItems,
  generateRows,
  Range,
  TimelineContextProvider,
  useTimeline,
} from 'chronon-timeline';
import { SpectimeTimeline } from './components/SpectimeTimeline/spectimeTimeline';
const DEFAULT_RANGE_HOUR: Range = {
  start: subHours(new Date(), 12).getTime(),
  end: addHours(new Date(), 12).getTime(),
};

const ROWS = generateRows(2);

const ITEMS = generateItems(
  5000,
  {
    start: parseISO('2024-10-01').getTime(),
    end: parseISO('2025-12-01').getTime(),
  },
  ROWS,
);

// [
//           {
//             id: '3',
//             rowId: 'row-0',
//             span: {
//               start: new Date(new Date().setHours(14, 0, 0)).getTime(),
//               end: new Date(new Date().setHours(15, 0, 0)).getTime(),
//             },
//           },
//         ]

const App = () => {
  const [range, setRange] = useState<Range>(DEFAULT_RANGE_HOUR);
  // const debouncedRange = useDeferredValue(range);
  console.log(millisecondsToHours(range.end - range.start));
  const timelineAttributes = useTimeline({ range: range, onRangeChanged: setRange });
  return (
    <TimelineContextProvider {...timelineAttributes}>
      <RangeToolbar setRange={setRange} />
      <SpectimeTimeline items={ITEMS} rows={ROWS} />
    </TimelineContextProvider>
  );
};

export default App;
