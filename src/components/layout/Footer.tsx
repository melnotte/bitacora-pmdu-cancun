import styles from './Footer.module.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.column}>
          <h3>PMDU Cancún</h3>
          <p>Programa Municipal de Desarrollo Urbano</p>
          <div className={styles.socials}>
            <FaFacebook /> <FaXTwitter /> <FaInstagram />
          </div>
        </div>
        
        <div className={styles.column}>
          <h4>Legal</h4>
          <a href="#">Aviso de Privacidad</a>
          <a href="#">Términos de Uso</a>
          <a href="#">Accesibilidad</a>
        </div>

        <div className={styles.column}>
          <h4>Contacto</h4>
          <p>Ayuntamiento de Benito Juárez</p>
          <p>contacto@cancun.gob.mx</p>
        </div>
      </div>
      <div className={styles.copy}>
        &copy; {new Date().getFullYear()} Gobierno Municipal de Benito Juárez.
      </div>
    </footer>
  );
};

export default Footer;