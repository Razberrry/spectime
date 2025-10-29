import React from 'react';
import clsx from 'clsx';

import styles from './SpectimeIcon.module.css';

export interface SpectimeIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const SpectimeIcon: React.FC<SpectimeIconProps> = ({ className, ...imgProps }) => {
  return <img className={clsx(styles.icon, className)} alt={imgProps.alt} {...imgProps} />;
};
