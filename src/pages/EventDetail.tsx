import { useParams, Link } from 'react-router-dom';
import { events } from '../data/eventsData';
import EventRegistration from '../components/agenda/EventRegistration';
import styles from './EventDetail.module.css';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaFilePdf, FaVideo, FaImages } from 'react-icons/fa';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = events.find(e => e.id === id);

  if (!event) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><h2>Evento no encontrado</h2><Link to="/participa">Volver a la agenda</Link></div>;
  }

  const isPast = event.status === 'finalizado';

  return (
    <div className={styles.pageContainer}>
      <Link to="/participa" className={styles.backLink}>
        <FaArrowLeft /> Volver a la Agenda
      </Link>

      {/* HEADER */}
      <header className={styles.header}>
        <span className={`${styles.statusBadge} ${styles[event.status]}`}>
          {event.status === 'lleno' ? 'Cupo Lleno' : event.status}
        </span>
        <h1 className={styles.title}>{event.title}</h1>
        
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <FaCalendarAlt className={styles.metaIcon} />
            <div>
              <strong>Fecha y Hora</strong><br/>
              {event.date} • {event.time}
            </div>
          </div>
          <div className={styles.metaItem}>
            <FaMapMarkerAlt className={styles.metaIcon} />
            <div>
              <strong>Ubicación ({event.modality})</strong><br/>
              {event.location} <br/>
              <small>{event.district}</small>
            </div>
          </div>
          <div className={styles.metaItem}>
            <FaUsers className={styles.metaIcon} />
            <div>
              <strong>Organiza</strong><br/>
              {event.organizers?.join(', ') || 'Comité PMDU'}
            </div>
          </div>
        </div>
      </header>

      {/* DESCRIPCIÓN Y AGENDA */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sobre el evento</h3>
        <p>{event.description}</p>
      </div>

      {event.agenda && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Agenda del día</h3>
          <ul className={styles.agendaList}>
            {event.agenda.map((item, index) => {
              const [time, ...desc] = item.split(' - ');
              return (
                <li key={index} className={styles.agendaItem}>
                  <span className={styles.agendaTime}>{time}</span>
                  <span>{desc.join(' - ')}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* LÓGICA CONDICIONAL: REGISTRO O EVIDENCIAS */}
      
      {/* Caso 1: Evento Abierto -> Mostrar Registro */}
      {event.status === 'abierto' && (
        <EventRegistration eventId={event.id} eventTitle={event.title} />
      )}

      {/* Caso 2: Evento Finalizado -> Mostrar Evidencias */}
      {isPast && event.evidence && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Evidencias y Resultados</h3>
          <p style={{ marginBottom: '20px' }}>Consulta los documentos y materiales resultantes de esta sesión:</p>
          <div className={styles.evidenceGrid}>
            {event.evidence.reportUrl && (
              <a href={event.evidence.reportUrl} className={styles.evidenceCard} target="_blank" rel="noreferrer">
                <FaFilePdf className={styles.evidenceIcon} />
                Minuta / Reporte (PDF)
              </a>
            )}
            {event.evidence.presentationUrl && (
              <a href={event.evidence.presentationUrl} className={styles.evidenceCard} target="_blank" rel="noreferrer">
                <FaFilePdf className={styles.evidenceIcon} />
                Presentación
              </a>
            )}
            {event.evidence.videoUrl && (
              <a href={event.evidence.videoUrl} className={styles.evidenceCard} target="_blank" rel="noreferrer">
                <FaVideo className={styles.evidenceIcon} />
                Grabación de la Sesión
              </a>
            )}
            {event.evidence.photosUrl && (
              <a href={event.evidence.photosUrl} className={styles.evidenceCard} target="_blank" rel="noreferrer">
                <FaImages className={styles.evidenceIcon} />
                Galería de Fotos
              </a>
            )}
          </div>
        </div>
      )}

      {/* Caso 3: Evento Lleno */}
      {event.status === 'lleno' && (
        <div style={{ padding: '30px', background: '#ffebee', borderRadius: '8px', color: '#c62828', textAlign: 'center' }}>
          <h3>Registro Cerrado</h3>
          <p>Lo sentimos, el cupo para este evento se ha completado. Mantente atento a futuras fechas.</p>
        </div>
      )}
    </div>
  );
};

export default EventDetail;