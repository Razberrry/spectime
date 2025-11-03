import React, { useMemo } from 'react';
import clsx from 'clsx';
import { TimeAxis, useTimelineContext, type TimeAxisProps } from 'chronon-timeline';

import styles from './SpectimeTimeAxis.module.css';
import { getScaledTimeAxisMarkers, HOUR_AXIS_MARKERS } from './spectimeAxisItemDefinitions';

export type SpectimeTimeAxisProps = Omit<TimeAxisProps, 'timeAxisMarkers'>;

export const SpectimeTimeAxis: React.FC<SpectimeTimeAxisProps> = ({ classes, ...axisProps }) => {
  const { viewportWidth } = useTimelineContext();

  const timeAxisMarkers = useMemo(() => getScaledTimeAxisMarkers(viewportWidth), [viewportWidth]);

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
    </>
  );
};
