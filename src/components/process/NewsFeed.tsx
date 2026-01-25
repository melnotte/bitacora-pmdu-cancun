import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { PostRow } from '../../types';
import { FaSearch, FaFilter } from 'react-icons/fa';
import styles from './NewsFeed.module.css';

const NewsFeed = () => {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Lógica de filtrado
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (err) {
        console.error('Error cargando noticias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      post.title.toLowerCase().includes(term) || 
      (post.content && post.content.toLowerCase().includes(term));
      
    const matchesCategory = categoryFilter === 'Todas' || post.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', 'Taller', 'Avance', 'Comunicado', 'Hito'];

  if (loading) return <div style={{textAlign: 'center', padding: '2rem'}}>Cargando bitácora...</div>;

  return (
    <div className={styles.feedContainer}>
      <h2 className={styles.heading}>Bitácora de Actualizaciones</h2>

      {/* Controles de búsqueda y filtro */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
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
                <span className={`${styles.badge} ${styles[post.category || 'Comunicado']}`}> {post.category || 'Comunicado'}</span>
                <span className={styles.cardDate}>{post.published_at}</span>
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