import React, { useMemo } from 'react';
import clsx from 'clsx';
import { RangeToolbar, TimeAxis, useTimelineContext, type TimeAxisProps } from 'chronon-timeline';

import styles from './SpectimeTimeAxis.module.css';
import {
  BASE_TIME_AXIS_MARKERS,
  HOUR_AXIS_MARKERS,
  TODAY_HIGHLIGHT_MARKER,
} from './spectimeAxisItemDefinitions';
import { getScaledTimeAxisMarkers } from './scaleBoundaries';
import SpectimeTimeAxisHighlight from './SpectimeTimeAxisHighlight/SpectimeTimeAxisHighlight';

export type SpectimeTimeAxisProps = Omit<TimeAxisProps, 'timeAxisMarkers'>;

export const SpectimeTimeAxis: React.FC<SpectimeTimeAxisProps> = ({ classes, ...axisProps }) => {
  const { viewportWidth } = useTimelineContext();
  const timeAxisMarkers = useMemo(
    () => getScaledTimeAxisMarkers(viewportWidth, BASE_TIME_AXIS_MARKERS),
    [viewportWidth],
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
        startElement={<RangeToolbar setRange={handleSetRange} />}
      />

      <SpectimeTimeAxisHighlight highlightMarkers={TODAY_HIGHLIGHT_MARKER} />
    </>
  );
};
