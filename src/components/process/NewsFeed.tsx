import { useState } from 'react';
import { newsPosts } from '../../data/processData';
import { FaSearch, FaFilter } from 'react-icons/fa';
import styles from './NewsFeed.module.css';

const NewsFeed = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Lógica de filtrado
  const filteredPosts = newsPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', 'Taller', 'Avance', 'Comunicado', 'Hito'];

  return (
    <div className={styles.feedContainer}>
      <h2 className={styles.heading}>Bitácora de Actualizaciones</h2>

      {/* Controles de búsqueda y filtro */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar en la bitácora..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterBox}>
            <FaFilter className={styles.filterIcon} />
            <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className={styles.selectInput}
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
        </div>
      </div>

      {/* Lista de posts */}
      <div className={styles.grid}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <article key={post.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${styles[post.category]}`}>{post.category}</span>
                <span className={styles.cardDate}>{post.date}</span>
              </div>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardContent}>{post.content}</p>
            </article>
          ))
        ) : (
          <p className={styles.noResults}>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;