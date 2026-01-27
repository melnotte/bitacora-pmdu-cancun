import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { InstrumentRow } from '../../types';
import styles from './OfficialInstrumentSection.module.css';
import { FaFileSignature, FaNewspaper, FaBook, FaCalendarCheck, FaClock } from 'react-icons/fa6';


export const OfficialInstrumentSection = () => {
  const [instrument, setInstrument] = useState<InstrumentRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const { data, error } = await supabase
          .from('official_instruments')
          .select('*')
          .eq('is_active', true)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') console.error('Error fetching instrument:', error);
          setInstrument(null);
        } else {
          setInstrument(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstrument();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Pendiente';
    return new Date(`${dateString}T12:00:00`).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading || !instrument) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Columna Izquierda */}
        <div className={styles.titleBlock}>
          <span className={styles.statusBadge}>
            {instrument.status === 'vigente' ? (
              <><FaCalendarCheck style={{ marginRight: '6px' }} /> Instrumento Vigente</>
            ) : (
              <><FaClock style={{ marginRight: '6px' }} /> En Aprobación</>
            )}
          </span>

          <h2>{instrument.title}</h2>
          <p className={styles.description}>
            Esta versión técnica cuenta con la validación preliminar del Consejo Consultivo. 
            Se pone a disposición de la ciudadanía como base para la Consulta Pública, 
            garantizando que el documento final integre tanto el rigor técnico como la 
            visión de los habitantes.
          </p>
        </div>

        {/* Columna Derecha: Tarjeta de Validez Legal */}
        <div className={styles.legalCard}>
          
          <div className={styles.datesGrid}>
            <div className={styles.dateItem}>
              <label>Publicación Oficial</label>
              <span>{formatDate(instrument.publish_date)}</span>
            </div>
            <div className={styles.dateItem}>
              <label>Entrada en Vigor</label>
              <span>{formatDate(instrument.effective_date)}</span>
            </div>
          </div>

          <div className={styles.linksStack}>
            {instrument.cabildo_agreement_url && (
              <a href={instrument.cabildo_agreement_url} className={styles.legalLink} target="_blank" rel="noreferrer">
                <FaFileSignature className={styles.icon} />
                <span>Dictamen de Cabildo</span>
              </a>
            )}

            {instrument.official_gazette_url && (
              <a href={instrument.official_gazette_url} className={styles.legalLink} target="_blank" rel="noreferrer">
                <FaNewspaper className={styles.icon} />
                <span>Publicación en Órgano Oficial</span>
              </a>
            )}

            {instrument.final_document_url && (
              <a href={instrument.final_document_url} className={styles.legalLink} target="_blank" rel="noreferrer">
                <FaBook className={styles.icon} />
                <span>Consultar Instrumento Final</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};