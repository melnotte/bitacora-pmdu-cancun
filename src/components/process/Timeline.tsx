import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { ProcessPhase } from '../../types';
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
  const [phases, setPhases] = useState<ProcessPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        // Pedimos Fases, Documentos y Eventos en una sola consulta
        const { data, error } = await supabase
          .from('process_phases')
          .select(`
            *,
            documents ( title, url ),
            events ( id, title )
          `)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error al cargar fases:', error);
        } else {
          setPhases((data as unknown as ProcessPhase[]) || []);
        }
      } catch (err) {
        console.error('Error de conexión:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  const getIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('diagnóstico')) return <FaComments />;
    if (t.includes('estrategias') || t.includes('imagen')) return <FaUsers />;
    if (t.includes('consulta')) return <FaBullhorn />;
    return <FaFlag />;
  };

  if (loading) return <div className={styles.loading}>Cargando línea de tiempo...</div>;

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.header}>
        <h2 className={styles.mainTitle}>Línea de Tiempo PMDU</h2>
        <p className={styles.subtitle}>Seguimiento visual del Programa Municipal de Desarrollo Urbano</p>
      </div>

      <div className={styles.timeline}>
        {phases.map((phase, index) => (
          <div key={phase.id} className={`${styles.item} ${index % 2 === 0 ? styles.left : styles.right}`}>
            
            <div className={`${styles.marker} ${styles[phase.status || 'upcoming']}`}>
               {phase.status === 'completed' ? <FaCheckCircle /> : <div className={styles.dot} />}
            </div>

            <div className={styles.content}>
              <span className={styles.dateBadge}>
                {phase.display_dates?.split(' ')[1] || '2026'}
              </span>

              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>
                  {getIcon(phase.title)}
                </div>
                <h3 className={styles.title}>{phase.title}</h3>
              </div>
              
              <p className={styles.description}>{phase.description}</p>
              
              {/* Renderizado condicional de Documentos y Eventos */}
              <div className={styles.extras}>
                
                {/* Documentos (Icono PDF) */}
                {phase.documents?.map((doc, idx) => (
                  <a key={`doc-${idx}`} href={doc.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                    <FaFilePdf /> {doc.title}
                  </a>
                ))}

                {/* Eventos (Icono Calendario y Link a /participa) */}
                {phase.events?.map((evt, idx) => (
                  <a key={`evt-${idx}`} href={`/participa?event_id=${evt.id}`} className={styles.link}>
                    <FaCalendarAlt /> {evt.title}
                  </a>
                ))}
              </div>

              <span className={`${styles.categoryTag} ${styles[phase.status || 'upcoming']}`}>
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