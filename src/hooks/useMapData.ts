import { useEffect, useState } from 'react';
import type { MapCategoryWithLayers, MapLayer } from '../types';
import { supabase } from '../lib/supabase';

export const useMapData = () => {
  const [layerGroups, setLayerGroups] = useState<MapCategoryWithLayers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('map_categories')
        .select(`*, layers:map_layers(*)`)
        .eq('is_active', true)
        .order('order_index');

      if (!error && data) {
        const formatted: MapCategoryWithLayers[] = data.map((cat: any) => ({
          ...cat,
          layers: (cat.layers || []).map((l: any): MapLayer => {
            const parsedMetadata = typeof l.metadata === 'string' 
              ? JSON.parse(l.metadata) 
              : l.metadata;

            return {
              ...l,
              layer_type: parsedMetadata?.layer_type || l.geometry_type || 'fill',
              metadata: parsedMetadata,
              document_url: l.document_url,
              uniqueIdField: parsedMetadata?.uniqueIdField || 'id',
              highlightColor: parsedMetadata?.highlightColor || '#005eb8',
              paint: parsedMetadata?.paint || {}
            };
          })
        }));
        setLayerGroups(formatted);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return { layerGroups, loading };
};