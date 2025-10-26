import React from 'react';
import clsx from 'clsx';
import { TimeAxis, type TimeAxisProps, type TimelineAxisClasses } from 'chronon-timeline';

import styles from './SpectimeTimeAxis.module.css';

export type SpectimeTimeAxisProps = TimeAxisProps;

export const SpectimeTimeAxis: React.FC<SpectimeTimeAxisProps> = ({ classes, ...axisProps }) => {
  const mergedClasses: TimelineAxisClasses = {
    timeAxis: clsx(styles.timeAxis, classes?.timeAxis),
  };

  return <TimeAxis {...axisProps} classes={mergedClasses} />;
};
