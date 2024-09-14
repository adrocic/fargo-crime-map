// src/components/MapView.tsx
import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import useQueryCrimeData from "Hooks/QueryCrimeData/useQueryCrimeData";
import HeatmapLayer from "Components/HeatmapLayer/HeatmapLayer";
import { CircularProgress } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import Filters from "Components/Filters/Filters";

const MapView: React.FC = () => {
    const [filters, setFilters] = useState({ startDate: new Date(), endDate: new Date(), callType: "" });
    const { crimeData, isLoadingCrimeData, isErrorCrimeData } = useQueryCrimeData(filters as any);

    const heatmapPoints = crimeData
        ? crimeData
              .filter((data) => data.latitude && data.longitude)
              .map((data) => [parseFloat(data.latitude), parseFloat(data.longitude), 1])
        : [];

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            {isLoadingCrimeData ? (
                <CircularProgress />
            ) : isErrorCrimeData ? (
                <div>Error loading data</div>
            ) : (
                <>
                    <Filters onFilterChange={(newFilters: any) => setFilters(newFilters)} />
                    {/* @ts-ignore */}
                    <MapContainer center={[46.8772, -96.7898]} zoom={13} style={{ height: "75%", width: "75%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {console.log(heatmapPoints as any) as any}
                        <HeatmapLayer
                            points={heatmapPoints as any}
                            options={{
                                radius: 25,
                                maxZoom: 17,
                            }}
                        />
                    </MapContainer>
                    <div>
                        {" "}
                        <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                    </div>
                </>
            )}
        </div>
    );
};

export default MapView;
