import Timeline from '../components/process/Timeline';
import NewsFeed from '../components/process/NewsFeed';

const ProcessPage = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '10px' }}>
          Proceso de Elaboración
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
          Conoce las etapas del Programa Municipal de Desarrollo Urbano de Cancún
          y mantente informado sobre los últimos avances y actividades.
        </p>
      </header>

      {/* Sección 1: Línea de Tiempo */}
      <section>
        <Timeline />
      </section>

      <hr style={{ margin: '50px 0', border: '0', borderTop: '1px solid #eee' }} />

      {/* Sección 2: Bitácora Actualizaciones*/}
      <section>
        <NewsFeed />
      </section>

    </div>
  );
};

export default ProcessPage;