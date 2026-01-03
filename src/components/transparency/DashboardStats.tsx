import styles from './DashboardStats.module.css';

export const DashboardStats = () => {
  // 1. Datos Mock de Estatus
  const statusStats = [
    { label: 'Recibido', value: 150, color: '#3B82F6' },
    { label: 'En Análisis', value: 80, color: '#F59E0B' },
    { label: 'Atendido / Integrado', value: 45, color: '#10B981' },
    { label: 'No Procedente', value: 15, color: '#EF4444' },
    { label: 'Duplicado', value: 10, color: '#6B7280' },
  ];

  // 2. Datos Mock por semana
  const weeklyStats = [
    { week: 'Sem 1', count: 12, height: '10%' },
    { week: 'Sem 2', count: 28, height: '25%' },
    { week: 'Sem 3', count: 45, height: '40%' },
    { week: 'Sem 4', count: 85, height: '75%' },
    { week: 'Sem 5', count: 120, height: '100%' },
  ];

  // 3. Datos Mock por tema
  const topicStats = [
    { topic: 'Movilidad', count: 120, pct: '40%' },
    { topic: 'Medio Ambiente', count: 90, pct: '30%' },
    { topic: 'Zonificación', count: 60, pct: '20%' },
    { topic: 'Espacio Público', count: 30, pct: '10%' },
  ];

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
        
        {/* SECCIÓN 2: EVOLUCIÓN POR SEMANA */}
        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>Participación por Semana</h4>
          <div className={styles.weeklyChart}>
            {weeklyStats.map((item, idx) => (
              <div key={idx} className={styles.weekColumn}>
                {/* Contenedor relativo para la barra */}
                <div 
                    className={styles.barVertical} 
                    style={{ height: item.height }}
                >
                    {/* El tooltip vive dentro de la barra */}
                    <span className={styles.barTooltip}>{item.count}</span>
                </div>
                <span className={styles.weekLabel}>{item.week}</span>
                </div>
            ))}
          </div>
          <p className="text-xs text-center text-gray-400 mt-4">
            Volumen de comentarios recibidos
          </p>
        </div>

        {/* SECCIÓN 3: TOTALES POR TEMA */}
        <div className={styles.chartSection}>
          <h4 className={styles.chartTitle}>Temas más comentados</h4>
          <div>
            {topicStats.map((item, idx) => (
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
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};