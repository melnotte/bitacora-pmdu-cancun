import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DashboardStats } from '../components/transparency/DashboardStats';
import ModerationPanel from '../components/transparency/ModerationPanel';
import PageHeader from '../components/layout/PageHeader';
import { FaChartPie, FaListAlt } from 'react-icons/fa';
import styles from './Transparency.module.css';
import type { CommentRow, CommentStatus } from '../types';

const Transparency = () => {
  // --- ESTADOS ---
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'moderation'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Función para obtener el rol
    const getUserRole = async (user: any) => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(data?.role || 'citizen');
      } else {
        setUserRole('citizen');
      }
    };

    // Carga inicial
    supabase.auth.getUser().then(({ data: { user } }) => {
      getUserRole(user);
    });

    // Escuchar cambios de sesión (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUserRole(session.user);
      } else {
        setUserRole('citizen'); // Limpiar rol al cerrar sesión
        setActiveTab('dashboard'); // Forzar regreso al dashboard público
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Solo admin y moderator ven el panel de gestión
  const isStaff = userRole === 'admin' || userRole === 'moderator';

  // --- Fetch de comentarios ---
  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setComments(data as CommentRow[]);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // --- HANDLERS ---
  const handleUpdateComment = async (id: string, newStatus: CommentStatus, newNote: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ 
          status: newStatus, 
          internal_note: newNote
        })
        .eq('id', id);

      if (error) throw error;

      setComments(prev => prev.map(c => 
        c.id === id 
          ? { ...c, status: newStatus, internal_note: newNote } 
          : c
      ));
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      alert("Error al guardar los cambios.");
    }
  };

  return (
    <div className={styles.container}>
      
      <PageHeader 
        title="Transparencia del Proceso" 
        description="Monitor de participación ciudadana en tiempo real. Consulta las estadísticas globales." 
      />

      {/* --- Tabs sólo visibles para admin y moderador --- */}
      {isStaff && (
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
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Cargando datos de transparencia...
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' ? (
            <DashboardStats comments={comments} />
          ) : (
            isStaff && (
              <ModerationPanel 
                comments={comments} 
                onUpdateComment={handleUpdateComment} 
              />
            )
          )}
        </>
      )}
    </div>
  );
};

export default Transparency;