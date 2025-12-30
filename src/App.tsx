import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ProcessPage from './pages/Process';
import ParticipationPage from './pages/Participation';
import EventDetail from './pages/EventDetail';

// Placeholder
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h1>{title}</h1>
    <p>Contenido en construcción...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PlaceholderPage title="Inicio - PMDU" />} />
          <Route path="proceso" element={<ProcessPage />} />
          <Route path="participa" element={<ParticipationPage />} />
          <Route path="participa/:id" element={<EventDetail />} /> {/*RUTA DINÁMICA*/}
          <Route path="mapas" element={<PlaceholderPage title="Mapas y Geovisores" />} />
          <Route path="documentos" element={<PlaceholderPage title="Documentación" />} />
          <Route path="transparencia" element={<PlaceholderPage title="Transparencia" />} />
          <Route path="contacto" element={<PlaceholderPage title="Contacto" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;