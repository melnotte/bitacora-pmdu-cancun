import type { PMDUDocument } from '../../data/documentsData';
import styles from './DocumentCard.module.css';
import { FaFileDownload, FaCalendarAlt, FaCodeBranch, FaEye } from 'react-icons/fa';

interface Props {
  doc: PMDUDocument;
}

const DocumentCard = ({ doc }: Props) => {
  return (
    <div className={styles.card}>
      <div>
        <div className={styles.header}>
          <span className={styles.typeBadge} data-type={doc.type}>{doc.type}</span>
          <span className={styles.typeBadge}>{doc.size}</span>
        </div>
        
        <h3 className={styles.title}>{doc.title}</h3>
        
        <div className={styles.meta}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaCalendarAlt size={12} /> {doc.date}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaCodeBranch size={12} /> {doc.version}
          </span>
        </div>

        <p className={styles.description}>{doc.description}</p>
      </div>

      <div>
        <div className={styles.actions}>
          {/* Botón 1: Visualizar */}
          <a 
            href={doc.url} 
            className={`${styles.btn} ${styles.viewBtn}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <FaEye /> Visualizar
          </a>

          {/* Botón 2: Descargar */}
          <a 
            href={doc.url} 
            className={`${styles.btn} ${styles.downloadBtn}`} 
            download
          >
            <FaFileDownload /> Descargar
          </a>
        </div>

        {doc.tags.length > 0 && (
          <div className={styles.tags}>
            {doc.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;