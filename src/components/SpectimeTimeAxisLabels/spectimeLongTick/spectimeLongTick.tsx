import styles from './spectimeLongTick.module.css';

const SpectimeLongTickLabel: React.FC = () => (
  <div className={styles.labelContainer}>
    <div className={styles.label}></div>
    <div className={styles.line} />
  </div>
);

export default SpectimeLongTickLabel;
