import { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiLayers, FiChevronLeft, FiHome, FiChevronDown, 
  FiChevronRight, FiX, FiList, FiMap, FiDownload, FiFileText, 
  FiSearch, FiTrash2, FiShare2
} from 'react-icons/fi';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import styles from './Maps.module.css';

// DATOS JSON
import cambioPoblacionalData from '../data/cambio-poblacional.json';
import indiceMarginacionData from '../data/indice-marginacion.json';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

// TIPOS
interface LegendItem {
  color: string;
  label: string;
}

interface LayerConfig {
  id: string;
  name: string;
  type: 'fill' | 'line' | 'circle';
  data: any;
  uniqueIdField: string;
  documentUrl?: string;
  highlightColor: string;
  paint: any;
  legend?: LegendItem[];
}

interface LayerGroup {
  id: string;
  title: string;
  layers: LayerConfig[];
}

// --- CONFIGURACIÓN DE CAPAS ---
const LAYER_GROUPS: LayerGroup[] = [
  {
    id: 'zonificacion-primaria',
    title: 'Zonificación Primaria',
    layers: [
      {
        id: 'layer-poblacion',
        name: 'Cambio Poblacional (2010-2020)',
        type: 'fill',
        data: cambioPoblacionalData,
        uniqueIdField: 'CVE_AGEB',
        documentUrl: '/documentos?id=doc-001',
        highlightColor: '#ffeb3b',
        paint: {
          'fill-color': [
            'interpolate', ['linear'], ['get', 'p100_dife_pob'],
            0, '#f7fbff', 50, '#6baed6', 100, '#08306b'
          ],
          'fill-opacity': 0.7,
        },
        legend: [
          { color: '#d4e2f0', label: '0% Cambio' },
          { color: '#6baed6', label: '50% Aumento' },
          { color: '#08306b', label: '100% Aumento' }
        ]
      }
    ]
  },
  {
    id: 'zonificacion-secundaria',
    title: 'Zonificación Secundaria',
    layers: []
  },
  {
    id: 'restricciones',
    title: 'Restricciones',
    layers: [
      {
        id: 'layer-marginacion',
        name: 'Índice de Marginación',
        type: 'fill',
        data: indiceMarginacionData,
        uniqueIdField: 'CVEGEO',
        documentUrl: '/documentos?id=doc-011',
        highlightColor: '#00bcd4',
        paint: {
          'fill-color': [
            'match', ['get', 'GM_2020'],
            'Muy alto', '#d73027', 'Alto', '#fc8d59', 'Medio', '#fee08b',
            'Bajo', '#d9ef8b', 'Muy bajo', '#91cf60', '#ccc'
          ],
          'fill-opacity': 0.7,
        },
        legend: [
          { color: '#d73027', label: 'Muy Alto' },
          { color: '#fee08b', label: 'Medio' },
          { color: '#91cf60', label: 'Muy Bajo' }
        ]
      }
    ]
  },
  {
    id: 'estrategia',
    title: 'Estrategia Vial / Movilidad',
    layers: [] 
  }
];

const getFeatureCenter = (feature: any) => {
  if (feature.geometry.type === 'Point') return feature.geometry.coordinates;
  const coords = feature.geometry.type === 'Polygon' 
    ? feature.geometry.coordinates[0] 
    : feature.geometry.coordinates[0][0];
  let lngSum = 0, latSum = 0;
  coords.forEach((c: number[]) => { lngSum += c[0]; latSum += c[1]; });
  return [lngSum / coords.length, latSum / coords.length] as [number, number];
};

// FUNCIÓN HELPER PARA GENERAR EL HTML DEL POPUP
const generateTooltipHTML = (feature: any, layerConfig: LayerConfig, styles: any) => {
  let tableRows = '';
  if (feature.properties) {
      Object.entries(feature.properties).forEach(([key, value]) => {
          if (key !== 'mapbox_id' && typeof value !== 'object') {
              tableRows += `
                <tr>
                    <th>${key}</th>
                    <td>${value}</td>
                </tr>
              `;
          }
      });
  }

  return `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div class="${styles.popupHeader}">
        <div style="background:${layerConfig?.highlightColor || '#ccc'}; height:4px; width:100%; border-radius: 4px 4px 0 0;"></div>
        <div style="padding: 10px 12px; padding-right: 30px;">
            <strong style="color:#1e293b; display:block; font-size: 12px; line-height: 1.2;">
                ${layerConfig.name}
            </strong>
        </div>
      </div>
      <div class="${styles.popupBody}">
        <table class="${styles.popupTable}">
            <tbody>
                ${tableRows}
            </tbody>
        </table>
      </div>
    </div>
  `;
};

