import React from 'react';
import clsx from 'clsx';
import { TimeCursor, type TimeCursorProps, type TimelineCursorClasses } from 'chronon-timeline';

import styles from './SpectimeTimeCursor.module.css';

export type SpectimeTimeCursorProps = TimeCursorProps;

export const SpectimeTimeCursor: React.FC<SpectimeTimeCursorProps> = ({ classes, ...cursorProps }) => {
  const mergedClasses: TimelineCursorClasses = {
    cursor: clsx(styles.cursor, classes?.cursor),
  };

  return <TimeCursor {...cursorProps} classes={mergedClasses} />;
};
