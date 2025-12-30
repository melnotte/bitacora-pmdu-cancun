import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import PhaseBanner from './layout/PhaseBanner';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PhaseBanner />
      <Navbar />
      {/* Outlet renderiza la página hija seleccionada por el Router */}
      <main style={{ flex: 1 }}> 
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;