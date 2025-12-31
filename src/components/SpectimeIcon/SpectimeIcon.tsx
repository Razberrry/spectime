import React from 'react';

import styles from './SpectimeIcon.module.css';

export interface SpectimeIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const SpectimeIcon: React.FC<SpectimeIconProps> = ({ ...imgProps }) => {
  return <img className={styles.icon} alt={imgProps.alt} {...imgProps} draggable={false} />;
};
