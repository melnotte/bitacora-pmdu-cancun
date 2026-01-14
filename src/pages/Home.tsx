import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { WeeklyPoll } from '../components/home/WeeklyPoll';
import { OfficialInstrumentSection } from '../components/home/OfficialInstrumentSection';
import questionImg from '../assets/question.png';

const Home = () => {
  const [suffix, setSuffix] = useState('o');
  const [isVisible, setIsVisible] = useState(true);
  const [isPollOpen, setIsPollOpen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setSuffix(prev => prev === 'o' ? 'a' : 'o');
        setIsVisible(true);
      }, 300); 
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Planeación Urbana <span className={styles.highlight}>Abierta y Participativa</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Bienvenid
            <span className={`${styles.changingLetter} ${isVisible ? styles.fadeIn : styles.fadeOut}`}>
              {suffix}
            </span> 
            {' '} a la Bitácora del PMDU de Cancún. Este es el canal oficial para que 
            conozcas el proyecto y colabores directamente en la construcción de nuestra ciudad.
          </p>
        </div>
      </section>

      {/* SECCIÓN DE VALIDEZ OFICIAL */}
      <OfficialInstrumentSection />

      {/* SECCIÓN DE CONSULTA */}
      <section className={styles.consultationSection}>
        <div className={styles.consultationContent}>
          <h2 className={styles.consultationTitle}>Consulta Pública y Comentarios</h2>
          <p className={styles.consultationText}>
            El borrador del PMDU está abierto a revisión. Tu opinión técnica y ciudadana 
            es fundamental para validar las estrategias de desarrollo.
          </p>
          <Link to="/consulta" className={styles.primaryButtonLight}>
            Participar en la Consulta
          </Link>
        </div>
      </section>

      {/* BOTÓN FLOTANTE */}
      <div 
        className={styles.pollTriggerButton} 
        onClick={() => setIsPollOpen(true)}
        title="¡Participa en la encuesta semanal!"
      >
        <img src={questionImg} alt="Encuesta" className={styles.pollTriggerImg} />
      </div>

      {/* MODAL */}
      {isPollOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsPollOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton} 
              onClick={() => setIsPollOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
            
            <WeeklyPoll />
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;