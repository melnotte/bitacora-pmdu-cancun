import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMapData } from '../hooks/useMapData';
import { useMapInteractions } from '../hooks/useMapInteractions';
import TableContent from '../components/maps/TableContent';
import { 
  FiLayers, FiChevronLeft, FiHome, FiChevronDown, FiLoader,
  FiChevronRight, FiX, FiList, FiMap, FiSearch, FiDownload, FiFileText, FiShare2, FiTrash2
} from 'react-icons/fi';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import styles from './Maps.module.css';
import type { MapLayer } from '../types';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
mapboxgl.accessToken = MAPBOX_TOKEN;

const Maps = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loadingSources, setLoadingSources] = useState<Record<string, boolean>>({});
  const { layerGroups, loading: loadingData } = useMapData();
  const { 
    setupLayerEvents, 
    handleSelectFeature,
    selectedFeatureId
  } = useMapInteractions(map, styles);
  const [activeLayers, setActiveLayers] = useState<string[]>(() => {
    const layersParam = searchParams.get('layers');
    return layersParam ? layersParam.split(',') : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [activeTableLayer, setActiveTableLayer] = useState<MapLayer | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentTableFeatures, setCurrentTableFeatures] = useState<any[]>([]);
  const initialSelectionDone = useRef(false);

  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;
    const handleError = (e: any) => {
      if (e.error && (e.sourceId || e.dataType === 'source')) {
        console.error('Error de Mapbox:', e.error);
        alert(`Error al cargar la capa. Verifique la conexión o el origen de los datos.`);
      }
    };

    currentMap.on('error', handleError);

    return () => {
      currentMap.off('error', handleError);
    };
  }, [map.current]);

  useEffect(() => {
    if (!loadingData && activeLayers.length > 0 && layerGroups.length > 0) {
      const groupsToExpand = layerGroups
        .filter(group => group.layers.some(layer => activeLayers.includes(layer.id)))
        .map(group => group.id);
      
      setExpandedGroups(prev => Array.from(new Set([...prev, ...groupsToExpand])));
    }
  }, [loadingData, layerGroups, activeLayers]);
  
  useEffect(() => {
    const featureId = searchParams.get('feature');
    const layerIdParam = searchParams.get('layer');

    if (!featureId || !layerIdParam || initialSelectionDone.current || !map.current || loadingData) return;

    const currentMap = map.current;

    const selectFeatureFromUrl = () => {
      initialSelectionDone.current = true;

      // Buscamos específicamente en la capa que viene por URL
      const features = currentMap.querySourceFeatures(layerIdParam);
      const target = features.find(f => String(f.id) === featureId);

      if (target) {
        const geometry = target.geometry as any;
        // Cálculo del centro para el popup
        const coords = geometry.type === 'Point' 
          ? geometry.coordinates 
          : (geometry.type === 'Polygon' ? geometry.coordinates[0][0] : geometry.coordinates[0][0]);

        const lngLat = new mapboxgl.LngLat(coords[0], coords[1]);
        const layerConfig = layerGroups.flatMap(g => g.layers).find(l => l.id === layerIdParam);

        if (layerConfig) {
          handleSelectFeature(target, layerConfig, lngLat, false);
        }
      }
    };

    if (currentMap.isStyleLoaded()) {
      selectFeatureFromUrl();
    } else {
      currentMap.once('idle', selectFeatureFromUrl);
    }
  }, [loadingData, activeLayers, layerGroups]);

  // 1. INICIALIZACIÓN DEL MAPA
  useEffect(() => {
    // Verificamos que el contenedor exista y que el mapa no esté creado
    if (!mapContainer.current || map.current) return;

    //Obtención de parámetros
    const latStr = searchParams.get('lat');
    const lngStr = searchParams.get('lng');
    const zoomStr = searchParams.get('zoom');

    // Valores por defecto
    const defaultLat = 21.1619;
    const defaultLng = -86.8475;
    const defaultZoom = 11.5;

    const lat = latStr ? parseFloat(latStr) : defaultLat;
    const lng = lngStr ? parseFloat(lngStr) : defaultLng;
    const zoom = zoomStr ? parseFloat(zoomStr) : defaultZoom;

    // Creación de la instancia
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: 0,
      cooperativeGestures: false,
      touchZoomRotate: true,
      trackResize: true
    });

    // Controles y eventos
    const currentMap = map.current;

    // Forzar redimensionamiento inmediato al cargar el estilo
    currentMap.on('style.load', () => {
      currentMap.resize();
    });

    // Geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN, 
      mapboxgl: mapboxgl as any,
      placeholder: 'Buscar dirección o lugar...',
      marker: { color: '#ef4444' } as any
    });
    currentMap.addControl(geocoder, 'top-right');
    currentMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Sincronizar movimiento con la URL
    currentMap.on('moveend', () => {
      const center = currentMap.getCenter();
      const currentZoom = currentMap.getZoom();
      
      setSearchParams(prev => {
        prev.set('lat', center.lat.toFixed(5)); //
        prev.set('lng', center.lng.toFixed(5));
        prev.set('zoom', currentZoom.toFixed(2));
        return prev;
      }, { replace: true });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // 2. SINCRONIZACIÓN DE CAPAS DESDE DB
  useEffect(() => {
    const currentMap = map.current;
    if (!currentMap || loadingData) return;

    layerGroups.forEach(group => {
    group.layers.forEach(layer => {
      const isVisible = activeLayers.includes(layer.id);

          if (isVisible) {
            if (!currentMap.getSource(layer.id)) {
            setLoadingSources(prev => ({ ...prev, [layer.id]: true }));

            currentMap.addSource(layer.id, {
              type: 'geojson',
              data: layer.source_url,
              promoteId: layer.uniqueIdField || 'id' 
            });

            // Listener para saber cuando terminó de cargar la fuente
            const onSourceData = (e: any) => {
              if (e.sourceId === layer.id && e.isSourceLoaded) {
                setLoadingSources(prev => ({ ...prev, [layer.id]: false }));
                currentMap.off('sourcedata', onSourceData);
              }
            };

            currentMap.on('sourcedata', onSourceData);

            // CAPA PRINCIPAL
            currentMap.addLayer({
              id: layer.id,
              type: layer.layer_type || 'fill', 
              source: layer.id,
              paint: layer.paint || (
                layer.layer_type === 'line' 
                  ? { 'line-color': '#3b82f6', 'line-width': 2 } 
                  : layer.layer_type === 'circle'
                    ? { 'circle-radius': 6, 'circle-color': '#3b82f6' }
                    : { 'fill-color': '#3b82f6', 'fill-opacity': 0.6 }
              )
            });

            // CAPA DE HIGHLIGHT
            currentMap.addLayer({
              id: `${layer.id}-highlight`,
              type: layer.layer_type === 'circle' ? 'circle' : 'line',
              source: layer.id,
              paint: layer.layer_type === 'circle' 
                ? {
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': layer.highlightColor || '#000',
                    'circle-color': 'rgba(0,0,0,0)',
                    'circle-opacity': ['case', ['boolean', ['feature-state', 'selected'], false], 1, 0]
                  }
                : {
                    'line-color': layer.highlightColor || '#000',
                    'line-width': [
                      'case',
                      ['boolean', ['feature-state', 'selected'], false], 3,
                      ['boolean', ['feature-state', 'hover'], false], 2,
                      0
                    ]
                  }
            });
            setupLayerEvents(layer);
          }
          
          currentMap.setLayoutProperty(layer.id, 'visibility', 'visible');
          currentMap.setLayoutProperty(`${layer.id}-highlight`, 'visibility', 'visible');
        } else {
          if (currentMap.getLayer(layer.id)) {
            currentMap.setLayoutProperty(layer.id, 'visibility', 'none');
            currentMap.setLayoutProperty(`${layer.id}-highlight`, 'visibility', 'none');
          }
        }
      });
    });
  }, [activeLayers, layerGroups, loadingData, setupLayerEvents]);

  // Filtro de búsqueda de sidebar
  const filteredGroups = useMemo(() => {
    return layerGroups.map(group => {
      const matched = group.layers.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
      if (matched.length > 0 || group.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return { ...group, layers: matched };
      }
      return null;
    }).filter(Boolean) as any[];
  }, [layerGroups, searchTerm]);

  const isMobileOrTablet = () => window.innerWidth <= 768;

  // Función para manejar la apertura de la tabla
  const handleOpenTable = (layer: MapLayer) => {
    setActiveTableLayer(layer);
    
    if (map.current) {
      map.current.moveLayer(layer.id);
      map.current.moveLayer(`${layer.id}-highlight`);
    }

    if (isMobileOrTablet()) {
      setIsSidebarOpen(false);
    }
  };

  const handleShareView = () => {
    if (!map.current) return;
    const url = new URL(window.location.href);

    // Zoom y Centro
    const center = map.current.getCenter();
    url.searchParams.set('lng', center.lng.toFixed(5));
    url.searchParams.set('lat', center.lat.toFixed(5));
    url.searchParams.set('zoom', map.current.getZoom().toFixed(2));

    // Capas activas
    if (activeLayers.length > 0) {
      url.searchParams.set('layers', activeLayers.join(','));
    } else {
      url.searchParams.delete('layers');
    }

    // Entidad seleccionada
      if (selectedFeatureId.current) {
      url.searchParams.set('feature', String(selectedFeatureId.current.id));
      url.searchParams.set('layer', selectedFeatureId.current.source);
    } else {
      url.searchParams.delete('feature');
      url.searchParams.delete('layer');
    }

    // Copiar al portapapeles
    navigator.clipboard.writeText(url.toString())
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
  };

  const handleDownloadCSV = () => {
    if (!activeTableLayer || !currentTableFeatures || currentTableFeatures.length === 0) {
      alert("Aún no hay datos cargados para descargar.");
      return;
    }
    // Lógica de filtrado
    const visibleFields = activeTableLayer.metadata?.visibleFields;
    const allPropertiesKeys = Object.keys(currentTableFeatures[0].properties || {});

    // Determinamos columnas a exportar de las definidas
    const columnsToExport = visibleFields && visibleFields.length > 0
      ? allPropertiesKeys.filter(key => visibleFields.includes(key))
      : allPropertiesKeys.filter(key => key !== 'mapbox_id');

    const csvRows = [];
    
    // Cabeceras filtradas
    csvRows.push(columnsToExport.join(','));

    // Filas filtradas 
    for (const feature of currentTableFeatures) {
      const values = columnsToExport.map(header => {
        const val = feature.properties[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    // Crear archivo y descargar
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${activeTableLayer.name.replace(/\s+/g, '_')}_datos.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTableFeatureClick = (feature: any) => {
    if (!map.current || !activeTableLayer) return;

    const coords = getFeatureCenter(feature);

    if (!coords || isNaN(coords[0]) || isNaN(coords[1])) {
    alert("Esta ubicación no tiene coordenadas geográficas válidas.");
    return;
  }
    const lngLat = new mapboxgl.LngLat(coords[0], coords[1]);
    handleSelectFeature(feature, activeTableLayer, lngLat);

    map.current.flyTo({
    center: lngLat,
    zoom: feature.geometry.type === 'Point' ? 17 : 15.5,
    essential: true,
    padding: { top: 50, bottom: window.innerWidth < 768 ? 350 : 450, left: 0, right: 0 }
  });
};

const getFeatureCenter = (feature: any): [number, number] | null => {
  const geom = feature.geometry;
  if (!geom) return null;

  switch (geom.type) {
    case 'Point':
      return geom.coordinates as [number, number];
    case 'LineString':
      return geom.coordinates[0] as [number, number];
    case 'Polygon':
      return geom.coordinates[0][0] as [number, number];
    case 'MultiPolygon':
      return geom.coordinates[0][0][0] as [number, number];
    case 'MultiLineString':
      return geom.coordinates[0][0] as [number, number];
    default:
      return null;
  }
};

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-lg font-bold flex items-center gap-2"><FiMap /> Visor Interactivo</h2>
          </div>
          <div className={styles.headerButtons}>
            <button onClick={handleShareView} className={`${styles.homeButton} ${isCopied ? styles.copiedBtn : ''}`}>
              <FiShare2 /> {isCopied ? '¡Copiado!' : 'Compartir'}
            </button>
            <button onClick={() => navigate('/')} className={styles.homeButton}><FiHome /> Volver</button>
          </div>
        </div>

        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input 
              className={styles.searchInput} 
              placeholder="Buscar capas..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          {activeLayers.length > 0 && (
            <button 
              className={styles.clearLayersBtn} 
              onClick={() => {
                setActiveLayers([]);
                setActiveTableLayer(null);
              }}
            >
              <FiTrash2 size={14} /> Limpiar capas ({activeLayers.length})
            </button>
          )}
        </div>

        <div className={styles.sidebarContent}>
          <p className={styles.sectionTitle}>Capas Disponibles</p>
          {filteredGroups.map(group => (
            <div key={group.id} className={styles.groupContainer}>
              <div className={styles.groupHeader} onClick={() => setExpandedGroups(p => p.includes(group.id) ? p.filter(x => x !== group.id) : [...p, group.id])}>
                <span className="font-semibold">{group.title}</span>
                {expandedGroups.includes(group.id) ? <FiChevronDown /> : <FiChevronRight />}
              </div>
              {expandedGroups.includes(group.id) && (
                <div className="pb-2">
                  {group.layers.map((layer: MapLayer) => (
                    <div key={layer.id} className={styles.layerItem}>
                      <div className={styles.layerRow}>
                        <label className={styles.layerLabel}>
                          <input type="checkbox" checked={activeLayers.includes(layer.id)} onChange={() => setActiveLayers(p => p.includes(layer.id) ? p.filter(x => x !== layer.id) : [...p, layer.id])} />
                          <span>{layer.name}</span>

                          {loadingSources[layer.id] && (
                            <FiLoader className={styles.spinnerIcon} />
                          )}
                        </label>
                        <div className={styles.layerActions}>
                          <button 
                            onClick={() => handleOpenTable(layer)}
                            className={styles.btnViewTable} 
                            title="Ver tabla de atributos"
                          >
                            <FiList size={14}/>
                          </button>
                          
                          {layer.pdf_url && (
                            <button 
                              onClick={() => {
                                if (layer.pdf_url) window.open(layer.pdf_url, '_blank');
                              }} 
                              className={styles.btnDownloadMini} 
                              title="Descargar mapa PDF"
                            >
                              <FiDownload size={14}/>
                            </button>
                          )}
                        </div>
                      </div>
                      {/* LEYENDA */}
                      {activeLayers.includes(layer.id) && layer.metadata?.legend && (
                        <div className={styles.legendContainer}>
                          {layer.metadata.legend.map((item: any, i: number) => (
                            <div key={i} className={styles.legendItem}>
                              <span className={styles.colorBox} style={{backgroundColor: item.color}}></span>
                              <span>{item.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BOTÓN DE ALTERNANCIA */}
        <div 
          className={styles.toggleTab} 
          onClick={() => {
            const nextState = !isSidebarOpen;
            setIsSidebarOpen(nextState);

            // Si abrimos sidebar, cerramos tabla (móvil y tablet)
            if (nextState && isMobileOrTablet()) {
              setActiveTableLayer(null);
            }
          }}
        >
          {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
        </div>
      </aside>

      {!isSidebarOpen && !activeTableLayer && (
        <button 
          className={styles.toggleTab} 
          onClick={() => {
            setIsSidebarOpen(true);
            if (isMobileOrTablet()) setActiveTableLayer(null);
          }}
        >
          <FiLayers size={20} />
        </button>
      )}

      <div ref={mapContainer} className={styles.mapContainer} />

      {/* PANEL DE TABLA INFERIOR */}
      {activeTableLayer && (
        <div className={`${styles.bottomPanel} ${isSidebarOpen ? styles.panelWithSidebar : styles.panelFullWidth}`}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}><FiList /> {activeTableLayer.name}</div>
            <div className={styles.panelActions}>
              {/* BOTÓN DOCUMENTO */}
              {activeTableLayer.document_url && (
                <button 
                  className={styles.docBtn} 
                  onClick={() => window.open(activeTableLayer.document_url!, '_blank')}
                  title="Ver documento oficial"
                >
                  <FiFileText /> Ver Documento
                </button>
              )}

              {/* BOTÓN CSV */}
              <button className={styles.downloadBtn} onClick={handleDownloadCSV}>
                <FiDownload size={16} /> Descargar CSV
              </button>

              {/* BOTÓN CERRAR */}
              <button 
                onClick={() => {
                  setActiveTableLayer(null);
                  if (isMobileOrTablet()) {
                    setIsSidebarOpen(true);
                  }
                }} 
                className={styles.closePanelBtn}
              >
                <FiX size={24}/>
              </button>
            </div>
          </div>
          
          <TableContent 
            layer={activeTableLayer}
            mapInstance={map.current}
            onDataLoaded={setCurrentTableFeatures}
            onFeatureClick={handleTableFeatureClick}
          />
        </div>
      )}
    </div>
  );
};

export default Maps;