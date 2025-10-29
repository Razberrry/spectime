import React from 'react';
import { Sidebar, type SidebarProps } from 'chronon-timeline';
import styles from './spectimeSidebar.module.css';
export type SpectimeSidebarProps = SidebarProps;

export const SpectimeSidebar: React.FC<SpectimeSidebarProps> = (sidebarProps) => {
  return <Sidebar {...sidebarProps} classes={{ sidebar: styles.sidebar }} />;
};
