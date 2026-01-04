import { Link } from 'react-router-dom';
import { processStatus } from '../../config/siteConfig';
import styles from './PhaseBanner.module.css';

const PhaseBanner = () => {
  // Si la fase no está activa según la config, no renderizamos nada
  if (!processStatus.isActive) return null;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.content}>
        <span className={styles.label}>Fase Actual:</span>
        <strong className={styles.phaseName}>{processStatus.currentPhase}</strong>
        <span className={styles.dates}>({processStatus.dateRange})</span>
      </div>
      
      {/* Enlace a la página de Consulta */}
      <Link to="/consulta" className={styles.ctaButton}>
        {processStatus.ctaText}
      </Link>
    </div>
  );
};

export default PhaseBanner;