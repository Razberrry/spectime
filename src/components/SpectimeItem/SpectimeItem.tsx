/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Item, type ItemProps } from 'chronon-timeline';
import clsx from 'clsx';

import styles from './SpectimeItem.module.css';

export type SpectimeItemProps = ItemProps;

export const SpectimeItem: React.FC<SpectimeItemProps> = ({ classes, children, ...itemProps }) => {
  return (
    <Item
      {...itemProps}
      classes={{
        ...classes,
        content: clsx(styles.content, classes?.content),
      }}
    >
      <div
        // onClick={{}

        className={clsx(styles.innerContainer, classes?.innerContainer)}
      >
        {children}
      </div>
    </Item>
  );
};
