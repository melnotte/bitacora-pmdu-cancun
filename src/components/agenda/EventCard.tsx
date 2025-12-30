import { type Event } from '../../data/eventsData';
import { FaCalendarDay, FaMapMarkerAlt } from 'react-icons/fa';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: Event;
  onClick: (id: string) => void;
}

const EventCard = ({ event, onClick }: EventCardProps) => {
  const isPast = event.status === 'finalizado';

  // Formatear fecha para que se vea bonita
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-MX', options);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${styles[event.modality.toLowerCase()]}`}>
            {event.modality}
          </span>
          <span className={`${styles.badge} ${styles[event.status]}`}>
            {event.status}
          </span>
        </div>
        <div className={styles.date}>
          <FaCalendarDay /> {formatDate(event.date)} • {event.time}
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
          onClick={() => onClick(event.id)}
          className={`${styles.actionButton} ${event.status === 'lleno' ? styles.disabledButton : ''}`}
        >
          {isPast ? 'Ver Resultados' : 'Ver Detalles'}
        </button>
      </div>
    </article>
  );
};

export default EventCard;