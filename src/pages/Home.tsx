
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { WeeklyPoll } from '../components/home/WeeklyPoll';

// Contenido para el Slide de Consulta
const ConsultationSlide = () => (
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
);

const Home = () => {
  // Estado para la letra y para la animación
  const [suffix, setSuffix] = useState('o');
  const [isVisible, setIsVisible] = useState(true);

  // --- Estados Carrusel ---
  const [currentSlide, setCurrentSlide] = useState(0); // 0: Encuesta, 1: Consulta

  useEffect(() => {
    // Configurar el intervalo para el cambio cada 3 segundos
    const intervalId = setInterval(() => {
      // 1. Ocultar letra
      setIsVisible(false);

      // 2. Esperar a que termine la transición CSS para cambiar la letra
      setTimeout(() => {
        setSuffix(prev => prev === 'o' ? 'a' : 'o');
        // 3. Mostrar letra 
        setIsVisible(true);
      }, 300); 

    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Funciones navegación Carrusel
  const nextSlide = () => setCurrentSlide(prev => (prev === 0 ? 1 : 0));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? 1 : 0));

  return (
    <div>
      {/* --- Hero Section: Bienvenida e Introducción --- */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Planeación Urbana <span className={styles.highlight}>Abierta y Participativa</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Bienvenid
            {/* Span dinámico con animación de letra */}
            <span className={`${styles.changingLetter} ${isVisible ? styles.fadeIn : styles.fadeOut}`}>
              {suffix}
            </span> 
            {' '} a la Bitácora del PMDU de Cancún. Este es el canal oficial para que 
            conozcas el proyecto y colabores directamente en la construcción de nuestra ciudad.
          </p>
        </div>
      </section>

      {/* 2. CARRUSEL INTERACTIVO (Encuesta/Consulta) */}
      <section className={styles.carouselSection}>
        
        <div className={styles.carouselContainer}>
          {/* Botón Izquierda */}
          <button 
            onClick={prevSlide} 
            className={`${styles.navButton} ${styles.prev}`}
            aria-label="Anterior"
          >
            &#10094;
          </button>

          {/* Contenido Dinámico */}
          <div className={styles.slideContent}>

            {/* Slide 0: Consulta */}
            {currentSlide === 0 && (
              <ConsultationSlide />
            )}

            {/* Slide 1: Encuesta */}
            {currentSlide === 1 && (
              <div className={styles.pollCard}>
                 <WeeklyPoll />
              </div>
            )}

          </div>

          {/* Botón Derecha */}
          <button 
            onClick={nextSlide} 
            className={`${styles.navButton} ${styles.next}`}
            aria-label="Siguiente"
          >
            &#10095;
          </button>
        </div>

        {/* Indicadores de Puntos */}
        <div className={styles.indicators}>
          <div 
            className={`${styles.dot} ${currentSlide === 0 ? styles.dotActive : ''}`} 
            onClick={() => setCurrentSlide(0)}
          />
          <div 
            className={`${styles.dot} ${currentSlide === 1 ? styles.dotActive : ''}`} 
            onClick={() => setCurrentSlide(1)}
          />
        </div>

      </section>
    </div>
  );
};

export default Home;