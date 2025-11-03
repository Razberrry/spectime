import React from 'react';
import clsx from 'clsx';
import styles from './spectimeSidebar.module.css';

export type SpectimeSidebarClasses = {
  sidebar?: string;
  textSideLine?: string;
  sidebarText?: string;
  textContainer?: string;
};

export type SpectimeSidebarProps = {
  classes?: SpectimeSidebarClasses;
  title?: string;
};

export const SpectimeSidebar: React.FC<SpectimeSidebarProps> = ({ classes, title }) => {
  return (
    <div className={clsx(styles.sidebar, classes?.sidebar)}>
      <div className={clsx(styles.textContainer, classes?.textContainer)}>
        <div className={clsx(styles.textSideLine, classes?.textSideLine)} />
        <div className={clsx(styles.sidebarText, classes?.sidebarText)}>{title}</div>
      </div>
    </div>
  );
};
