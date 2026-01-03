import Timeline from '../components/process/Timeline';
import NewsFeed from '../components/process/NewsFeed';
import PageHeader from '../components/layout/PageHeader';


const ProcessPage = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>

      <PageHeader 
        title="Proceso de Elaboración" 
        description="Conoce las etapas del Programa Municipal de Desarrollo Urbano de Cancún
          y mantente informado sobre los últimos avances y actividades." 
      />

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