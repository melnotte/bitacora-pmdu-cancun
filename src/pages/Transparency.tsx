import { useState, useEffect } from 'react';
import { DashboardStats } from '../components/transparency/DashboardStats';
import ModerationPanel from '../components/transparency/ModerationPanel';
import PageHeader from '../components/layout/PageHeader';
import { initialComments, type Comment, type CommentStatus } from '../data/commentsData';
import { FaUserShield, FaChartPie, FaListAlt } from 'react-icons/fa';
import styles from './Transparency.module.css';

const Transparency = () => {
  // --- ESTADOS ---
  // Inicializamos con los datos dummy
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation'>('dashboard');

  // --- EFECTO PARA CARGAR DATOS DEL FORMULARIO ---
  useEffect(() => {
    // 1. Intentar leer del LocalStorage
    const storedData = localStorage.getItem('pmdu_demo_comments');
    
    if (storedData) {
      try {
        const userComments: Comment[] = JSON.parse(storedData);
        
        // 2. Actualizar el estado combinando los nuevos con los existentes
        setComments(prevDocs => {
          // Creamos un Set de IDs existentes para evitar duplicados visuales
          const existingIds = new Set(prevDocs.map(c => c.id));
          
          // Filtramos solo los que no estén en la lista
          const newUnique = userComments.filter(c => !existingIds.has(c.id));
          
          // Retornamos datos dummy
          return [...newUnique, ...prevDocs];
        });

      } catch (error) {
        console.error("Error al cargar comentarios locales:", error);
      }
    }
  }, []);

  // --- HANDLERS ---
  const handleUpdateComment = (id: string, newStatus: CommentStatus, newNote: string) => {
    setComments(prev => prev.map(c => 
      c.id === id 
        ? { ...c, status: newStatus, internalNote: newNote } 
        : c
    ));
  };

  const handleToggleAdmin = () => {
    const newState = !isAdmin;
    setIsAdmin(newState);
    // Si desactivamos admin, forzamos volver al dashboard público
    if (!newState) setActiveTab('dashboard');
  };

  return (
    <div className={styles.container}>
      
      <PageHeader 
        title="Transparencia del Proceso" 
        description="Monitor de participación ciudadana en tiempo real. Consulta las estadísticas globales o accede al panel de moderación." 
      />

      {/* --- BARRA DE ACCIONES (Simulación Admin) --- */}
      <div className={styles.adminBar}>
        <button 
          onClick={handleToggleAdmin}
          className={`${styles.adminToggleBtn} ${isAdmin ? styles.adminActive : styles.adminInactive}`}
        >
          <FaUserShield /> {isAdmin ? 'Modo Admin: ACTIVO' : 'Simular Acceso Admin'}
        </button>
      </div>

      {/* --- VISTA DE DASHBOARD Y GESTIÓN DE COMENTARIOS --- */}
      {isAdmin && (
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <FaChartPie /> Dashboard Público
            </span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'moderation' ? styles.active : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaListAlt /> Gestión de Comentarios
            </span>
          </button>
        </div>
      )}

      {/* --- CONTENIDO --- */}
      {activeTab === 'dashboard' ? (
        // El Dashboard ahora recibirá 'comments' que incluye los nuevos datos
        <DashboardStats comments={comments} />
      ) : (
        isAdmin && (
          // En el Panel de Moderación también se verán los nuevos datos
          <ModerationPanel 
            comments={comments} 
            onUpdateComment={handleUpdateComment} 
          />
        )
      )}

    </div>
  );
};

export default Transparency;