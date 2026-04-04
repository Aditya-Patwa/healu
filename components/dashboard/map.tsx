// @ts-nocheck
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

// Create custom animated divIcons
const activeUnitIcon = L.divIcon({
    html: `
        <div class="relative flex h-8 w-8 items-center justify-center">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-20"></span>
            <span class="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-primary shadow-sm"></span>
        </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const idleUnitIcon = L.divIcon({
    html: `
        <div class="relative flex h-8 w-8 items-center justify-center">
            <span class="relative inline-flex h-4 w-4 rounded-full border-2 border-background bg-muted-foreground shadow-sm"></span>
        </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
});

const hospitalIcon = L.divIcon({
    html: `
        <div class="relative flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-destructive"><path d="M12 2v20"/><path d="M2 12h20"/></svg>
        </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

const userIcon = L.divIcon({
    html: `
        <div class="relative flex h-10 w-10 items-center justify-center">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-40"></span>
            <span class="relative inline-flex h-5 w-5 rounded-full border-2 border-background bg-blue-600 shadow-md"></span>
        </div>
    `,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// Component to handle map view centering
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);
    return null;
}

export default function Map({ hospitals, ambulances, currentLocation }: { hospitals: any[], ambulances: any[], currentLocation?: { lat: number, lng: number } | null }) {
    // Example coords (London approx) or current location
    const centerPosition: [number, number] = currentLocation
        ? [currentLocation.lat, currentLocation.lng]
        : [23.1815, 79.9864];

    // Sample data to make the map look busy and functional
    const units = [
        { id: 1, pos: [51.505, -0.09], type: 'active', name: 'Ambulance 14', status: 'En route' },
        { id: 2, pos: [51.515, -0.1], type: 'idle', name: 'Ambulance 03', status: 'Standby' },
        { id: 3, pos: [51.53, -0.12], type: 'active', name: 'Ambulance 09', status: 'Transporting' },
    ];

    // const hospitals = [
    //     { id: 'h1', pos: [51.52, -0.11], name: 'Central Care Hospital', capacity: '85%' },
    //     { id: 'h2', pos: [51.51, -0.13], name: 'Westside General', capacity: '40%' }
    // ];

    return (
        <div className="min-h-[450px] h-full w-full rounded-2xl overflow-hidden border border-border shadow-sm isolate">
            <MapContainer
                center={centerPosition}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                zoomControl={false}
            >
                <MapUpdater center={centerPosition} />
                {/* Clean, light-themed map style */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">Carto</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {currentLocation && (
                    <Marker position={[currentLocation.lat, currentLocation.lng]} icon={userIcon}>
                        <Popup className="font-sans">
                            <div className="font-semibold text-foreground text-sm">Our Current Location</div>
                        </Popup>
                    </Marker>
                )}

                {hospitals.map(hospital => (
                    <Marker key={hospital.id} position={[hospital.lat, hospital.lng] as [number, number]} icon={hospitalIcon}>
                        <Popup className="font-sans">
                            <div className="font-semibold text-foreground text-sm">{hospital.name}</div>
                            <div className="text-muted-foreground text-xs mt-1">Capacity: {hospital.reported_beds}</div>
                        </Popup>
                    </Marker>
                ))}

                {ambulances.map(unit => (
                    <Marker key={unit.id} position={[unit.current_lat, unit.current_lng] as [number, number]} icon={unit.status === 'active' ? activeUnitIcon : idleUnitIcon}>
                        <Popup className="font-sans">
                            <div className="font-semibold text-foreground text-sm">{unit.id}</div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className={`h-1.5 w-1.5 rounded-full ${unit.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                                <span className="text-muted-foreground text-xs">{unit.status}</span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
