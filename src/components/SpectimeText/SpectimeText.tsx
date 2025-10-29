import React from 'react';
import clsx from 'clsx';

import styles from './SpectimeText.module.css';

interface SpectimeTextProps {
  children: React.ReactNode;
  className?: string;
}

export const SpectimeText: React.FC<SpectimeTextProps> = ({ children, className }) => {
  return <p className={clsx(styles.text, className)}>{children}</p>;
};
