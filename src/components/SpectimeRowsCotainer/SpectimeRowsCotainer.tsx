import React, { type PropsWithChildren } from 'react';

export type SpectimeRowsContainerProps = PropsWithChildren;

import styles from './SpectimeRowsContainer.module.css';

export const SpectimeRowsContainer = ({ children }: SpectimeRowsContainerProps) => {
  return <div className={styles.rowsContainer}>{children}</div>;
};
