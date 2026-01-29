import React, { useMemo, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { WeeklyPollWithDetails, CommentRow } from '../../types';
import styles from './DashboardStats.module.css';
import { 
  FaInbox, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaCopy 
} from 'react-icons/fa';

export const DashboardStats: React.FC = () => {

  const [poll, setPoll] = useState<WeeklyPollWithDetails | null>(null);
  const [dbComments, setDbComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);

  // --- LÓGICA DEL MES ---
  const { currentMonthName, currentYear } = useMemo(() => {
    const now = new Date();
    const month = new Intl.DateTimeFormat('es-MX', { month: 'long' }).format(now);
    return {
      currentMonthName: month.charAt(0).toUpperCase() + month.slice(1),
      currentYear: now.getFullYear()
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch de la encuesta semanal activa
        const pollPromise = supabase
          .from('weekly_polls')
          .select('*, poll_options(*)')
          .eq('is_active', true)
          .single();

        // Fetch de comentarios
        const commentsPromise = supabase
          .from('comments')
          .select('*');

        const [pollRes, commentsRes] = await Promise.all([pollPromise, commentsPromise]);

        if (pollRes.data) {
          const sortedOptions = [...pollRes.data.poll_options].sort((a, b) => {
            if (a.is_open_response) return 1;
            if (b.is_open_response) return -1;
            return (b.votes || 0) - (a.votes || 0);
          });
          setPoll({ ...pollRes.data, poll_options: sortedOptions } as WeeklyPollWithDetails);
        }

        if (commentsRes.data) {
          setDbComments(commentsRes.data as CommentRow[]);
        }

      } catch (err) {
        console.error("Error al sincronizar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // --- CÁLCULOS DINÁMICOS ---

  // Totales por Estatus
  const statsSummary = useMemo(() => {
    return [
      { 
        label: 'Recibido', 
        value: dbComments.filter(c => c.status === 'pending' || c.status === 'received').length, 
        icon: <FaInbox />, 
        styleClass: styles.blueBorder 
      },
      { 
        label: 'En Análisis', 
        value: dbComments.filter(c => c.status === 'analyzing').length, 
        icon: <FaClock />, 
        styleClass: styles.yellowBorder 
      },
      { 
        label: 'Integrado', 
        value: dbComments.filter(c => c.status === 'integrated').length, 
        icon: <FaCheckCircle />, 
        styleClass: styles.greenBorder 
      },
      { 
        label: 'No Procedente', 
        value: dbComments.filter(c => c.status === 'rejected' || c.status === 'not_applicable').length, 
        icon: <FaExclamationCircle />, 
        styleClass: styles.redBorder 
      },
      { 
        label: 'Duplicado', 
        value: dbComments.filter(c => c.status === 'duplicate').length, 
        icon: <FaCopy />, 
        styleClass: styles.grayBorder 
      },
    ];
  }, [dbComments]);

  // Top temas más comentados
  const topicStats = useMemo(() => {
    const topicMap: Record<string, number> = {};
    dbComments.forEach(c => {
      if (c.topic) topicMap[c.topic] = (topicMap[c.topic] || 0) + 1;
    });

    const total = dbComments.length || 1;
    
    return Object.entries(topicMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([topic, count]) => ({
        topic,
        count,
        pct: `${Math.round((count / total) * 100)}%`
      }));
  }, [dbComments]);

  // Actividad de las últimas 4 semanas
  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weeksData = [];

    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (i * 7 + 6));
      const endOfWeek = new Date(now);
      endOfWeek.setDate(now.getDate() - (i * 7));

      const count = dbComments.filter(c => {
        const cDate = new Date(c.created_at || '');
        return cDate >= startOfWeek && cDate <= endOfWeek;
      }).length;

      // Nombre del mes para el tooltip
      const monthName = new Intl.DateTimeFormat('es-MX', { month: 'short' }).format(endOfWeek);
      const dayRange = `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${monthName}`;

      weeksData.push({
        label: i === 0 ? 'Semana Actual' : `Hace ${i} sem.`,
        tooltip: `${count} comentarios (${dayRange})`,
        count,
        isCurrentMonth: endOfWeek.getMonth() === now.getMonth()
      });
    }

    const maxCount = Math.max(...weeksData.map(w => w.count)) || 1;

    return weeksData.map(w => ({
      ...w,
      height: w.count > 0 ? `${(w.count / maxCount) * 100}%` : '5%'
    }));
  }, [dbComments]);

  // Total de Votos de la Encuesta
  const totalVotes = useMemo(() => {
    if (!poll) return 0;
    return poll.poll_options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
  }, [poll]);

  if (loading) return <div className={styles.loading}>Cargando métricas en tiempo real...</div>;

  return (
    <div className={styles.container}>
      
      {/* SECCIÓN TOTALES POR ESTATUS */}
      <div className={styles.statsGrid}>
        {statsSummary.map((stat) => (
          <div key={stat.label} className={`${styles.statCard} ${stat.styleClass}`}>
            <div className={styles.statIcon}>{stat.icon}</div>            
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.chartsContainer}>
        
        {/* SECCIÓN EVOLUCIÓN POR SEMANA */}
        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>Participación Ciudadana: {currentMonthName} {currentYear}</h4>
          <div className={styles.weeklyChart}>
            {weeklyStats.map((item, idx) => (
              <div key={idx} className={styles.weekColumn}>
                <div 
                  className={styles.barVertical} 
                  style={{ 
                    height: item.height,
                    opacity: item.isCurrentMonth ? 1 : 0.6 
                  }}
                >
                  {/* Tooltip muestra fechas y mes */}
                  <span className={styles.barTooltip}>{item.tooltip}</span>
                </div>
                <span className={styles.weekLabel}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Comentario del footer */}
          <p className={styles.chartFooterText}>
            Comentarios recibidos durante las últimas 4 semanas
          </p>
        </div>

        {/* SECCIÓN TOTALES POR TEMA */}
        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>Temas Recurrentes</h4>
          <div>
            {topicStats.length > 0 ? topicStats.map((item, idx) => (
              <div key={idx} className={styles.topicRow}>
                <div className={styles.topicHeader}>
                  <span>{item.topic}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className={styles.progressContainer}>
                  <div 
                    className={styles.progressBar} 
                    style={{ 
                      width: item.pct, 
                      backgroundColor: '#4B5563'
                    }} 
                  ></div>
                </div>
              </div>
            )) : <p className="text-gray-400 text-center">No hay datos aún.</p>}
          </div>
        </div>

        {/* SECCIÓN ENCUESTA SEMANAL */}
        <div className={`${styles.chartSection} ${styles.fullWidthChart}`}>
            <h4 className={styles.chartTitle}>Resultados: Pregunta de la Semana</h4>
            
            {!poll ? (
              <p className="text-sm text-gray-400 text-center py-4">No hay encuesta activa</p>
            ) : (
                <>
                    <p className={styles.pollQuestion}>{poll.question}</p>

                    <div className={styles.pollResultsList}>
                        {poll.poll_options.map(opt => {
                            const votes = opt.votes || 0;
                            const pct = totalVotes > 0 
                                ? Math.round((votes / totalVotes) * 100) 
                                : 0;
                            
                            return (
                                <div key={opt.id} className={styles.pollOptionWrapper}>
                                    {/* Texto e info */}
                                    <div className={styles.pollOptionHeader}>
                                        <span className={styles.pollOptionLabel}>{opt.label}</span>
                                        <span className={styles.pollOptionValue}>{pct}% ({votes})</span>
                                    </div>
                                    
                                    {/* Barra de Progreso */}
                                    <div className={styles.pollBarBackground}>
                                        <div 
                                          className={styles.pollBarFill} 
                                          style={{ width: `${pct}%` }} 
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <p className={styles.pollTotal}>
                        Total de votos: {totalVotes}
                    </p>
                </>
            )}
        </div>

      </div>
    </div>
  );
};