import { processStatus } from '../../config/siteConfig';
import styles from './PhaseBanner.module.css';
import { Link } from 'react-router-dom';

const PhaseBanner = () => {
  if (!processStatus.isActive) return null;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.content}>
        <span className={styles.label}>Fase Actual:</span>
        <strong className={styles.phaseName}>{processStatus.currentPhase}</strong>
        <span className={styles.dates}>({processStatus.dateRange})</span>
      </div>
      <Link to={processStatus.ctaLink} className={styles.ctaButton}>
        {processStatus.ctaText}
      </Link>
    </div>
  );
};

export default PhaseBanner;