import styles from './OfficialInstrumentSection.module.css';
import { FaFileSignature, FaNewspaper, FaBook, FaCalendarCheck } from 'react-icons/fa6';

interface InstrumentData {
  status: 'vigente' | 'en_aprobacion';
  publishDate?: string;
  effectiveDate?: string;
  officialGazetteUrl?: string;
  cabildoAgreementUrl?: string;
  finalDocumentUrl?: string;
}

export const OfficialInstrumentSection = () => {
  const data: InstrumentData = {
    status: 'vigente', 
    publishDate: '15 de Abril de 2024',
    effectiveDate: '16 de Abril de 2024',
    officialGazetteUrl: '#',
    cabildoAgreementUrl: '#',
    finalDocumentUrl: '/documentos/pmdu-borrador-v2.1.pdf'
  };

  if (data.status === 'en_aprobacion') {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Columna Izquierda */}
        <div className={styles.titleBlock}>
          <span className={styles.statusBadge}>
            <FaCalendarCheck style={{ marginRight: '6px' }} />
            Instrumento Vigente
          </span>
          <h2>Programa Municipal de Desarrollo Urbano (2024-2040)</h2>
          <p className={styles.description}>
            Este instrumento ha cumplido con todos los procesos legales y administrativos. 
            Es la norma oficial vigente para la regulación del ordenamiento territorial 
            en el municipio de Benito Juárez.
          </p>
        </div>

        {/* Columna Derecha: Tarjeta de Validez Legal */}
        <div className={styles.legalCard}>
          
          <div className={styles.datesGrid}>
            <div className={styles.dateItem}>
              <label>Publicación Oficial</label>
              <span>{data.publishDate}</span>
            </div>
            <div className={styles.dateItem}>
              <label>Entrada en Vigor</label>
              <span>{data.effectiveDate}</span>
            </div>
          </div>

          <div className={styles.linksStack}>
            <a href={data.cabildoAgreementUrl} className={styles.legalLink} target="_blank" rel="noreferrer">
              <FaFileSignature className={styles.icon} />
              <span>Dictamen de Cabildo</span>
            </a>

            <a href={data.officialGazetteUrl} className={styles.legalLink} target="_blank" rel="noreferrer">
              <FaNewspaper className={styles.icon} />
              <span>Publicación en Órgano Oficial</span>
            </a>

            <a href={data.finalDocumentUrl} className={styles.legalLink} target="_blank" rel="noreferrer">
              <FaBook className={styles.icon} />
              <span>Consultar Instrumento Final</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};