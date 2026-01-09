import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Consultation from './pages/Consultation';
import ProcessPage from './pages/Process';
import ParticipationPage from './pages/Participation';
import EventDetail from './pages/EventDetail';
import Transparency from './pages/Transparency';
import DocumentsPage from './pages/Documents';
import PageHeader from './components/layout/PageHeader';

// Placeholder
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '0 20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
    <PageHeader title={title} />
    <div style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
      <p>Contenido en construcción...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="consulta" element={<Consultation />} />
          <Route path="proceso" element={<ProcessPage />} />
          <Route path="participa" element={<ParticipationPage />} />
          <Route path="participa/:id" element={<EventDetail />} /> {/*RUTA DINÁMICA*/}
          <Route path="mapas" element={<PlaceholderPage title="Mapas y Geovisores" />} />
          <Route path="documentos" element={<DocumentsPage />} />
          <Route path="transparencia" element={<Transparency />} />
          <Route path="contacto" element={<PlaceholderPage title="Contacto" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;