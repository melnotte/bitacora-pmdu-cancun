import { FaFilePdf, FaCalendarAlt, FaCodeBranch, FaUserTie, FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './CurrentVersionCard.module.css';
import type { RelatedLink } from '../../types';

interface CurrentVersionProps {
  version: string;
  date: string;
  status: string | null;
  stage: string;
  responsible: string;
  summaryChanges: string;
  downloadUrl: string;
  relatedDocs?: RelatedLink[];
}

export const CurrentVersionCard = ({
  version,
  date,
  status,
  stage,
  responsible,
  summaryChanges,
  downloadUrl,
  relatedDocs
}: CurrentVersionProps) => {

  const isVigente = status === 'vigente';
  const badgeText = isVigente ? 'DOCUMENTO VIGENTE' : 'EN APROBACIÓN';
  const badgeStyle = isVigente ? styles.badge : `${styles.badge} ${styles.badgeWarning}`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
           <div className={badgeStyle}>{badgeText}</div>
           <h3 className={styles.title}>Programa Municipal de Desarrollo Urbano</h3>
        </div>
        <a href={downloadUrl} download className={styles.downloadIconBtn} title="Descargar PDF">
            <FaFilePdf /> Descargar
        </a>
      </div>

      <div className={styles.gridContainer}>
        
        {/* --- COLUMNA IZQUIERDA: PREVISUALIZACIÓN PDF --- */}
        <div className={styles.previewCol}>
          {/* Visor PDF para Desktop */}
          <div className={styles.pdfContainer}>
            <iframe 
                src={`${downloadUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                className={styles.pdfFrame} 
                title="Vista previa del documento"
            />
            <div className={styles.mobileFallback}>
                <FaFilePdf size={40} color="#cbd5e1" />
                <span>Toque para ver el documento</span>
                <a href={downloadUrl} target="_blank" rel="noreferrer" className={styles.mobileBtn}>
                    Abrir PDF
                </a>
            </div>
          </div>
          
          <div className={styles.previewFooter}>
            <small>¿No puedes ver el documento? </small>
            <a href={downloadUrl} target="_blank" rel="noreferrer" className={styles.textLink}>
              Abrir en pantalla completa <FaExternalLinkAlt size={10} />
            </a>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: METADATOS --- */}
        <div className={styles.metaCol}>
          
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <FaCodeBranch className={styles.icon} />
              <div>
                <span className={styles.label}>Versión</span>
                <span className={styles.value}>{version}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <FaCalendarAlt className={styles.icon} />
              <div>
                <span className={styles.label}>Publicación</span>
                <span className={styles.value}>{date}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <FaInfoCircle className={styles.icon} />
              <div>
                <span className={styles.label}>Etapa Actual</span>
                <span className={styles.valueHighlight}>{stage}</span>
              </div>
            </div>
            <div className={styles.metaItem}>
              <FaUserTie className={styles.icon} />
              <div>
                <span className={styles.label}>Responsable</span>
                <span className={styles.value}>{responsible}</span>
              </div>
            </div>
          </div>

          <div className={styles.changesSection}>
            <h4 className={styles.sectionTitle}>Cambios Principales</h4>
            <p className={styles.changesText}>{summaryChanges}</p>
          </div>

          {relatedDocs && relatedDocs.length > 0 && (
            <div className={styles.relatedSection}>
              <span className={styles.relatedLabel}>Documentos relacionados:</span>
              <div className={styles.relatedLinks}>
                {relatedDocs.map((doc, idx) => (
                  <a key={idx} href={doc.url} className={styles.relatedLink} target="_blank" rel="noreferrer">
                    {doc.title} ↗
                  </a>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};