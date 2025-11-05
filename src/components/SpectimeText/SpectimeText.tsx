import React from 'react';

import styles from './SpectimeText.module.css';

interface SpectimeTextProps {
  children: React.ReactNode;
  className?: string;
}

export const SpectimeText: React.FC<SpectimeTextProps> = ({ children }) => {
  return <span className={styles.text}>{children}</span>;
};
