import { type UIEvent } from '../../types';
import { FaCalendarDay, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: UIEvent;
  onClick: (id: string) => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  const statusClass = event.status ? styles[event.status.toLowerCase()] : '';
  const modalityClass = event.modality ? styles[event.modality.toLowerCase()] : '';

  // Formatear fecha
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Fecha por definir';
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('es-MX', options);
  };

  // Formatear rango de horas (Ej: "10:00 - 14:00 hrs" o "12:00 hrs")
  const formatTimeRange = (start: string | null, end: string | null) => {
    if (!start) return 'Hora por definir';
    
    const s = start.slice(0, 5);
    if (!end) return `${s} hrs`;
    
    const e = end.slice(0, 5);
    return `${s} - ${e} hrs`;
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badges}>
          {event.modality && (
            <span className={`${styles.badge} ${modalityClass}`}>
              {event.modality}
            </span>
          )}
          {event.status && (
             <span className={`${styles.badge} ${statusClass}`}>
              {event.status}
            </span>
          )}
        </div>
        <div className={styles.date}>
          <FaCalendarDay /> {formatDate(event.date)} • {formatTimeRange(event.start_time, event.end_time)}
        </div>
        <h3 className={styles.title}>{event.title}</h3>
      </div>
      
      <div className={styles.body}>
        <p className={styles.description}>{event.description}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.location}>
          <FaMapMarkerAlt style={{ marginRight: '5px' }} />
          {event.location}
        </div>
        <button 
          onClick={() => onClick(event.id.toString())} 
          className={`${styles.actionButton} ${event.status === 'abierto' ? styles.register : styles.details}`}
        >
          {event.status === 'abierto' ? 'Registrarme' : 'Ver Detalles'}
        </button>
      </div>
    </article>
  );
};

export default EventCard;