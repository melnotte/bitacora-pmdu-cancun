import Timeline from '../components/process/Timeline';
import NewsFeed from '../components/process/NewsFeed';
import PageHeader from '../components/layout/PageHeader';
import { CurrentVersionCard } from '../components/process/CurrentVersionCard';

const currentDocData = {
  version: "2.1 - Borrador Técnico",
  date: "12 Enero 2024",
  stage: "Consulta Pública",
  responsible: "Dirección de Planeación (IMPLAN)",
  summaryChanges: "Se actualizaron las tablas de uso de suelo del Polígono Sur e incorporaron las observaciones de los talleres vecinales realizados en Noviembre 2023.",
  downloadUrl: "/documentos/pmdu-borrador-v2.1.pdf",
  relatedDocs: [
    { title: "Versión Anterior (v1.0)", url: "/documentos" },
    { title: "Anexos Técnicos", url: "/documentos" }
  ]
};

const ProcessPage = () => {
  return (
    <div style={{ paddingBottom: '40px' }}>

      {/* HEADER */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <PageHeader 
          title="Proceso de Elaboración" 
          description="Conoce las etapas del Programa Municipal de Desarrollo Urbano de Cancún
            y mantente informado sobre los últimos avances y actividades." 
        />
      </div>

      {/* SECCIÓN DOCUMENTO */}
      <div style={{ width: '100%', marginBottom: '4rem', marginTop: '2rem' }}>
          <CurrentVersionCard {...currentDocData} />
      </div>

      {/* SECCIÓN LÍNEA DE TIEMPO */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        <section style={{ marginBottom: '5rem' }}>
          <Timeline />
        </section>

        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#1e293b' }}>
            Bitácora de Actividades
          </h2>
          <NewsFeed />
        </section>
      </div>
    </div>
  );
};

export default ProcessPage;