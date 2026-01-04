import { useState } from 'react';
import { DashboardStats } from '../components/transparency/DashboardStats';
import ModerationPanel from '../components/transparency/ModerationPanel';
import PageHeader from '../components/layout/PageHeader';
import { initialComments, type Comment, type CommentStatus } from '../data/commentsData';
import { FaUserShield, FaChartPie, FaListAlt } from 'react-icons/fa';
import styles from './Transparency.module.css';

const Transparency = () => {
  // --- ESTADOS ---
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation'>('dashboard');

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
        description="Consulta en tiempo real cómo estamos procesando los comentarios ciudadanos para garantizar que tu voz sea escuchada en el PMDU."
      />

      {/* --- BARRA DE HERRAMIENTAS --- */}
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
            <span className="flex items-center gap-2">
               <FaChartPie /> Dashboard Público
            </span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'moderation' ? styles.active : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            <span className="flex items-center gap-2">
              <FaListAlt /> Gestión de Comentarios
            </span>
          </button>
        </div>
      )}

      {/* --- CONTENIDO --- */}
      {activeTab === 'dashboard' ? (
        <DashboardStats comments={comments} />
      ) : (
        isAdmin && (
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