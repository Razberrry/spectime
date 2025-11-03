import React, { PropsWithChildren } from 'react';
import styles from './DefaultLabel.module.css';

const SpectimePlainLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.label}>{children}</div>
);

export default SpectimePlainLabel;
