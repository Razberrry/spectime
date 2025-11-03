import React from 'react';
import styles from './spectimeTickWithLineLabel.module.css';

type SpectimeTickWithLineLabelProps = {
  label: string;
};

const SpectimeTickWithLineLabel: React.FC<SpectimeTickWithLineLabelProps> = ({ label }) => (
  <div className={styles.labelContainer}>
    <div className={styles.label}>{label}</div>
    <div className={styles.line} />
  </div>
);

export default SpectimeTickWithLineLabel;
