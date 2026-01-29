import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserLock, FaSignOutAlt } from 'react-icons/fa';
import { menuItems } from '../../config/siteConfig';
import styles from './Navbar.module.css';
import { supabase } from '../../lib/supabase';
import type { User } from '@supabase/supabase-js';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          PMDU Benito Juárez
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
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Icono de Login */}
          <li className={styles.navItem}>
            <Link 
              to={user ? "/transparency" : "/login"} 
              className={styles.adminIconLink}
              title={user ? "Panel de Control" : "Acceso Administrativo"}
              onClick={() => setIsOpen(false)}
            >
              <FaUserLock style={{ 
                opacity: user ? 1 : 0.6, 
                color: user ? '#005eb8' : 'inherit' 
              }} />
            </Link>
          </li>

          {user && (
            <li className={styles.navItem}>
              <button 
                onClick={handleLogout} 
                className={styles.logoutBtn}
                title="Cerrar Sesión"
              >
                <FaSignOutAlt />
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;