import React from 'react';
import clsx from 'clsx';
import { Subrow, type SubrowProps, type TimelineSubrowClasses } from 'chronon-timeline';

import styles from './SpectimeSubrow.module.css';

export type SpectimeSubrowProps = SubrowProps;

export const SpectimeSubrow: React.FC<SpectimeSubrowProps> = ({ classes, children }) => {
  const mergedClasses: TimelineSubrowClasses = {
    subrow: clsx(styles.subrow, classes?.subrow),
  };

  return <Subrow classes={mergedClasses}>{children}</Subrow>;
};
