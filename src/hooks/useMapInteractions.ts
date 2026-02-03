import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useSearchParams } from 'react-router-dom';
import type { MapLayer } from '../types';

export const useMapInteractions = (map: React.MutableRefObject<mapboxgl.Map | null>, styles: any) => {
  const [_, setSearchParams] = useSearchParams();
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const hoveredFeatureId = useRef<{ id: string | number; source: string } | null>(null);
  const selectedFeatureId = useRef<{ id: string | number; source: string } | null>(null);
  const isSwitchingSelection = useRef(false);

  // Actualizar URL
  const updateUrlParams = (updates: Record<string, string | null>) => {
    const currentParams = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) currentParams.delete(key);
      else currentParams.set(key, value);
    });
    setSearchParams(currentParams, { replace: true });
  };

  // FUNCIÓN DE LIMPIEZA DE SELECCIÓN
  const clearAllInteractions = () => {
    if (!map.current) return;
    
    if (selectedFeatureId.current) {
      map.current.setFeatureState(
        { source: selectedFeatureId.current.source, id: selectedFeatureId.current.id },
        { selected: false }
      );
      selectedFeatureId.current = null;
    }

    if (hoveredFeatureId.current) {
      map.current.setFeatureState(
        { source: hoveredFeatureId.current.source, id: hoveredFeatureId.current.id },
        { hover: false }
      );
      hoveredFeatureId.current = null;
    }

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    updateUrlParams({ feature: null });
  };

  const handleSelectFeature = (
    feature: mapboxgl.MapboxGeoJSONFeature, 
    layer: MapLayer, 
    lngLat: mapboxgl.LngLat,
    shouldFly: boolean = true
  ) => {
    if (!map.current) return;
    const currentMap = map.current;
    
    const featId = feature.id !== undefined 
      ? feature.id 
      : feature.properties?.[layer.uniqueIdField || 'id'];

    if (selectedFeatureId.current) {
      currentMap.setFeatureState(
        { source: selectedFeatureId.current.source, id: selectedFeatureId.current.id },
        { selected: false }
      );
    }

    if (featId !== undefined && featId !== null) {
      selectedFeatureId.current = { source: layer.id, id: featId as string | number };
      currentMap.setFeatureState(
        { source: layer.id, id: featId as string | number }, 
        { selected: true }
      );
      updateUrlParams({ 
        feature: String(featId),
        layer: layer.id 
      });
    }

    if (popupRef.current) {
      isSwitchingSelection.current = true;
      popupRef.current.remove();
      isSwitchingSelection.current = false;
    }

    const tooltipHTML = generateTooltipHTML(feature, layer, styles);
    const popup = new mapboxgl.Popup({ 
      closeButton: true, 
      className: styles.hoverPopup, 
      maxWidth: '280px', 
      offset: 10,
      anchor: 'bottom' 
    })
      .setLngLat(lngLat)
      .setHTML(tooltipHTML)
      .addTo(currentMap);

    popupRef.current = popup;

    popup.on('close', () => {
      if (isSwitchingSelection.current) return;
      if (selectedFeatureId.current) {
        currentMap.setFeatureState(
          { source: selectedFeatureId.current.source, id: selectedFeatureId.current.id },
          { selected: false }
        );
        selectedFeatureId.current = null;
      }
      updateUrlParams({ feature: null, layer: null });
    });

    if (shouldFly) {
      currentMap.flyTo({ 
        center: lngLat, 
        speed: 0.8, 
        curve: 1, 
        offset: [0, 150],
        essential: true 
      });
    }
  };

  const setupLayerEvents = (layer: MapLayer) => {
    if (!map.current) return;
    const currentMap = map.current;

    // MOUSEMOVE: Gestión de highlight al hacer hover
    currentMap.on('mousemove', layer.id, (e) => {
      if (!e.features || e.features.length === 0) return;
      
      currentMap.getCanvas().style.cursor = 'pointer';
      const feature = e.features[0];
      const featureId = feature.id;

      if (featureId === undefined) return;

      if (hoveredFeatureId.current) {
        currentMap.setFeatureState(
          { source: hoveredFeatureId.current.source, id: hoveredFeatureId.current.id },
          { hover: false }
        );
      }

      hoveredFeatureId.current = { source: layer.id, id: featureId };
      
      currentMap.setFeatureState(
        { source: layer.id, id: featureId },
        { hover: true }
      );
    });

    currentMap.on('mouseleave', layer.id, () => {
      currentMap.getCanvas().style.cursor = '';
      
      if (hoveredFeatureId.current) {
        currentMap.setFeatureState(
          { source: hoveredFeatureId.current.source, id: hoveredFeatureId.current.id },
          { hover: false }
        );
        hoveredFeatureId.current = null;
      }
    });

    currentMap.on('click', layer.id, (e) => {
      if (!e.features || e.features.length === 0) return;
      handleSelectFeature(e.features[0], layer, e.lngLat);
    });
  };

  return { setupLayerEvents, handleSelectFeature, updateUrlParams, clearAllInteractions, selectedFeatureId };
};


function generateTooltipHTML(feature: any, layer: MapLayer, styles: any) {
  let tableRows = '';
  const properties = feature.properties || {};
  
  // Extraemos los campos visibles desde metadata
  const visibleFields = layer.metadata?.visibleFields;

  Object.entries(properties).forEach(([key, value]) => {
    if (visibleFields && visibleFields.length > 0) {
      if (!visibleFields.includes(key)) return;
    }

    // No mostrar mapbox_id ni objetos)
    if (key !== 'mapbox_id' && typeof value !== 'object' && value !== null) {
      tableRows += `
        <tr>
          <th style="text-align: left; padding: 4px 8px; font-size: 11px; color: #64748b; border-bottom: 1px solid #f1f5f9; text-transform: capitalize;">
            ${key.replace(/_/g, ' ')}
          </th>
          <td style="text-align: right; padding: 4px 8px; font-size: 11px; color: #1e293b; border-bottom: 1px solid #f1f5f9; font-weight: 500;">
            ${value}
          </td>
        </tr>`;
    }
  });

  return `
    <div class="${styles.popupContent}" style="min-width: 200px; max-height: 300px; overflow-y: auto;">
      <div class="${styles.popupHeader}" style="border-top: 4px solid ${layer.highlightColor || '#3b82f6'}; padding: 8px 12px; background: #f8fafc;">
        <h3 style="margin: 0; font-size: 13px; color: #0f172a; font-weight: 600;">${layer.name}</h3>
      </div>
      <table style="width: 100%; border-collapse: collapse; background: white;">
        <tbody>
          ${tableRows || '<tr><td style="padding: 8px; text-align: center; color: #94a3b8;">Sin datos visibles</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}