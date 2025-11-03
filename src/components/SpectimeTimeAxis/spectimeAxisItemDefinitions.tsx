import { MarkerDefinition } from 'chronon-timeline';
import { format, hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { he } from 'date-fns/locale';
import SpectimeSimpleTickLabel from '../SpectimeTicks/spectimeSimpleTick/simpleTickLabel';
import SpectimeTickWithLineLabel from '../SpectimeTicks/tickWithLineLabel/tickWithLineLabel';
import SpectimePlainLabel from '../plainLabel/defaultLabel';
import React from 'react';

type DateLabelFormatter = (date: Date) => string;

const formatMinutes: DateLabelFormatter = (date) => format(date, 'm');
const formatHourMinute: DateLabelFormatter = (date) => format(date, 'H:mm');
const formatWeekday: DateLabelFormatter = (date) => format(date, 'EEEE', { locale: he });

export const formatHebrewDate: DateLabelFormatter = (date) => {
  const timePart = format(date, 'H:mm', { locale: he });
  const dayMonthPart = format(date, 'd/M', { locale: he });
  const weekdayPart = format(date, 'EEEE', { locale: he });
  return ` ${timePart} • ${dayMonthPart} ${weekdayPart} `;
};

const BASE_TIME_AXIS_MARKERS: MarkerDefinition[] = [
  // 1 min minor, 5 min major (0h–3h)
  {
    value: minutesToMilliseconds(1),
    minRangeSize: 0,
    maxRangeSize: hoursToMilliseconds(3),
    render: () => <SpectimeSimpleTickLabel />,
  },
  {
    value: minutesToMilliseconds(5),
    minRangeSize: 0,
    maxRangeSize: hoursToMilliseconds(3),
    render: (date: Date) => (
      <SpectimeTickWithLineLabel>{formatMinutes(new Date(date))}</SpectimeTickWithLineLabel>
    ),
  },

  // 15 min minor, 30 min major (3h–12h)
  {
    value: minutesToMilliseconds(15),
    minRangeSize: hoursToMilliseconds(3),
    maxRangeSize: hoursToMilliseconds(12),
    render: () => <SpectimeSimpleTickLabel />,
  },
  {
    value: minutesToMilliseconds(30),
    minRangeSize: hoursToMilliseconds(3),
    maxRangeSize: hoursToMilliseconds(12),
    render: (date: Date) => (
      <SpectimeTickWithLineLabel>{formatHourMinute(new Date(date))}</SpectimeTickWithLineLabel>
    ),
  },

  // 30 min minor, 1 h major (12h–30h)
  {
    value: minutesToMilliseconds(30),
    minRangeSize: hoursToMilliseconds(12),
    maxRangeSize: hoursToMilliseconds(30),
    render: () => <SpectimeSimpleTickLabel />,
  },
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(12),
    maxRangeSize: hoursToMilliseconds(30),
    render: (date: Date) => (
      <SpectimeTickWithLineLabel>{formatHourMinute(new Date(date))}</SpectimeTickWithLineLabel>
    ),
  },

  // 1 h minor, 2 h major (30h–50h)
  {
    value: hoursToMilliseconds(1),
    minRangeSize: hoursToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(50),
    render: () => <SpectimeSimpleTickLabel />,
  },
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(50),
    render: (date: Date) => (
      <SpectimeTickWithLineLabel>{formatHourMinute(new Date(date))}</SpectimeTickWithLineLabel>
    ),
  },

  // 2 h minor, 4 h major (50h–100h)
  {
    value: hoursToMilliseconds(2),
    minRangeSize: hoursToMilliseconds(50),
    maxRangeSize: hoursToMilliseconds(100),
    render: () => <SpectimeSimpleTickLabel />,
  },
  {
    value: hoursToMilliseconds(4),
    minRangeSize: hoursToMilliseconds(50),
    maxRangeSize: hoursToMilliseconds(100),
    render: (date: Date) => (
      <SpectimeTickWithLineLabel>{formatHourMinute(new Date(date))}</SpectimeTickWithLineLabel>
    ),
  },

  // Day ticks (≥ 100h)
  {
    value: hoursToMilliseconds(24),
    minRangeSize: hoursToMilliseconds(100),
    render: (date: Date) => (
      <SpectimeTickWithLineLabel>{formatWeekday(new Date(date))}</SpectimeTickWithLineLabel>
    ),
  },
];

export const HOUR_AXIS_MARKERS: MarkerDefinition[] = [
  {
    value: hoursToMilliseconds(1),
    minRangeSize: minutesToMilliseconds(30),
    maxRangeSize: hoursToMilliseconds(2),
    render: (date: Date) => (
      <SpectimePlainLabel>{formatHebrewDate(new Date(date))}</SpectimePlainLabel>
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
