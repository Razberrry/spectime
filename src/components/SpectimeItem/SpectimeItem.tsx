import React from 'react';
import { Item, type ItemProps, type TimelineItemClasses } from 'chronon-timeline';
import clsx from 'clsx';

import styles from './SpectimeItem.module.css';

export type SpectimeItemProps = ItemProps;

export const SpectimeItem: React.FC<SpectimeItemProps> = ({ classes, children, ...itemProps }) => {
  const mergedClasses: TimelineItemClasses = {
    item: clsx(styles.item, classes?.item),
    content: clsx(styles.content, classes?.content),
    innerContainer: clsx(styles.innerContainer, classes?.innerContainer),
  };

  return (
    <Item {...itemProps} classes={mergedClasses}>
      {children}
    </Item>
  );
};
