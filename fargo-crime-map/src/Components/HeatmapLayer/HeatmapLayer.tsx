import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

// Define types for props
interface HeatmapLayerProps {
    points: Array<[number, number, number]>; // [lat, lng, intensity]
    options?: {
        radius?: number;
        maxOpacity?: number;
        blur?: number;
        maxZoom?: number;
        gradient?: Record<string, string>;
        [key: string]: unknown; // Use unknown instead of any
    };
}

const HeatmapLayer = ({ points, options = {} }: HeatmapLayerProps): null => {
    let heatLayerRef = useRef(null);
    const Heatmap = useMap();

    useEffect(() => {
        if (!L.heatLayer) {
            console.error("L.heatLayer is not available. Make sure leaflet.heat is properly imported");
            return;
        }

        // Default options
        const defaultOptions = {
            radius: 25,
            blur: 15,
            maxOpacity: 0.8,
            gradient: { 0.4: "blue", 0.65: "lime", 1: "red" },
        };

        const cfg = { ...defaultOptions, ...options };

        try {
            // Create heatmap layer using Leaflet.heat
            heatLayerRef = L.heatLayer(points, cfg);

            // Add to map
            (heatLayerRef as unknown as any).addTo(Heatmap);
        } catch (error) {
            console.error("Error initializing heatmap:", error);
            // Remove the explicit return undefined
            return;
        }

        // Cleanup on unmount
        return () => {
            Heatmap.removeLayer(heatLayerRef);
        };
    }, [Heatmap, points, options]);

    return null;
};

// Add defaultProps to satisfy ESLint
HeatmapLayer.defaultProps = {
    options: {},
};

export default HeatmapLayer;
