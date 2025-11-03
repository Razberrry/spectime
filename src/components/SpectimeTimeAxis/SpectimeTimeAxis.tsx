import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Item, Row, TimeAxis, useTimelineContext, type TimeAxisProps } from 'chronon-timeline';

import styles from './SpectimeTimeAxis.module.css';
import {
  getScaledTimeAxisMarkers,
  HOUR_AXIS_MARKERS,
  scaleRangeSize,
} from './spectimeAxisItemDefinitions';
import { addHours, endOfDay, hoursToMilliseconds, startOfDay, subHours } from 'date-fns';

export type SpectimeTimeAxisProps = Omit<TimeAxisProps, 'timeAxisMarkers'>;

export const SpectimeTimeAxis: React.FC<SpectimeTimeAxisProps> = ({ classes, ...axisProps }) => {
  const { viewportWidth, range } = useTimelineContext();
  const now = new Date();
  const totalRange = range.end - range.start;
  const timeAxisMarkers = useMemo(() => getScaledTimeAxisMarkers(viewportWidth), [viewportWidth]);
  const shouldDisplayCurrentDayHighlight = useMemo(() => {
    return totalRange > scaleRangeSize(hoursToMilliseconds(100), viewportWidth);
  }, [totalRange, viewportWidth]);

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
      {/* Extract this into it's own component */}

      <Row id={'current-day-row'} classes={{ wrapper: styles.rowWrapper }}>
        {shouldDisplayCurrentDayHighlight && (
          <Item
            id="current-day-item"
            classes={{
              item: styles.hightlightedItem,
              content: styles.highlightItemContent,
              innerContainer: styles.highlightItemContent,
            }}
            span={{
              start: addHours(startOfDay(now), 5).getTime(),
              end: subHours(endOfDay(now), 5).getTime(),
            }}
          >
            <div className={styles.purpleLine} />
          </Item>
        )}
      </Row>
    </>
  );
};
