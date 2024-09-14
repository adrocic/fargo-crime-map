declare module "leaflet" {
    namespace HeatLayer {
        interface HeatMapOptions {
            minOpacity?: number;
            maxZoom?: number;
            max?: number;
            radius?: number;
            blur?: number;
            gradient?: { [key: number]: string };
        }
    }

    function heatLayer(latlngs: Array<[number, number, number?]>, options?: HeatLayer.HeatMapOptions): Layer;
}
