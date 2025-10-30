import styles from './simpleTickLabel.module.css';

const SpectimeSimpleTickLabel: React.FC = () => (
  <div className={styles.labelContainer}>
    <div className={styles.label}></div>
    <div className={styles.line} />
  </div>
);

export default SpectimeSimpleTickLabel;
