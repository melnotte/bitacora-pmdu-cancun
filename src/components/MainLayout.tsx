import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import PhaseBanner from './layout/PhaseBanner';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    // Reemplaza styles por clases de Tailwind
    <div className="flex flex-col min-h-screen">
      <PhaseBanner />
      <Navbar />
      
      {/* Hace que el main ocupe todo el espacio disponible empujando al footer abajo */}
      <main className="flex-1"> 
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;