import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { PhaseRow } from '../../types';
import styles from './PhaseBanner.module.css';

const PhaseBanner = () => {

  const [activePhase, setActivePhase] = useState<PhaseRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePhase = async () => {
      try {
        const { data, error } = await supabase
          .from('process_phases')
          .select('*')
          .eq('status', 'active')
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error('Error fetching phase:', error);
          }
          setActivePhase(null);
        } else {
          setActivePhase(data);
        }
      } catch (err) {
        console.error('Error inesperado:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePhase();
  }, []);

  if (loading || !activePhase) return null;

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.content}>
        <span className={styles.label}>Fase Actual:</span>
        <strong className={styles.phaseName}>{activePhase.title}</strong>
        {(activePhase.display_dates || activePhase.start_date) && (
          <span className={styles.dates}>
            ({activePhase.display_dates || activePhase.start_date})
          </span>
        )}
      </div>
      
      {/* Enlace a la página de Consulta */}
      <Link to="/consulta" className={styles.ctaButton}>
        Participa en la Consulta
      </Link>
    </div>
  );
};

export default PhaseBanner;