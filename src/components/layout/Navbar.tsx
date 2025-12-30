import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { menuItems } from '../../config/siteConfig';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          PMDU Cancún
        </Link>

        {/* Botón Móvil */}
        <div className={styles.mobileIcon} onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Links de Navegación */}
        <ul className={`${styles.navMenu} ${isOpen ? styles.active : ''}`}>
          {menuItems.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <Link 
                to={item.path} 
                className={styles.navLink}
                onClick={() => setIsOpen(false)} // Cierra menú al dar clic
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;