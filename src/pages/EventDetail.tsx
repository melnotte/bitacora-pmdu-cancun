import { useParams, Link } from 'react-router-dom';
import { events } from '../data/eventsData';
import EventRegistration from '../components/agenda/EventRegistration';
import styles from './EventDetail.module.css';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaFilePdf, 
  FaVideo, 
  FaImages,
  FaCalendarPlus,
  FaApple,
  FaFacebook,
  FaLink,
  FaFileAlt,
  FaClipboardList
} from 'react-icons/fa';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';

// Interfaz auxiliar
interface EvidenceData {
  url: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = events.find(e => e.id === id);

  if (!event) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><h2>Evento no encontrado</h2><Link to="/participa">Volver a la agenda</Link></div>;
  }

  const isPast = event.status === 'finalizado';

  const mapSrc = event.lat && event.lng
  ? `https://maps.google.com/maps?q=${event.lat},${event.lng}&z=17&output=embed`
  : `https://maps.google.com/maps?q=${encodeURIComponent(event.mapQuery || event.location)}&z=15&output=embed`;

  // --- MÉTODOS DE CALENDARIO Y COMPARTIR  ---
  const handleGoogleCalendar = () => {
    const startDate = event.date.replace(/-/g, '') + 'T090000';
    const endDate = event.date.replace(/-/g, '') + 'T180000';
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${startDate}/${endDate}`;
    window.open(googleUrl, '_blank');
  };

  const handleICalDownload = () => {
    const now = new Date(); 
    const icsContent = `BEGIN:VCALENDAR
      VERSION:2.0
      PRODID:-//PMDU Cancun//Eventos//ES
      BEGIN:VEVENT
      UID:${event.id}@pmducancun.gob.mx
      DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
      DTSTART:${event.date.replace(/-/g, '')}T090000
      DTEND:${event.date.replace(/-/g, '')}T180000
      SUMMARY:${event.title}
      DESCRIPTION:${event.description}
      LOCATION:${event.location}
      END:VEVENT
      END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentUrl = `${window.location.origin}/participa/${event.id}`;
  const shareText = `¡Participa en el evento: ${event.title}!`;

  const shareOnWhatsApp = () => { window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank'); };
  const shareOnFacebook = () => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank'); };
  const shareOnX = () => { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank'); };
  const copyLink = () => { navigator.clipboard.writeText(currentUrl); alert('Enlace copiado al portapapeles.'); };

  // --- HELPER ---
  const renderEvidenceCard = (
    data: string | EvidenceData | undefined, 
    label: string, 
    Icon: React.ElementType
  ) => {
    if (!data) return null;

    const url = typeof data === 'string' ? data : data.url;
    const date = typeof data !== 'string' ? data.uploadedAt : null;
    const author = typeof data !== 'string' ? data.uploadedBy : null;

    return (
      <a href={url} className={styles.evidenceCard} target="_blank" rel="noreferrer">
        <Icon className={styles.evidenceIcon} />
        <span className={styles.evidenceTitle}>{label}</span>
        
        {/* Renderizado de Metadatos */}
        {(date || author) && (
          <div className={styles.evidenceMeta}>
            {date && <span className={styles.metaDate}>Subido: {date}</span>}
            {author && <span className={styles.metaAuthor}>Resp: {author}</span>}
          </div>
        )}
      </a>
    );
  };

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

        {/* BOTONES DE ACCIÓN */}
        <div className={styles.actionButtons}>
          <button onClick={handleGoogleCalendar} className={styles.iconButton} title="Agregar a Google Calendar">
            <FaCalendarPlus style={{ color: '#4285F4' }} /> Agregar a Calendar
          </button>
          
          <button onClick={handleICalDownload} className={styles.iconButton} title="Descargar para Outlook/Apple">
             <FaApple /> Apple/Outlook (.ics)
          </button>

          <div style={{ width: '1px', background: '#ddd', margin: '0 10px' }}></div>

          <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500, alignSelf: 'center' }}>
            Compartir:
          </span>

          <button onClick={shareOnWhatsApp} className={styles.iconButton} style={{ color: '#25D366', borderColor: '#25D366' }}>
            <FaWhatsapp size={20} />
          </button>
          <button onClick={shareOnFacebook} className={styles.iconButton} style={{ color: '#1877F2', borderColor: '#1877F2' }}>
            <FaFacebook size={20} />
          </button>
          <button onClick={shareOnX} className={styles.iconButton} style={{ color: '#000000', borderColor: '#000000' }}>
            <FaXTwitter size={20} />
          </button>
          <button onClick={copyLink} className={styles.iconButton}>
            <FaLink size={18} />
          </button>
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
      
      {/* Caso 1: Evento Abierto */}
      {event.status === 'abierto' && (
        <EventRegistration eventId={event.id} eventTitle={event.title} />
      )}

      {/* Caso 2: Evento Finalizado -> Mostrar Evidencias Actualizadas */}
      {isPast && event.evidence && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Evidencias y Resultados</h3>
          <p style={{ marginBottom: '20px' }}>
            Documentación oficial, metadatos y materiales resultantes de esta sesión:
          </p>
          
          <div className={styles.evidenceGrid}>
            {/* Usamos el helper para renderizar cada tipo con sus metadatos */}
            {renderEvidenceCard(event.evidence.reportUrl, 'Minuta / Reporte', FaFilePdf)}
            {renderEvidenceCard(event.evidence.presentationUrl, 'Presentación', FaFilePdf)}
            {renderEvidenceCard(event.evidence.attendanceUrl, 'Lista de Asistencia', FaClipboardList)}
            {renderEvidenceCard(event.evidence.videoUrl, 'Grabación de Sesión', FaVideo)}
            {renderEvidenceCard(event.evidence.transcriptUrl, 'Transcripción', FaFileAlt)}
            
            {/* Galería de fotos */}
            {event.evidence.photosUrl && (
              <a href={typeof event.evidence.photosUrl === 'string' ? event.evidence.photosUrl : event.evidence.photosUrl.url} className={styles.evidenceCard} target="_blank" rel="noreferrer">
                <FaImages className={styles.evidenceIcon} />
                <span className={styles.evidenceTitle}>Galería de Fotos</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN DE MAPA */}
      {event.modality === 'Presencial' && mapSrc && (
        <div className={styles.section} style={{ marginTop: '50px' }}>
        <h3 className={styles.sectionTitle}>Ubicación</h3>
        <p>Cómo llegar a: <strong>{event.location}</strong></p>
        <div className={styles.mapContainer}>
          <iframe className={styles.mapFrame} title="Mapa de Ubicación" src={mapSrc} loading="lazy" />
        </div>
      </div>
    )}

      {/* Caso 3: Evento Lleno */}
      {event.status === 'lleno' && (
        <div style={{ padding: '30px', background: '#ffebee', borderRadius: '8px', color: '#c62828', textAlign: 'center' }}>
          <h3>Registro Cerrado</h3>
          <p>Lo sentimos, el cupo se ha completado.</p>
        </div>
      )}
    </div>
  );
};

export default EventDetail;