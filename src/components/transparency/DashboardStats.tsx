import React, { useMemo } from 'react';
import { type Comment } from '../../data/commentsData';
import styles from './DashboardStats.module.css';

interface DashboardStatsProps {
  comments?: Comment[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ comments = [] }) => {
  
  // --- CÁLCULOS DINÁMICOS ---
  
  // 1. Totales por Estatus
  const statusStats = useMemo(() => {
    const counts = {
      'Recibido': 0,
      'En análisis': 0,
      'Atendido/Integrado': 0,
      'No procedente': 0,
      'Duplicado': 0
    };

    comments.forEach(c => {
      if (counts[c.status] !== undefined) {
        counts[c.status]++;
      }
    });

    return [
      { label: 'Recibido', value: counts['Recibido'], color: '#3B82F6' },
      { label: 'En Análisis', value: counts['En análisis'], color: '#F59E0B' },
      { label: 'Integrado', value: counts['Atendido/Integrado'], color: '#10B981' },
      { label: 'No Procedente', value: counts['No procedente'], color: '#EF4444' },
      { label: 'Duplicado', value: counts['Duplicado'], color: '#6B7280' },
    ];
  }, [comments]);

  // 2. Temas más comentados (Top 4)
  const topicStats = useMemo(() => {
    const topicMap: Record<string, number> = {};
    comments.forEach(c => {
      topicMap[c.topic] = (topicMap[c.topic] || 0) + 1;
    });

    const total = comments.length || 1;
    
    return Object.entries(topicMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([topic, count]) => ({
        topic,
        count,
        pct: `${Math.round((count / total) * 100)}%`
      }));
  }, [comments]);

  // 3. Simulación de "Por Semana" (Agrupado por fecha simple para demo)
  // En un caso real usaríamos librerías de fecha (date-fns) para agrupar por semana real.
  const weeklyStats = useMemo(() => {
    // Dummy estático si hay pocos datos, o lógica simple 
    if (comments.length === 0) return [];
    
    // Solo para efectos visuales, mostramos 5 barras fijas o calculadas
    // Aquí dejaremos un mock visual basado en el total para no complicar la demo
    return [
        { week: 'Sem 1', count: Math.floor(comments.length * 0.1), height: '10%' },
        { week: 'Sem 2', count: Math.floor(comments.length * 0.2), height: '30%' },
        { week: 'Sem 3', count: Math.floor(comments.length * 0.4), height: '50%' },
        { week: 'Sem 4', count: Math.floor(comments.length * 0.15), height: '20%' },
        { week: 'Actual', count: Math.floor(comments.length * 0.15), height: '20%' },
    ];
  }, [comments.length]);


  return (
    <div className={styles.container}>
      
      {/* SECCIÓN 1: TOTALES POR ESTATUS */}
      <div className={styles.statsGrid}>
        {statusStats.map((stat) => (
          <div 
            key={stat.label} 
            className={styles.statCard} 
            style={{ borderLeftColor: stat.color }}
          >
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.chartsContainer}>
        
        {/* SECCIÓN 2: EVOLUCIÓN POR SEMANA (Simulada) */}
        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>Actividad Reciente</h4>
          <div className={styles.weeklyChart}>
            {weeklyStats.map((item,nV) => (
              <div key={nV} className={styles.weekColumn}>
                <div 
                    className={styles.barVertical} 
                    style={{ height: item.height || '10%' }}
                >
                    <span className={styles.barTooltip}>{item.count}</span>
                </div>
                <span className={styles.weekLabel}>{item.week}</span>
                </div>
            ))}
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">
            Comentarios recibidos por semana
          </p>
        </div>

        {/* SECCIÓN 3: TOTALES POR TEMA */}
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

      </div>
    </div>
  );
};