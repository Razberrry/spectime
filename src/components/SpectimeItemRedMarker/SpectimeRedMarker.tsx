import React from 'react';
import clsx from 'clsx';

import styles from './SpectimeItemRedMarker.module.css';

export interface SpectimeItemRedMarkerProps {
  className?: string;
}

export const SpectimeItemRedMarker: React.FC<SpectimeItemRedMarkerProps> = ({ className }) => {
  return <div className={clsx(styles.marker, className)} />;
};
