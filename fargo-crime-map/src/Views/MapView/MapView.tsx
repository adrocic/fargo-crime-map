// src/components/MapView.tsx
import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import useQueryCrimeData from "Hooks/QueryCrimeData/useQueryCrimeData";
import HeatmapLayer from "Components/HeatmapLayer/HeatmapLayer";
import { CircularProgress } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import Filters from "Components/Filters/Filters";
import { format } from "date-fns";

interface CrimeData {
    latitude: string;
    longitude: string;
}

interface FiltersType {
    startDate: Date | null;
    endDate: Date | null;
}

const MapView: React.FC = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const [filters, setFilters] = useState<FiltersType>({
        startDate: yesterday,
        endDate: today,
    });

    const formattedFilters = {
        startDate: format(filters?.startDate ?? Date.now(), "yyyy-MM-dd"),
        endDate: format(filters?.endDate ?? Date.now(), "yyyy-MM-dd"),
    };

    const {
        crimeData,
        isLoadingCrimeData: isLoadingCrimeData,
        isErrorCrimeData: isErrorCrimeData,
    } = useQueryCrimeData(formattedFilters);

    const heatmapPoints = useMemo(() => {
        return crimeData
            ? crimeData
                  .filter((data: CrimeData) => data.latitude && data.longitude)
                  .map((data: CrimeData) => [parseFloat(data.latitude), parseFloat(data.longitude), 1])
            : [];
    }, [crimeData]);

    if (isLoadingCrimeData) {
        return (
            <div style={{ height: "100vh", width: "100%" }}>
                <CircularProgress />
            </div>
        );
    }

    if (isErrorCrimeData) {
        return (
            <div style={{ height: "100vh", width: "100%" }}>
                <div>Error loading data</div>
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Filters onFilterChange={setFilters} />
            {/* @ts-ignore:next-line */}
            <MapContainer center={[46.8772, -96.7898]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <HeatmapLayer
                    points={heatmapPoints as any}
                    options={{
                        radius: 25,
                        maxZoom: 17,
                    }}
                />
            </MapContainer>
            <div>
                <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            </div>
        </div>
    );
};

export default MapView;
