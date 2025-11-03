import styles from './spectimeSimpleTick.module.css';

const SpectimeSimpleTick: React.FC = () => (
  <div className={styles.labelContainer}>
    <div className={styles.label}></div>
    <div className={styles.line} />
  </div>
);

export default SpectimeSimpleTick;
