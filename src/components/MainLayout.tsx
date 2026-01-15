import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import PhaseBanner from './layout/PhaseBanner';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout = () => {
  const location = useLocation();
  const isMapPage = location.pathname.includes('/mapas');

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-none relative z-50">
         <PhaseBanner />
         <Navbar />
      </div>
      
      {/* Relative para que el mapa absolute se ancle a este bloque y no a la pantalla completa. */}
      <main className={`flex-1 relative w-full ${isMapPage ? 'overflow-hidden' : 'overflow-auto'}`}> 
        <Outlet />
        
        {!isMapPage && (
            <Footer />
        )}
      </main>
    </div>
  );
};

export default MainLayout;