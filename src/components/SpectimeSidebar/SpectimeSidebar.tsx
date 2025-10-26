import React from 'react';
import { Sidebar, type SidebarProps } from 'chronon-timeline';

export type SpectimeSidebarProps = SidebarProps;

export const SpectimeSidebar: React.FC<SpectimeSidebarProps> = (sidebarProps) => {
  return <Sidebar {...sidebarProps} />;
};
