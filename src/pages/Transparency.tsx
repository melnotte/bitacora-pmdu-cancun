import { DashboardStats } from '../components/transparency/DashboardStats';
import PageHeader from '../components/layout/PageHeader';

const Transparency = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-5 py-10">
      
      <PageHeader 
        title="Transparencia del Proceso"
        description="Consulta en tiempo real cómo estamos procesando los comentarios ciudadanos para garantizar que tu voz sea escuchada en el PMDU."
      />

      <DashboardStats />
    </div>
  );
};

export default Transparency;