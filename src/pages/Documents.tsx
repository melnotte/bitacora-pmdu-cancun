import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { UIDocument, PhaseSimple } from '../types';
import PageHeader from '../components/layout/PageHeader';
import DocumentCard from '../components/documents/DocumentCard';
import styles from './Documents.module.css';
import { FaFilter, FaBroom } from 'react-icons/fa';

const ITEMS_PER_PAGE = 4;

const DocumentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('etapa') || 'Todas';

  // --- ESTADOS ---
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [loading, setLoading] = useState(true);
  
  // Tipos importados
  const [documents, setDocuments] = useState<UIDocument[]>([]);
  const [phases, setPhases] = useState<PhaseSimple[]>([]);
  const [docTypesList, setDocTypesList] = useState<string[]>([]);
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Resuelve la URL del documento
  const resolveDocUrl = (path: string) => {
    if (!path) return '#';
    
    // 1. Si ya es una URL completa (http...) o local (/...), la dejamos igual
    if (path.startsWith('http') || path.startsWith('/')) {
      return path;
    }

    // 2. Si no tiene prefijo, asumimos que es un archivo en el bucket 'documents'
    // Esto permite guardar en BD solo: "acta-sesion-1.pdf"
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);
      
    return data.publicUrl;
  };

  // --- CARGAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Cargar Fases
        const { data: phasesData } = await supabase
          .from('process_phases')
          .select('id, title, order_index')
          .order('order_index');

        // 2. Cargar Tipos de Documento
        const { data: typesData } = await supabase
          .from('document_types')
          .select('name');

        // 3. Cargar Documentos con Joins
        const { data: docsData, error } = await supabase
          .from('documents')
          .select(`
            *,
            document_types ( name ),
            process_phases ( title )
          `)
          .order('publication_date', { ascending: false });

        if (error) throw error;

        // --- MAPEO DE DATOS ---
        
        if (phasesData) {
          setPhases(phasesData as PhaseSimple[]);
        }

        if (typesData) {
          setDocTypesList(typesData.map(t => t.name));
        }

        if (docsData) {
          // Transformamos la respuesta cruda de la BD a nuestra interfaz de UI (UIDocument)
          const mappedDocs: UIDocument[] = docsData.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description,
            url: resolveDocUrl(d.url),
            size: d.size,
            date: d.publication_date,
            tags: d.tags,
            type: d.document_types?.name || 'Otro',
            phase: d.process_phases?.title || 'General',
            version: d.version || null
          }));
          setDocuments(mappedDocs);
        }

      } catch (err) {
        console.error('Error cargando catálogo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sincronizar estado si la URL cambia
  useEffect(() => {
    const currentEtapa = searchParams.get('etapa') || 'Todas';
    setActiveTab(currentEtapa);
  }, [searchParams]);

  // --- HANDLERS ---
  const handleTabChange = (tabTitle: string) => {
    setActiveTab(tabTitle);
    setCurrentPage(1);
    setSearchParams({ etapa: tabTitle });
  };

  const toggleType = (type: string) => {
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

  const tabs = ['Todas', ...phases.map(p => p.title)];

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Cargando catálogo...</div>;

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
            {tab.replace(/^\d+\.\s*/, '')}
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
            <span className={styles.filterTitle}>Por Tipo</span>
            {docTypesList.length > 0 ? docTypesList.map(type => (
              <label key={type} className={styles.filterOption}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={selectedTypes.includes(type)}
                  onChange={() => toggleType(type)}
                />
                {type}
              </label>
            )) : <p>Cargando tipos...</p>}
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
                Mostrando {filteredDocs.length} documentos en <strong>{activeTab.replace(/^\d+\.\s*/, '')}</strong>
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
              <p>No hay documentos disponibles para la etapa de <strong>{activeTab}</strong> con los filtros seleccionados.</p>
              {(selectedTypes.length > 0 || activeTab !== 'Todas') && (
                <button 
                  onClick={() => { setSelectedTypes([]); handleTabChange('Todas'); }}
                  style={{ marginTop: '15px', color: '#005eb8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Ver todos los documentos
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DocumentsPage;