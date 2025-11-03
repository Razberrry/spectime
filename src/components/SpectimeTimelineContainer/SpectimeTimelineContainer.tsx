import React, { type PropsWithChildren } from 'react';
import clsx from 'clsx';
import { Timeline } from 'chronon-timeline';

import styles from './SpectimeTimelineContainer.module.css';
export interface SpectimeTimelineContainerProps extends PropsWithChildren {
  className?: string;
  dir?: 'ltr' | 'rtl';
}

export const SpectimeTimelineContainer: React.FC<SpectimeTimelineContainerProps> = ({
  className,
  dir = 'rtl',
  children,
}) => {
  return (
    <div className={clsx(styles.timelineShell, className)}>
      <Timeline dir={dir}>{children}</Timeline>
    </div>
  );
};