const Maps = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hoveredFeatureId = useRef<{ id: string | number; source: string } | null>(null);
  const selectedFeatureId = useRef<{ id: string | number; source: string } | null>(null);
  const isSwitchingSelection = useRef(false);


  // Estados UI
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeLayers, setActiveLayers] = useState<string[]>(() => {
    const layersParam = searchParams.get('layers');
    return layersParam ? layersParam.split(',') : ['layer-poblacion'];
  });
  const [isCopied, setIsCopied] = useState(false);  const [expandedGroups, setExpandedGroups] = useState<string[]>(['zonificacion-primaria']);
  const [activeTableLayer, setActiveTableLayer] = useState<LayerConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // LÓGICA DE FILTRADO DE CAPAS
  const filteredGroups = useMemo(() => {  
    if (!searchTerm) return LAYER_GROUPS;

    const lowerTerm = searchTerm.toLowerCase();

    return LAYER_GROUPS.map(group => {
      // Filtramos las capas dentro del grupo
      const matchingLayers = group.layers.filter(layer => 
        layer.name.toLowerCase().includes(lowerTerm)
      );

      // Si el grupo tiene capas que coinciden, lo devolvemos con esas capas
      if (matchingLayers.length > 0) {
        return { ...group, layers: matchingLayers };
      }
      return null;
    }).filter(Boolean) as LayerGroup[];
  }, [searchTerm]);
  
  // FUNCIÓN ACTUALIZAR URL
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(searchParamsRef.current);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) currentParams.delete(key);
      else currentParams.set(key, value);
    });
    setSearchParams(currentParams, { replace: true });
  };

  // FUNCIÓN DE BOTÓN COMPARTIR
  const handleShareView = () => {
    if (!map.current) return;

    const url = new URL(window.location.href);

    // 1. Zoom y Centro
    const center = map.current.getCenter();
    url.searchParams.set('lng', center.lng.toFixed(5));
    url.searchParams.set('lat', center.lat.toFixed(5));
    url.searchParams.set('zoom', map.current.getZoom().toFixed(2));

    // 2. Capas
    if (activeLayers.length > 0) {
      url.searchParams.set('layers', activeLayers.join(','));
    } else {
      url.searchParams.delete('layers');
    }

    // 3. Feature/Polígono
    if (selectedFeatureId.current && selectedFeatureId.current.id !== undefined && selectedFeatureId.current.id !== null) {
       url.searchParams.set('feature', String(selectedFeatureId.current.id));
    } else {
       url.searchParams.delete('feature');
    }

    // 4. Copiar
    navigator.clipboard.writeText(url.toString()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Efecto para expandir grupos automáticamente al buscar
  useEffect(() => {
    if (searchTerm) {
      setExpandedGroups(filteredGroups.map(g => g.id));
    }
  }, [searchTerm, filteredGroups]);

  // FUNCIÓN LIMPIAR CAPAS
  const handleClearLayers = () => {
    setActiveLayers([]);
    setActiveTableLayer(null);
  };

  // FUNCIÓN DE DESCARGA CSV
  const handleDownloadCSV = () => {
    if (!activeTableLayer || !activeTableLayer.data.features.length) return;

    const features = activeTableLayer.data.features;
    const properties = features[0].properties;
    const headers = Object.keys(properties);

    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const feature of features) {
      const values = headers.map(header => {
        const val = feature.properties[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${activeTableLayer.name.replace(/\s+/g, '_')}_datos.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // LEER PARÁMETROS
    const lat = parseFloat(searchParams.get('lat') || '21.1619');
    const lng = parseFloat(searchParams.get('lng') || '-86.8475');
    const zoom = parseFloat(searchParams.get('zoom') || '11.5');

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom,
      pitch: 0,
      cooperativeGestures: false,
      touchZoomRotate: true
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.current.on('moveend', () => {
      const center = map.current!.getCenter();
      updateUrlParams({
        lng: center.lng.toFixed(5),
        lat: center.lat.toFixed(5)
      });
    });

    map.current.on('zoomend', () => {
      updateUrlParams({
        zoom: map.current!.getZoom().toFixed(2)
      });
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Cargar Capas
      LAYER_GROUPS.forEach(group => {
        group.layers.forEach(layer => {
          
          // 1. AGREGAR SOURCE CON PROMOTE-ID
          if (!map.current!.getSource(`source-${layer.id}`)) {
            map.current!.addSource(`source-${layer.id}`, {
              type: 'geojson',
              data: layer.data,
              promoteId: layer.uniqueIdField
            });
          }

          // 2. CAPA DE RELLENO
          map.current!.addLayer({
            id: layer.id,
            type: 'fill',
            source: `source-${layer.id}`,
            layout: { visibility: activeLayers.includes(layer.id) ? 'visible' : 'none' },
            paint: layer.paint
          });

          // 3. CAPA DE HIGHLIGHT EN POLÍGONO
          map.current!.addLayer({
            id: `${layer.id}-highlight`,
            type: 'line',
            source: `source-${layer.id}`,
            layout: { visibility: activeLayers.includes(layer.id) ? 'visible' : 'none' },
            paint: {
              'line-color': layer.highlightColor,
              'line-width': [
                'case',
                ['any', 
                  ['boolean', ['feature-state', 'hover'], false],
                  ['boolean', ['feature-state', 'selected'], false]
                ],
                3,
                0
              ]  
            }
          });
        });
      });

      // Recuperar selección desde la URL al cargar
      const params = new URLSearchParams(window.location.search);
      const featureParam = params.get('feature');

      if (featureParam) {
          LAYER_GROUPS.forEach(group => {
            group.layers.forEach(layer => {
                // Buscamos el feature en los datos
                const found = layer.data.features.find((f: any) => 
                    String(f.properties[layer.uniqueIdField]) === featureParam
                );
                
                if (found) {
                    // 1. ACTIVAR CAPA
                    if (!activeLayers.includes(layer.id)) {
                        setActiveLayers(prev => [...prev, layer.id]);
                    }

                    const center = getFeatureCenter(found);
                    const rawId = found.properties[layer.uniqueIdField]; 
                    const featureId = found.id !== undefined ? found.id : rawId;
                    const sourceId = `source-${layer.id}`;

                    // 2. MARCAR ESTADO VISUAL 'SELECTED'
                    if (featureId !== undefined) {
                        setTimeout(() => {
                            if (map.current) {
                                map.current.setFeatureState(
                                    { source: sourceId, id: featureId },
                                    { selected: true }
                                );
                            }
                        }, 200);
                        
                        selectedFeatureId.current = { source: sourceId, id: featureId };
                    }
                    
                    // 3. CONSTRUIR HTML Y MOSTRAR POPUP
                    const tooltipContent = generateTooltipHTML(found, layer, styles);

                    const popup = new mapboxgl.Popup({ 
                        closeButton: true, 
                        closeOnClick: true, 
                        className: styles.hoverPopup, 
                        maxWidth: '260px' 
                    })
                    .setLngLat(center)
                    .setHTML(tooltipContent)
                    .addTo(map.current!);
                    
                    // Limpiar al cerrar
                    popup.on('close', () => {
                        if (isSwitchingSelection.current) return;

                        if (selectedFeatureId.current) {
                            map.current?.setFeatureState(
                                { source: selectedFeatureId.current.source, id: selectedFeatureId.current.id },
                                { selected: false }
                            );
                            selectedFeatureId.current = null;
                        }
                        updateUrlParams({ feature: null });
                    });
                    
                    popupRef.current = popup;
                    map.current!.flyTo({ center: center, zoom: 14 });
                }
            });
          });
      }
    });

    // --- INTERACCIONES ---
    const allLayerIds = LAYER_GROUPS.flatMap(g => g.layers.map(l => l.id));

    // 1. MOUSEMOVE: Solo gestionamos el Highlight Visual
    map.current.on('mousemove', allLayerIds, (e) => {
      if (!e.features || e.features.length === 0) return;
      
      map.current!.getCanvas().style.cursor = 'pointer';

      const feature = e.features[0];
      const layerId = feature.layer?.id; 
      const featureId = feature.id; 

      if (!layerId || featureId === undefined) return;

      const sourceId = `source-${layerId}`;

      // Gestión de Highlight
      if (hoveredFeatureId.current && hoveredFeatureId.current.id !== featureId) {
        map.current?.setFeatureState(
          { source: hoveredFeatureId.current.source, id: hoveredFeatureId.current.id },
          { hover: false }
        );
      }
      hoveredFeatureId.current = { source: sourceId, id: featureId };
      map.current?.setFeatureState(
        { source: sourceId, id: featureId },
        { hover: true }
      );
    });

    // 2. MOUSELEAVE: Limpiamos el Highlight Visual
    map.current.on('mouseleave', allLayerIds, () => {
      map.current!.getCanvas().style.cursor = '';
      
      if (hoveredFeatureId.current) {
        map.current?.setFeatureState(
          { source: hoveredFeatureId.current.source, id: hoveredFeatureId.current.id },
          { hover: false }
        );
        hoveredFeatureId.current = null;
      }
    });

    // 3. CLICK: Abrir Tooltip/Scroll/Paneo Suave
    map.current.on('click', allLayerIds, (e) => {
      e.originalEvent.stopPropagation();
      
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const layerId = feature.layer?.id;
      
      if (!layerId) return;

      const sourceId = `source-${layerId}`;
      const layerConfig = LAYER_GROUPS.flatMap(g => g.layers).find(l => l.id === layerId);

      if (!layerConfig) return;

      // --- GESTIÓN DE SELECCIÓN
      // 1. Apagar selección anterior
      if (selectedFeatureId.current) {
          map.current?.setFeatureState(
              { source: selectedFeatureId.current.source, id: selectedFeatureId.current.id },
              { selected: false }
          );
      }

      // 2. Encender nueva selección y actualizar URL
      if (feature.id !== undefined) {
          map.current?.setFeatureState(
              { source: sourceId, id: feature.id },
              { selected: true }
          );
          selectedFeatureId.current = { source: sourceId, id: feature.id };
          updateUrlParams({ feature: String(feature.id) });
      }

      // 3. Gestión del popup
      if (popupRef.current) {
          isSwitchingSelection.current = true;
          popupRef.current.remove();
          isSwitchingSelection.current = false;
      }

      popupRef.current = new mapboxgl.Popup({
          closeButton: true,      
          closeOnClick: true,     
          className: styles.hoverPopup,
          maxWidth: '260px',
          anchor: 'bottom',       
          offset: 10
      });

      const tooltipContent = generateTooltipHTML(feature, layerConfig, styles);

      // Muestra Popup
      popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(tooltipContent)
          .addTo(map.current!)
          .on('close', () => {
              // Si estamos cambiando de selección
              if (isSwitchingSelection.current) return;

              // Limpieza normal (solo si el usuario cierra el popup)
              if (selectedFeatureId.current) {
                  map.current?.setFeatureState(
                      { source: selectedFeatureId.current.source, id: selectedFeatureId.current.id },
                      { selected: false }
                  );
                  selectedFeatureId.current = null;
              }
              updateUrlParams({ feature: null });
          });
      
      // Seguridad Scroll
      const popupElement = popupRef.current.getElement();
      if(popupElement){
          popupElement.addEventListener('mouseenter', () => map.current?.scrollZoom.disable());
          popupElement.addEventListener('mouseleave', () => map.current?.scrollZoom.enable());
      }

      // Paneo suave
      map.current!.flyTo({
          center: e.lngLat,
          speed: 0.5,
          curve: 1,
          offset: [0, 150] 
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;
    LAYER_GROUPS.forEach(group => {
      group.layers.forEach(layer => {
        const isVisible = activeLayers.includes(layer.id) ? 'visible' : 'none';
        if (map.current?.getLayer(layer.id)) 
            map.current.setLayoutProperty(layer.id, 'visibility', isVisible);
        if (map.current?.getLayer(`${layer.id}-highlight`)) 
            map.current.setLayoutProperty(`${layer.id}-highlight`, 'visibility', isVisible);
      });

      // Guarda las capas activas en la URL cada vez que cambian
      updateUrlParams({
          layers: activeLayers.length > 0 ? activeLayers.join(',') : null
      });
    });
  }, [activeLayers]);

  // HANDLERS
  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };
  const toggleLayer = (id: string) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR */}
      <div className={`${styles.sidebar} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <FiMap /> Visor Interactivo
            </h2>
          </div>

          <div className={styles.headerButtons}>
              {/* BOTÓN COMPARTIR */}
              <button 
                className={`${styles.homeButton} ${isCopied ? styles.copiedBtn : ''}`} 
                onClick={handleShareView} 
                title="Copiar enlace"
              >
                <FiShare2 size={16} /> {isCopied ? '¡Copiado!' : 'Compartir'}
              </button>

              {/* BOTÓN VOLVER */}
              <button className={styles.homeButton} onClick={() => navigate('/')} title="Inicio">
                <FiHome size={16} /> Volver
              </button>
          </div>     
        </div>

        {/* BÚSQUEDA Y LIMPIEZA DE CAPAS */}
        <div className={styles.searchSection}>
            <div className={styles.searchWrapper}>
                <FiSearch className={styles.searchIcon} size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar capa..." 
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {activeLayers.length > 0 && (
                <button className={styles.clearLayersBtn} onClick={handleClearLayers}>
                    <FiTrash2 size={14} /> Desactivar todas las capas ({activeLayers.length})
                </button>
            )}
        </div>

        <div className={styles.sidebarContent}>
          <p className={styles.sectionTitle}>Capas Disponibles</p>
          
          {/* FILTRADO DE CAPAS */}
          {filteredGroups.length > 0 ? (
              filteredGroups.map(group => (
                <div key={group.id} className={styles.groupContainer}>
                  <button className={styles.groupHeader} onClick={() => toggleGroup(group.id)}>
                    <span className="font-semibold text-gray-700 text-sm">{group.title}</span>
                    {expandedGroups.includes(group.id) ? <FiChevronDown /> : <FiChevronRight />}
                  </button>
                  
                  {expandedGroups.includes(group.id) && (
                    <div className={styles.groupContent}>
                      {group.layers.map(layer => (
                        <div key={layer.id} className={styles.layerItem}>
                          <div className={styles.layerRow}>
                              <label className={styles.layerLabel}>
                                <input 
                                  type="checkbox"
                                  checked={activeLayers.includes(layer.id)}
                                  onChange={() => toggleLayer(layer.id)}
                                />
                                <span>{layer.name}</span>
                              </label>
                              {activeLayers.includes(layer.id) && (
                                  <button 
                                    className={styles.btnViewTable} 
                                    onClick={() => {
                                      setActiveTableLayer(layer);
                                      // Solo cerramos el sidebar si es una pantalla chica (móvil/tablet)
                                      if (window.innerWidth <= 768) {
                                        setIsSidebarOpen(false);
                                      }
                                    }}
                                    title="Ver tabla de atributos"
                                  >
                                    <FiList size={14}/> Ver Tabla
                                  </button>
                              )}
                          </div>
                          {activeLayers.includes(layer.id) && layer.legend && (
                            <div className={styles.legendContainer}>
                              {layer.legend.map((item, idx) => (
                                <div key={idx} className={styles.legendItem}>
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
              ))
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
                No se encontraron capas con ese nombre.
            </div>
          )}
        </div>

        <div className={styles.toggleTab} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FiChevronLeft size={20}/> : <FiLayers size={20}/>}
        </div>
      </div>

      <div ref={mapContainer} className={styles.mapContainer} />

      {/* --- PANEL INFERIOR CON TABLA DE DATOS --- */}
      {activeTableLayer && (
        <div className={`${styles.bottomPanel} ${isSidebarOpen ? styles.panelWithSidebar : styles.panelFullWidth}`}>
            <div className={styles.panelHeader}>
                <div className={styles.panelTitle}>
                    <FiList className="text-blue-600"/>
                    {activeTableLayer.name}
                    <span className="text-xs font-normal text-gray-500 ml-2">
                        ({activeTableLayer.data.features.length} registros)
                    </span>
                </div>
                <div className={styles.panelActions}>
                    {activeTableLayer.documentUrl && (
                        <button 
                            className={styles.docBtn} 
                            onClick={() => window.open(activeTableLayer.documentUrl, '_blank')}
                            title="Ver documento técnico relacionado"
                        >
                            <FiFileText size={16} /> Ver Documento
                        </button>
                    )}

                    <button className={styles.downloadBtn} onClick={handleDownloadCSV}>
                        <FiDownload size={16} /> Descargar CSV
                    </button>

                    <button className={styles.closePanelBtn} onClick={() => setActiveTableLayer(null)}>
                        <FiX size={20}/>
                    </button>
                </div>
            </div>
            
            <div className={styles.tableContainer}>
                <table className={styles.fullTable}>
                    <thead>
                        <tr>
                            {activeTableLayer.data.features.length > 0 && 
                             Object.keys(activeTableLayer.data.features[0].properties).map(key => (
                               <th key={key}>{key}</th>
                             ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Limitamos a 500 filas para rendimiento en vista previa */}
                        {activeTableLayer.data.features.slice(0, 500).map((feat: any, idx: number) => (
                            <tr key={idx}>
                                {Object.values(feat.properties).map((val: any, i) => (
                                    <td key={i}>{String(val)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default Maps;