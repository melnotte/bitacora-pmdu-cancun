import { useState, useMemo, useEffect } from 'react'; // Agregamos useEffect
import { type Comment, type CommentStatus } from '../../data/commentsData';
import { FaDownload, FaSave, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Iconos nuevos
import styles from './ModerationPanel.module.css';

interface ModerationPanelProps {
  comments: Comment[];
  onUpdateComment: (id: string, newStatus: CommentStatus, newNote: string) => void;
}

const ITEMS_PER_PAGE = 5;

const ModerationPanel = ({ comments, onUpdateComment }: ModerationPanelProps) => {
  // --- ESTADOS DE FILTROS ---
  const [searchText, setSearchText] = useState('');
  const [filterTopic, setFilterTopic] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // --- ESTADO DE PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);

  // Estados de edición
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // 1. Resetear página al filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterTopic, filterStatus, dateStart, dateEnd]);

  // 2. Obtener lista única de temas
  const uniqueTopics = useMemo(() => {
    const topics = new Set(comments.map(c => c.topic));
    return Array.from(topics).sort();
  }, [comments]);

  // 3. Filtrado Maestro
  const filteredData = useMemo(() => {
    return comments.filter(c => {
      const matchesSearch = 
        searchText === '' ||
        c.folio.toLowerCase().includes(searchText.toLowerCase()) ||
        c.topic.toLowerCase().includes(searchText.toLowerCase()) ||
        c.content.toLowerCase().includes(searchText.toLowerCase());

      const matchesTopic = filterTopic === 'Todos' || c.topic === filterTopic;
      const matchesStatus = filterStatus === 'Todos' || c.status === filterStatus;

      const cDate = new Date(c.date);
      const matchesDateStart = !dateStart || cDate >= new Date(dateStart);
      const matchesDateEnd = !dateEnd || cDate <= new Date(dateEnd);

      return matchesSearch && matchesTopic && matchesStatus && matchesDateStart && matchesDateEnd;
    });
  }, [comments, searchText, filterTopic, filterStatus, dateStart, dateEnd]);

  // 4. Lógica de Paginación
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- HANDLERS---
  const handleStatusChange = (id: string, newStatus: string) => {
    const current = comments.find(c => c.id === id);
    if (current) {
      onUpdateComment(id, newStatus as CommentStatus, current.internalNote);
    }
  };

  const startEditingNote = (comment: Comment) => {
    setEditingId(comment.id);
    setTempNote(comment.internalNote);
  };

  const saveNote = (id: string, currentStatus: CommentStatus) => {
    onUpdateComment(id, currentStatus, tempNote);
    setEditingId(null);
  };

  const clearFilters = () => {
    setSearchText('');
    setFilterTopic('Todos');
    setFilterStatus('Todos');
    setDateStart('');
    setDateEnd('');
  };

  const handleExportCSV = () => {
    const headers = ['Folio', 'Fecha', 'Tema', 'Zona', 'Comentario', 'Estatus', 'Nota Interna'];
    // Exporta todos los resultados del filtro
    const csvContent = [
      headers.join(','),
      ...filteredData.map(c => 
        [c.folio, c.date, c.topic, c.zone, `"${c.content.replace(/"/g, '""')}"`, c.status, `"${c.internalNote}"`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_comentarios_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusClass = (status: CommentStatus) => {
    switch(status) {
      case 'Recibido': return styles.statusRecibido;
      case 'En análisis': return styles.statusAnalisis;
      case 'Atendido/Integrado': return styles.statusIntegrado;
      case 'No procedente': return styles.statusNoProcedente;
      default: return styles.statusDuplicado;
    }
  };

  return (
    <div className={styles.panel}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <h2 className={styles.title}>Bandeja de Entrada de Comentarios</h2>
        <div className={styles.controls}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className={styles.searchInput}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <button onClick={handleExportCSV} className={styles.exportBtn}>
            <FaDownload /> Exportar ({filteredData.length})
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tema</label>
          <select className={styles.filterSelect} value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
            <option value="Todos">Todos</option>
            {uniqueTopics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Estatus</label>
          <select className={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Recibido">Recibido</option>
            <option value="En análisis">En análisis</option>
            <option value="Atendido/Integrado">Integrado</option>
            <option value="No procedente">No procedente</option>
            <option value="Duplicado">Duplicado</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Desde</label>
          <input type="date" className={styles.filterInput} value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Hasta</label>
          <input type="date" className={styles.filterInput} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
        </div>
        <button onClick={clearFilters} className={styles.clearBtn}>Limpiar</button>
      </div>

      {/* TABLA */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Folio / Fecha</th>
              <th>Tema / Zona</th>
              <th style={{ width: '35%' }}>Comentario</th>
              <th>Estatus</th>
              <th>Nota Interna</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((comment) => (
              <tr key={comment.id}>
                <td>
                  <span className={styles.colFolio}>{comment.folio}</span>
                  <span className={styles.dateSub}>{comment.date}</span>
                </td>
                <td>
                  <span className={styles.topicMain}>{comment.topic}</span>
                  <span className={styles.zoneSub}>{comment.zone || 'N/A'}</span>
                </td>
                <td>
                  <p className={styles.contentPreview} title={comment.content}>{comment.content}</p>
                </td>
                <td>
                  <select 
                    value={comment.status}
                    onChange={(e) => handleStatusChange(comment.id, e.target.value)}
                    className={`${styles.statusSelect} ${getStatusClass(comment.status)}`}
                  >
                    <option value="Recibido">Recibido</option>
                    <option value="En análisis">En análisis</option>
                    <option value="Atendido/Integrado">Integrado</option>
                    <option value="No procedente">No procedente</option>
                    <option value="Duplicado">Duplicado</option>
                  </select>
                </td>
                <td>
                  {editingId === comment.id ? (
                    <div className={styles.editContainer}>
                      <textarea 
                        className={styles.noteTextarea}
                        rows={2}
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => saveNote(comment.id, comment.status)} className={styles.saveNoteBtn}>
                        <FaSave size={16} />
                      </button>
                    </div>
                  ) : (
                    <div onClick={() => startEditingNote(comment)} className={styles.noteDisplay}>
                      {comment.internalNote ? (
                        <span className={styles.noteText}>{comment.internalNote}</span>
                      ) : (
                        <span className={styles.notePlaceholder}>Clic para agregar nota...</span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 && (
          <div className={styles.emptyState}>
            <FaFilter className="mx-auto mb-2 text-gray-300" size={24} />
            <p>No se encontraron comentarios.</p>
          </div>
        )}

        {/* CONTROLES DE PAGINACIÓN */}
        {filteredData.length > 0 && (
          <div className={styles.pagination}>
            <button 
              className={styles.pageBtn}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Anterior
            </button>
            
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages || 1}
            </span>
            
            <button 
              className={styles.pageBtn}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModerationPanel;