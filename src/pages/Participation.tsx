import { useState, useMemo } from 'react'; // Usamos useMemo para optimizar filtros
import { events } from '../data/eventsData';
import EventCard from '../components/agenda/EventCard';
import styles from './Participation.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ITEMS_PER_PAGE = 3;

const ParticipationPage = () => {
  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<'proximos' | 'pasados'>('proximos');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filtros
  const [filters, setFilters] = useState({
    modality: 'Todos',
    category: 'Todas',
    district: 'Todos',
    dateStart: '',
    dateEnd: ''
  });

  // --- LÓGICA DE FILTRADO ---
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // 1. Filtrar por Tab (Próximos vs Pasados)
      const eventDate = new Date(event.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const isUpcoming = eventDate >= today;
      if (activeTab === 'proximos' && !isUpcoming) return false;
      if (activeTab === 'pasados' && isUpcoming) return false;

      // 2. Filtros Selects
      if (filters.modality !== 'Todos' && event.modality !== filters.modality) return false;
      if (filters.category !== 'Todas' && event.category !== filters.category) return false;
      if (filters.district !== 'Todos' && event.district !== filters.district) return false;

      // 3. Filtro Rango de Fechas
      if (filters.dateStart && event.date < filters.dateStart) return false;
      if (filters.dateEnd && event.date > filters.dateEnd) return false;

      return true;
    }).sort((a, b) => {
      // Ordenamiento
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return activeTab === 'proximos' ? dateA - dateB : dateB - dateA;
    });
  }, [activeTab, filters]);

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reiniciar página a 1 cuando cambian los filtros
  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1); 
  };

  const handleTabChange = (tab: 'proximos' | 'pasados') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Participación Ciudadana</h1>
        <p className={styles.subtitle}>Encuentra talleres, foros y audiencias por zona o tema.</p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'proximos' ? styles.active : ''}`}
          onClick={() => handleTabChange('proximos')}
        >
          Próximos Eventos
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'pasados' ? styles.active : ''}`}
          onClick={() => handleTabChange('pasados')}
        >
          Eventos Realizados
        </button>
      </div>

      {/* Panel de Filtros Completo */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label>Tema:</label>
          <select 
            value={filters.category} 
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className={styles.select}
          >
            <option value="Todas">Todos los temas</option>
            <option value="Taller">Talleres</option>
            <option value="Conferencia">Conferencias</option>
            <option value="Mesa de Trabajo">Mesas de Trabajo</option>
            <option value="Audiencia">Audiencias</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Modalidad:</label>
          <select 
            value={filters.modality} 
            onChange={(e) => handleFilterChange('modality', e.target.value)}
            className={styles.select}
          >
            <option value="Todos">Cualquiera</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Zona / Distrito:</label>
          <select 
            value={filters.district} 
            onChange={(e) => handleFilterChange('district', e.target.value)}
            className={styles.select}
          >
            <option value="Todos">Todas las zonas</option>
            <option value="Centro">Centro</option>
            <option value="Zona Norte">Zona Norte</option>
            <option value="Zona Sur">Zona Sur</option>
            <option value="Zona Hotelera">Zona Hotelera</option>
            <option value="Bonfil">Bonfil</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Desde:</label>
          <input 
            type="date" 
            className={styles.dateInput}
            value={filters.dateStart}
            onChange={(e) => handleFilterChange('dateStart', e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Hasta:</label>
          <input 
            type="date" 
            className={styles.dateInput}
            value={filters.dateEnd}
            onChange={(e) => handleFilterChange('dateEnd', e.target.value)}
          />
        </div>
      </div>

      {/* Resultados */}
      <div className={styles.resultsInfo}>
        Mostrando {paginatedEvents.length} de {filteredEvents.length} eventos
      </div>

      <div className={styles.grid}>
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onClick={(id) => alert(`Ir a detalle de: ${id}`)} 
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No se encontraron eventos con estos filtros.</p>
            <button 
              className={styles.clearButton}
              onClick={() => setFilters({
                modality: 'Todos', category: 'Todas', district: 'Todos', dateStart: '', dateEnd: ''
              })}
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

export default ParticipationPage;