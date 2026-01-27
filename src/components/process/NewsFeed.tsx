import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Post, PostCategory } from '../../types';
import { FaSearch, FaFilter, FaCalendarAlt, FaEraser, FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import styles from './NewsFeed.module.css';

const ITEMS_PER_PAGE = 4;

const NewsFeed = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<PostCategory[]>([]); 
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Cargar Categorías
        const { data: catData } = await supabase
          .from('post_categories')
          .select('*')
          .order('name');
        
        // Mapeamos los datos al tipo correcto
        if (catData) setCategories(catData as PostCategory[]);

        // 2. Cargar Posts con relaciones
        const { data: postsData, error } = await supabase
          .from('posts')
          .select(`
            *,
            post_categories ( name, color )
          `)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(postsData as unknown as Post[] || []);

      } catch (err) {
        console.error('Error cargando noticias:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Resetear página a 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('Todas');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Lógica de filtrado
  const filteredPosts = posts.filter(post => {
    const term = searchTerm.toLowerCase();
    const catName = post.post_categories?.name || 'General';

    // 1. Búsqueda por texto
    const matchesSearch = 
      post.title.toLowerCase().includes(term) || 
      (post.content && post.content.toLowerCase().includes(term));
      
    // 2. Por Categoría
    const matchesCategory = categoryFilter === 'Todas' || catName === categoryFilter;

    // 3. Por Fechas
    let matchesDate = true;
    
    if ((startDate || endDate) && post.published_at) {
      
      const postDate = new Date(post.published_at);
      const pDate = new Date(postDate.getTime() + postDate.getTimezoneOffset() * 60000);

      if (startDate && pDate < new Date(startDate)) matchesDate = false;
      if (endDate && pDate > new Date(endDate)) matchesDate = false;
    
    } else if ((startDate || endDate) && !post.published_at) {
      matchesDate = false;
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  // Lógica de Paginación
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <div style={{textAlign: 'center', padding: '2rem'}}>Cargando bitácora...</div>;

  return (
    <div className={styles.feedContainer}>
      <h2 className={styles.heading}>Bitácora de Actualizaciones</h2>

      {/* Controles de búsqueda y filtro */}
      <div className={styles.filtersContainer}>

        {/* 1. Buscador */}
        <div className={styles.filterGroup}>
          <label className={styles.label}>Buscador</label>
          <div className={styles.inputWrapper}>
            <FaSearch className={styles.inputIcon} />
            <input
              type="text"
              placeholder="Palabra clave..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
        
        {/* 2. Categoría */}
        <div className={styles.filterGroup}>
            <label className={styles.label}>Categoría</label>
            <div className={styles.inputWrapper}>
              <FaFilter className={styles.inputIcon} />
              <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={styles.select}
              >
                  <option value="Todas">Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
              </select>
            </div>
        </div>

      {/* 3. Fecha Inicio */}
        <div className={styles.filterGroup}>
           <label className={styles.label}>Desde</label>
           <div className={styles.inputWrapper}>
             <FaCalendarAlt className={styles.inputIcon} />
             <input 
               type="date" 
               className={styles.input} 
               value={startDate} 
               onChange={(e) => setStartDate(e.target.value)} 
             />
           </div>
        </div>

        {/* 4. Fecha Fin */}
        <div className={styles.filterGroup}>
           <label className={styles.label}>Hasta</label>
           <div className={styles.inputWrapper}>
             <FaCalendarAlt className={styles.inputIcon} />
             <input 
               type="date" 
               className={styles.input} 
               value={endDate} 
               onChange={(e) => setEndDate(e.target.value)} 
             />
           </div>
        </div>

        {/* 5. Botón Limpiar */}
        <button onClick={handleClearFilters} className={styles.clearBtn} title="Limpiar filtros">
          <FaEraser /> Limpiar filtros
        </button>

      </div>

      {/* Grid de Resultados */}
      <div className={styles.grid}>
        {paginatedPosts.length > 0 ? (
          paginatedPosts.map(post => {
            const catName = post.post_categories?.name || 'General';
            const cleanCatName = catName.split(' ')[0];
            const badgeClass = styles[cleanCatName] ? styles[cleanCatName] : ''; 
            const badgeStyle = !badgeClass ? { backgroundColor: '#6b7280', color: 'white' } : {};

            return (
              <article 
                key={post.id} 
                className={styles.card}
                onClick={() => navigate(`/proceso/post/${post.id}`)}
                style={{ cursor: 'pointer' }} 
              >
                <div className={styles.cardHeader}>
                  <span 
                    className={`${styles.badge} ${badgeClass}`}
                    style={badgeStyle}
                  > 
                    {catName}
                  </span>
                  <span className={styles.cardDate}>{post.published_at}</span>
                </div>

                {post.image_url && (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    style={{ 
                      width: '100%', height: '180px', objectFit: 'cover', 
                      borderRadius: '6px', marginBottom: '1rem' 
                    }} 
                  />
                )}
                
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.cardContent}>
                  {post.excerpt || (post.content && post.content.substring(0, 100) + '...')}
                </p>

                <span className={styles.readMore}>
                  Leer más <FaArrowRight style={{ fontSize: '0.8em' }} />
                </span>

              </article>
            );
          })
        ) : (
          <div className={styles.noResults}>
             <p>No se encontraron resultados con los filtros actuales.</p>
             <button 
                onClick={handleClearFilters}
                style={{
                  marginTop:'1rem', 
                  color: '#005eb8', 
                  background: 'none', 
                  border: 'none', 
                  textDecoration: 'underline', 
                  cursor: 'pointer'
                }}
             >
               Limpiar filtros
             </button>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className={styles.pageButton}
          >
            <FaChevronLeft /> Anterior
          </button>
          
          <span className={styles.pageInfo}>
            Página {currentPage} de {totalPages}
          </span>
          
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className={styles.pageButton}
          >
            Siguiente <FaChevronRight />
          </button>
        </div>
      )}

    </div>
  );
};

export default NewsFeed;