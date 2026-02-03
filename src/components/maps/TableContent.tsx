import { useState, useEffect } from 'react';
import type { Map } from 'mapbox-gl';
import type { MapLayer } from '../../types';
import styles from '../../pages/Maps.module.css';

const TableContent = ({ 
  layer, 
  onDataLoaded,
  mapInstance,
  onFeatureClick
}: { 
  layer: MapLayer, 
  onDataLoaded: (data: any[]) => void,
  mapInstance: Map | null,
  onFeatureClick: (feature: any) => void 
}) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!layer) return;

    setData([]);
    onDataLoaded([]);
    setLoading(true);

    let isMounted = true;

    const loadData = async () => {
      try {
        if (mapInstance) {
          const source = mapInstance.getSource(layer.id) as any;
          if (source && source._data && source._data.features) {
            const feat = source._data.features;
            if (feat.length > 0) {
              if (isMounted) {
                setData(feat);
                onDataLoaded(feat);
                setLoading(false);
                return;
              }
            }
          }
        }

        const response = await fetch(layer.source_url);
        const json = await response.json();
        const features = json.features || [];

        if (isMounted) {
          setData(features);
          onDataLoaded(features);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error cargando tabla:", error);
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [layer.id, mapInstance]);

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Cargando datos de {layer.name}...</div>;
  }

  if (data.length === 0) {
    return <div className="p-12 text-center text-slate-400">No se encontraron datos.</div>;
  }

  // LÓGICA DE FILTRADO DE COLUMNAS 
  const visibleFields = layer.metadata?.visibleFields;
  const allKeys = data[0]?.properties ? Object.keys(data[0].properties) : [];
  
  // Determinamos qué campos mostrar de la tabla
  const displayKeys = visibleFields && visibleFields.length > 0
    ? allKeys.filter(k => visibleFields.includes(k))
    : allKeys.filter(k => k !== 'mapbox_id');

  return (
    <div className={styles.tableContainer}>
      <table className={styles.fullTable}>
        <thead>
          <tr>
            {displayKeys.map(key => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 500).map((f, i) => (
            <tr 
              key={`${layer.id}-row-${i}`} 
              onClick={() => onFeatureClick(f)} 
              style={{ cursor: 'pointer' }}
            >
              {displayKeys.map((key, j) => (
                <td key={`${i}-${j}`}>
                  {String(f.properties[key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableContent;