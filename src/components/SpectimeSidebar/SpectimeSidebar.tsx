import React, { type PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './spectimeSidebar.module.css';

export type SpectimeSidebarClasses = {
  sidebar?: string;
  textSideLine?: string;
  sidebarText?: string;
  textContainer?: string;
};

export type SpectimeSidebarProps = PropsWithChildren<{
  classes?: SpectimeSidebarClasses;
}>;

export const SpectimeSidebar: React.FC<SpectimeSidebarProps> = ({ classes, children }) => {
  return (
    <div className={clsx(styles.sidebar, classes?.sidebar)}>
      <div className={clsx(styles.textContainer, classes?.textContainer)}>
        <div className={clsx(styles.textSideLine, classes?.textSideLine)} />
        <div className={clsx(styles.sidebarText, classes?.sidebarText)}>{children}</div>
      </div>
    </div>
  );
};
