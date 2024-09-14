// src/components/HeatmapLayer.tsx
import { useMap } from "react-leaflet";
// @ts-ignore
import L, { Layer } from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";

interface HeatmapLayerProps {
    points: Array<[number, number, number?]>;
    options?: L.HeatLayer.HeatMapOptions;
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points, options }) => {
    const map = useMap();

    useEffect(() => {
        const heatLayer = L.heatLayer(points, options).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points, options]);

    return null;
};

export default HeatmapLayer;
