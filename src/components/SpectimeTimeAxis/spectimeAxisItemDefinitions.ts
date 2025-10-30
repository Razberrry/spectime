import { MarkerDefinition } from 'chronon-timeline';
import { format, hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { he } from 'date-fns/locale';
import SpectimeSimpleTickLabel from '../SpectimeTicks/spectimeSimpleTick/simpleTickLabel';
import SpectimeTickWithLineLabel from '../SpectimeTicks/tickWithLineLabel/tickWithLineLabel';

type DateLabelFormatter = (date: Date) => string;

const formatMinutes: DateLabelFormatter = (date) => format(date, 'm');
const formatHourMinute: DateLabelFormatter = (date) => format(date, 'H:mm');
const formatWeekday: DateLabelFormatter = (date) => format(date, 'EEEE');

export const formatHebrewDate: DateLabelFormatter = (date) => {
  const timePart = format(date, 'H:mm', { locale: he });
  const dayMonthPart = format(date, 'd/M', { locale: he });
  const weekdayPart = format(date, 'EEEE', { locale: he });
  return `${timePart} • ${dayMonthPart} ${weekdayPart} `;
};

export const TIME_AXIS_MARKERS: MarkerDefinition[] = [
  // 1 min minor, 5 min major (0h–3h)
  {
    value: minutesToMilliseconds(1),
    minRangeSize: 0,
    maxRangeSize: hoursToMilliseconds(3),
    overrideComponent: SpectimeSimpleTickLabel,
  },
  {
    value: minutesToMilliseconds(5),
    minRangeSize: 0,
    maxRangeSize: hoursToMilliseconds(3),
    getLabel: formatMinutes,
    overrideComponent: SpectimeTickWithLineLabel,
  },

  // 15 min minor, 30 min major (3h–12h)
  {
    value: minutesToMilliseconds(15),
    minRangeSize: hoursToMilliseconds(3),
    maxRangeSize: hoursToMilliseconds(12),
    overrideComponent: SpectimeSimpleTickLabel,
  },
  {
    value: minutesToMilliseconds(30),
    minRangeSize: hoursToMilliseconds(3),
    maxRangeSize: hoursToMilliseconds(12),
    getLabel: formatHourMinute,
    overrideComponent: SpectimeTickWithLineLabel,
  },

  // 30 min minor, 1 h major (12h–30h)
  {
    value: minutesToMilliseconds(30),
    minRangeSize: hoursToMilliseconds(12),
    maxRangeSize: hoursToMilliseconds(30),
    overrideComponent: SpectimeSimpleTickLabel,
  },
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(12),
    maxRangeSize: hoursToMilliseconds(30),
    getLabel: formatHourMinute,
    overrideComponent: SpectimeTickWithLineLabel,
  },

  // 1 h minor, 2 h major (30h–50h)
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(50),
    overrideComponent: SpectimeSimpleTickLabel,
  },
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(50),
    getLabel: formatHourMinute,
    overrideComponent: SpectimeTickWithLineLabel,
  },

  // Day ticks (≥ 50h)
  {
    value: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(50),
    getLabel: formatWeekday,
    overrideComponent: SpectimeTickWithLineLabel,
  },
];

// export const HOUR_AXIS_MARKERS: MarkerDefinition[] = [
//   {
//     value: hoursToMilliseconds(1),
//     minRangeSize: minutesToMilliseconds(30),
//     maxRangeSize: hoursToMilliseconds(2),
//     getLabel: formatHebrewDate,
//     overrideComponent: SpectimeTickWithLineLabel,
//   },
// ];
