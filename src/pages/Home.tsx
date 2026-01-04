
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  // Estado para la letra y para la animación
  const [suffix, setSuffix] = useState('o');
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div>
      {/* 1. Hero Section: Bienvenida e Introducción */}
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

      {/* 2. Banner de Consulta Pública */}
      <section className={styles.consultationBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerHeader}>
            <h2 className={styles.bannerTitle}>Consulta Pública y Comentarios</h2>
            <p className={styles.bannerText}>
              El borrador del PMDU está abierto a revisión. Tu opinión técnica y ciudadana 
              es fundamental para validar las estrategias de desarrollo.
            </p>
            
            {/* Botón que lleva a Consulta */}
            <Link to="/consulta" className={styles.primaryButton}>
              Participar en la Consulta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;