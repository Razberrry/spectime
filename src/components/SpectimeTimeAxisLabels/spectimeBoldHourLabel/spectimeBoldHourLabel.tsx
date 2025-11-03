import React from 'react';
import styles from './spectimeBoldHourLabel.module.css';

type SpectimeBoldHourLabelProps = {
  hourLabel: string;
  dateLabel: string;
};

const SpectimeBoldHourLabel: React.FC<SpectimeBoldHourLabelProps> = ({ hourLabel, dateLabel }) => (
  <div className={styles.labelContainer}>
    <span className={styles.hiddenLabel}>•</span>
    <span className={styles.hiddenLabel}>{dateLabel}</span>
    <span className={styles.hourLabel}>{hourLabel}</span>
    <span>•</span>
    <span className={styles.dateLabel}>{dateLabel}</span>
  </div>
);

export default SpectimeBoldHourLabel;
