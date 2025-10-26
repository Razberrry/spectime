import React from 'react';
import clsx from 'clsx';
import { Sidebar, type SidebarProps, type TimelineSidebarClasses } from 'chronon-timeline';

import styles from './SpectimeSidebar.module.css';

export type SpectimeSidebarProps = SidebarProps;

export const SpectimeSidebar: React.FC<SpectimeSidebarProps> = ({ classes, ...sidebarProps }) => {
  const mergedClasses: TimelineSidebarClasses = {
    sidebar: clsx(styles.sidebar, classes?.sidebar),
  };

  return <Sidebar {...sidebarProps} classes={mergedClasses} />;
};
