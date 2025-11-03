import React from 'react';
import styles from './spectimeWeekLabel.module.css';

type SpectimeWeeklyLabelProps = {
  label?: string;
  isToday?: boolean;
  portalContainer?: Element | null;
};

const SpectimeWeeklyLabel: React.FC<SpectimeWeeklyLabelProps> = ({ label }) => (
  <div className={styles.label}>{label}</div>
);

export default SpectimeWeeklyLabel;
