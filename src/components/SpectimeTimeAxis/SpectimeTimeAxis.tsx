import React, { useMemo } from 'react';
import clsx from 'clsx';
import { TimeAxis, useTimelineContext, type TimeAxisProps } from 'chronon-timeline';

import styles from './SpectimeTimeAxis.module.css';
import {
  BASE_TIME_AXIS_MARKERS,
  HOUR_AXIS_MARKERS,
  TODAY_HIGHLIGHT_MARKER,
  WEEKLY_TIME_AXIS_MARKERS,
} from './spectimeAxisItemDefinitions';
import { getScaledTimeAxisMarkers } from './scaleBoundaries';
import SpectimeTimeAxisHighlight from './SpectimeTimeAxisHighlight/SpectimeTimeAxisHighlight';

export type SpectimeTimeAxisProps = Omit<TimeAxisProps, 'timeAxisMarkers'> & { isWeekly: boolean };

export const SpectimeTimeAxis: React.FC<SpectimeTimeAxisProps> = ({
  classes,
  isWeekly,
  ...axisProps
}) => {
  const { viewportWidth } = useTimelineContext();
  const timeAxisMarkers = useMemo(
    () =>
      getScaledTimeAxisMarkers(
        viewportWidth,
        isWeekly ? WEEKLY_TIME_AXIS_MARKERS : BASE_TIME_AXIS_MARKERS,
      ),
    [isWeekly, viewportWidth],
  );

  return (
    <>
      <TimeAxis
        classes={{
          timeAxis: styles.hourTimeAxis,
        }}
        timeAxisMarkers={HOUR_AXIS_MARKERS}
      />
      <TimeAxis
        {...axisProps}
        timeAxisMarkers={timeAxisMarkers}
        classes={{
          timeAxis: clsx(styles.mainTimeAxis, classes?.timeAxis),
        }}
      />

      <SpectimeTimeAxisHighlight highlightMarkers={isWeekly ? TODAY_HIGHLIGHT_MARKER : []} />
    </>
  );
};
