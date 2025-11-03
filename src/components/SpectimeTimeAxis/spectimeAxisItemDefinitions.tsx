import { MarkerDefinition } from 'chronon-timeline';
import { format, hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { he } from 'date-fns/locale';
import SpectimeSimpleTick from '../SpectimeTimeAxisLabels/spectimeSimpleTick/spectimeSimpleTick';
import SpectimeTickWithLineLabel from '../SpectimeTimeAxisLabels/spectimeTickWithLineLabel/spectimeTickWithLineLabel';
import React from 'react';
import SpectimeWeeklyLabel from '../SpectimeTimeAxisLabels/spectimeWeekLabel/spectimeWeekLabel';
import SpectimeLongTickLabel from '../SpectimeTimeAxisLabels/spectimeLongTick/spectimeLongTick';
import SpectimeBoldHourLabel from '../SpectimeTimeAxisLabels/spectimeBoldHourLabel/spectimeBoldHourLabel';

type DateLabelFormatter = (date: Date) => string;

const formatMinutes: DateLabelFormatter = (date) => format(date, 'm');
const formatHourMinute: DateLabelFormatter = (date) => format(date, 'H:mm');
const formatDate: DateLabelFormatter = (date) => format(date, 'd/M', { locale: he });

export const formatHebrewDate: DateLabelFormatter = (date) => {
  const dayMonthPart = format(date, 'd/M', { locale: he });
  const weekdayPart = format(date, 'EEEE', { locale: he });
  return `${dayMonthPart} ${weekdayPart} `;
};

const BASE_TIME_AXIS_MARKERS: MarkerDefinition[] = [
  // 1 min minor, 5 min major (0h–3h)
  {
    value: minutesToMilliseconds(1),
    minRangeSize: 0,
    maxRangeSize: hoursToMilliseconds(3),
    render: () => <SpectimeSimpleTick />,
  },
  {
    value: minutesToMilliseconds(5),
    minRangeSize: 0,
    maxRangeSize: hoursToMilliseconds(3),
    render: (date: Date) => <SpectimeTickWithLineLabel label={formatMinutes(new Date(date))} />,
  },

  // 15 min minor, 30 min major (3h–12h)
  {
    value: minutesToMilliseconds(15),
    minRangeSize: hoursToMilliseconds(3),
    maxRangeSize: hoursToMilliseconds(12),
    render: () => <SpectimeSimpleTick />,
  },
  {
    value: minutesToMilliseconds(30),
    minRangeSize: hoursToMilliseconds(3),
    maxRangeSize: hoursToMilliseconds(12),
    render: (date: Date) => <SpectimeTickWithLineLabel label={formatHourMinute(new Date(date))} />,
  },

  // 30 min minor, 1 h major (12h–30h)
  {
    value: minutesToMilliseconds(30),
    minRangeSize: hoursToMilliseconds(12),
    maxRangeSize: hoursToMilliseconds(30),
    render: () => <SpectimeSimpleTick />,
  },
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(12),
    maxRangeSize: hoursToMilliseconds(30),
    render: (date: Date) => <SpectimeTickWithLineLabel label={formatHourMinute(new Date(date))} />,
  },

  // 1 h minor, 2 h major (30h–50h)
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(50),
    render: () => <SpectimeSimpleTick />,
  },
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(50),
    render: (date: Date) => <SpectimeTickWithLineLabel label={formatHourMinute(new Date(date))} />,
  },

  // 2 h minor, 4 h major (50h–100h)
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(50),
    maxRangeSize: hoursToMilliseconds(100),
    render: () => <SpectimeSimpleTick />,
  },
  {
    value: hoursToMilliseconds(4),
    minRangeSize: hoursToMilliseconds(50),
    maxRangeSize: hoursToMilliseconds(100),
    render: (date: Date) => <SpectimeTickWithLineLabel label={formatHourMinute(new Date(date))} />,
  },

  // 4 h minor, 8 h major (50h–100h)
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(50),
    maxRangeSize: hoursToMilliseconds(100),
    render: () => <SpectimeSimpleTick />,
  },
  {
    value: hoursToMilliseconds(4),
    minRangeSize: hoursToMilliseconds(50),
    maxRangeSize: hoursToMilliseconds(100),
    render: (date: Date) => <SpectimeTickWithLineLabel label={formatHourMinute(new Date(date))} />,
  },

  // 12 h minor, 24 h major (100h+)
  {
    value: hoursToMilliseconds(12),
    minRangeSize: hoursToMilliseconds(100),
    maxRangeSize: hoursToMilliseconds(12 * 24),
    render: () => <SpectimeLongTickLabel />,
  },
  {
    value: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(100),
    maxRangeSize: hoursToMilliseconds(12 * 24),

    render: (date: Date) => <SpectimeWeeklyLabel label={formatHebrewDate(new Date(date))} />,
  },

  // When minimized/half screen
  {
    value: hoursToMilliseconds(12),
    minRangeSize: hoursToMilliseconds(12 * 24),
    maxRangeSize: hoursToMilliseconds(15 * 24),
    render: () => <SpectimeLongTickLabel />,
  },
  {
    value: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(12 * 24),
    maxRangeSize: hoursToMilliseconds(15 * 24),
    render: (date: Date) => (
      <SpectimeWeeklyLabel label={formatHebrewDate(new Date(date)).replace('יום ', '')} />
    ),
  },

  {
    value: hoursToMilliseconds(12),
    minRangeSize: hoursToMilliseconds(15 * 24),
    render: () => <SpectimeLongTickLabel />,
  },
  {
    value: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(15 * 24),
    render: (date: Date) => <SpectimeWeeklyLabel label={formatDate(new Date(date))} />,
  },
];

export const HOUR_AXIS_MARKERS: MarkerDefinition[] = [
  {
    value: hoursToMilliseconds(1),
    minRangeSize: minutesToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(2),
    render: (date: Date) => (
      <SpectimeBoldHourLabel
        hourLabel={formatHourMinute(new Date(date))}
        dateLabel={formatHebrewDate(new Date(date))}
      />
    ),
  },
];

const scaleBoundaries = (boundary: number | undefined, scale: number) =>
  boundary === undefined ? undefined : boundary * scale;

export const getScaledTimeAxisMarkers = (viewportWidth: number): MarkerDefinition[] => {
  if (!viewportWidth || viewportWidth <= 0) {
    return BASE_TIME_AXIS_MARKERS;
  }

  const baseViewportWidth = window.screen.availWidth;
  const scale = viewportWidth / baseViewportWidth;

  if (scale === 1) {
    return BASE_TIME_AXIS_MARKERS;
  }

  return BASE_TIME_AXIS_MARKERS.map((marker) => ({
    ...marker,
    minRangeSize: scaleBoundaries(marker.minRangeSize, scale),
    maxRangeSize: scaleBoundaries(marker.maxRangeSize, scale),
  }));
};
