import React from 'react';
import clsx from 'clsx';
import { Row, type RowProps } from 'chronon-timeline';

import styles from './SpectimeRow.module.css';

export type SpectimeRowProps = RowProps;

export const SpectimeRow: React.FC<SpectimeRowProps> = ({ classes, ...rowProps }) => {
  return (
    <Row
      virtualizeSubrows
      {...rowProps}
      classes={{
        wrapper: clsx(styles.wrapper, classes?.wrapper),
        sidebar: clsx(styles.sidebar, classes?.sidebar),
        content: clsx(styles.content, classes?.content),
      }}
    />
  );
};
