import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Instrument, RelatedLink } from '../types';
import Timeline from '../components/process/Timeline';
import NewsFeed from '../components/process/NewsFeed';
import PageHeader from '../components/layout/PageHeader';
import { CurrentVersionCard } from '../components/process/CurrentVersionCard';

const ProcessPage = () => {

  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const { data, error } = await supabase
          .from('official_instruments')
          .select(`
            *,
            phase:process_phases (
              title,
              status
            )
          `)
          .eq('is_active', true)
          .single();

        if (error) {
           if (error.code !== 'PGRST116') console.error(error); 
        } else {
          setInstrument(data as unknown as Instrument);
        }
      } catch (err) {
        console.error('Error fetching instrument:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstrument();
  }, []);

  // Función helper para transformar el JSONB a nuestro tipo RelatedLink[]
  const getRelatedDocs = (jsonLinks: any): RelatedLink[] => {
    if (Array.isArray(jsonLinks)) {
      return jsonLinks as RelatedLink[];
    }
    return [];
  };


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
          {loading ? (
             <p style={{textAlign: 'center'}}>Cargando...</p>
          ) : instrument ? (
             <CurrentVersionCard 
                version={instrument.version || "N/A"}
                date={instrument.publish_date || "Sin fecha"}
                status={instrument.status}
                stage={instrument.phase?.title || 'Etapa Desconocida'}
                responsible={instrument.responsible || "IMPLAN"}
                summaryChanges={instrument.summary_changes || "Sin cambios registrados."}
                downloadUrl={instrument.final_document_url || "#"}
                relatedDocs={getRelatedDocs(instrument.related_links)}
             />
          ) : (
             <div style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
                <p>No hay un instrumento oficial activo en este momento.</p>
             </div>
          )}
      </div>

      {/* SECCIÓN LÍNEA DE TIEMPO */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        
        <section style={{ marginBottom: '5rem' }}>
          <Timeline />
        </section>
      </div>

      {/* SECCIÓN BITÁCORA DE ACTUALIZACIONES */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px', marginBottom: '5rem' }}>
         <NewsFeed />
      </div>
    </div>
  );
};

export default ProcessPage;