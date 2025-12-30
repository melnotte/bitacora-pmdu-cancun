import { phases } from '../../data/processData';
import styles from './Timeline.module.css';
import { 
  FaFlag, 
  FaUsers, 
  FaComments, 
  FaBullhorn, 
  FaCheckCircle, 
  FaFilePdf,
  FaCalendarAlt
} from 'react-icons/fa';

const Timeline = () => {
  // Función auxiliar para asignar iconos según el título o estado
  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('diagnóstico')) return <FaComments />;
    if (title.toLowerCase().includes('estrategias')) return <FaUsers />;
    if (title.toLowerCase().includes('consulta')) return <FaBullhorn />;
    return <FaFlag />;
  };

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>Línea de Tiempo PMDU</h2>
        <p className={styles.subtitle}>Seguimiento visual del Plan Municipal de Desarrollo Urbano</p>
      </div>

      <div className={styles.timeline}>
        {/* Línea central dibujada por CSS */}
        
        {phases.map((phase, index) => (
          <div key={phase.id} className={`${styles.item} ${index % 2 === 0 ? styles.left : styles.right}`}>
            
            {/* 1. Punto Central */}
            <div className={`${styles.marker} ${styles[phase.status]}`}>
               {/* Icono pequeño dentro del punto central */}
               {phase.status === 'completed' ? <FaCheckCircle /> : <div className={styles.dot} />}
            </div>

            {/* 2. Tarjeta de Contenido */}
            <div className={styles.content}>
              
              {/* Etiqueta de Año/Fecha flotante */}
              <span className={styles.dateBadge}>{phase.dates.split(' ')[1] || '2024'}</span>

              <div className={styles.cardHeader}>
                {/* Icono Grande Decorativo */}
                <div className={styles.iconBox}>
                  {getIcon(phase.title)}
                </div>
                <h3 className={styles.title}>{phase.title}</h3>
              </div>
              
              <p className={styles.description}>{phase.description}</p>
              
              {/* Links de Documentos/Eventos */}
              {(phase.documents || phase.events) && (
                <div className={styles.extras}>
                  {phase.documents?.map((doc, idx) => (
                    <a key={idx} href={doc.url} className={styles.link}>
                      <FaFilePdf /> {doc.name}
                    </a>
                  ))}
                  {phase.events?.map((evt, idx) => (
                    <a key={idx} href={evt.url} className={styles.link}>
                      <FaCalendarAlt /> {evt.name}
                    </a>
                  ))}
                </div>
              )}

              {/* Etiqueta inferior tipo "Hito/Taller" */}
              <span className={`${styles.categoryTag} ${styles[phase.status]}`}>
                {phase.status === 'completed' ? 'Finalizado' : phase.status === 'active' ? 'En Curso' : 'Próximamente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;