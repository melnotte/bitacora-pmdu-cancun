import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import DocumentCard from '../components/documents/DocumentCard';
import { documents } from '../data/documentsData';
import { phases } from '../data/processData';
import type { DocType } from '../data/documentsData';

import styles from './Documents.module.css';
import { FaFilter, FaBroom } from 'react-icons/fa';

const ITEMS_PER_PAGE = 4;

const DocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Leemos la etapa de la URL o usamos 'Todas' por defecto
  const initialTab = searchParams.get('etapa') || 'Todas';

  // 1. Estados
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedTypes, setSelectedTypes] = useState<DocType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Sincronizar estado si la URL cambia
  useEffect(() => {
    const currentEtapa = searchParams.get('etapa') || 'Todas';
    setActiveTab(currentEtapa);
  }, [searchParams]);

  // Generamos los Tabs dinámicamente basados en el Timeline
  const processTabs = phases.map(p => p.title.replace(/^\d+\.\s*/, ''));
  const tabs = ['Todas', ...processTabs];
  
  const allTypes: DocType[] = ['Programa', 'Anexo', 'Mapa', 'Acta', 'Convocatoria', 'Dictamen'];

  // --- HANDLERS ---
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchParams({ etapa: tab });
  };

  const toggleType = (type: DocType) => {
    setCurrentPage(1);
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO ---
  const filteredDocs = useMemo(() => {
    const filtered = documents.filter(doc => {
      // 1. Filtro por Sección (Tab)
      if (activeTab !== 'Todas' && doc.phase !== activeTab) return false;

      // 2. Filtro por Tipo (Sidebar)
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(doc.type);
      return matchType;
    });

    return filtered.sort((a, b) => a.date < b.date ? 1 : (a.date > b.date ? -1 : 0));
    
  }, [activeTab, selectedTypes]);

  // --- PAGINACIÓN ---
  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={styles.container}>
      <PageHeader 
        title="Catálogo de Documentos" 
        description="Consulta y descarga toda la información técnica, legal y cartográfica generada durante el proceso del PMDU." 
      />

      {/* TABS DE SECCIONES (Dinámicos desde processData) */}
      <div className={styles.tabsContainer}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.filters}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
             <FaFilter /> <h3>Filtros</h3>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterTitle}>Por Tipo de Documento</span>
            {allTypes.map(type => (
              <label key={type} className={styles.filterOption}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                {type}
              </label>
            ))}
          </div>

          {selectedTypes.length > 0 && (
            <button 
              className={styles.clearBtn}
              onClick={() => setSelectedTypes([])}
            >
              <FaBroom /> Limpiar filtros
            </button>
          )}
        </aside>

        {/* RESULTADOS */}
        <main>
          {filteredDocs.length > 0 ? (
            <>
              <div style={{ marginBottom: '20px', color: '#666', fontSize: '0.9rem' }}>
                Mostrando {filteredDocs.length} documentos en la etapa <strong>{activeTab}</strong>
              </div>

              <div className={styles.grid}>
                {paginatedDocs.map(doc => (
                  <DocumentCard key={doc.id} doc={doc} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    className={styles.pageBtn} 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Anterior
                  </button>
                  
                  <span className={styles.pageInfo}>
                    Página {currentPage} de {totalPages}
                  </span>

                  <button 
                    className={styles.pageBtn} 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#666', background: '#f9f9f9', borderRadius: '8px' }}>
              <p>No hay documentos públicos disponibles para la etapa de <strong>{activeTab}</strong>.</p>
              <button 
                onClick={() => setSelectedTypes([])}
                style={{ marginTop: '15px', padding: '8px 16px', cursor: 'pointer', color: '#005eb8', background: 'none', border: '1px solid #005eb8', borderRadius: '4px' }}
              >
                Ver todos los de esta etapa
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;