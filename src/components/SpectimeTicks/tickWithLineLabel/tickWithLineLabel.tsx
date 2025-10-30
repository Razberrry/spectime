import React from 'react';
import styles from './tickWithLineLabel.module.css';

const SpectimeTickWithLineLabel: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className={styles.labelContainer}>
    <div className={styles.label}>{children}</div>
    <div className={styles.line} />
  </div>
);

export default SpectimeTickWithLineLabel;
