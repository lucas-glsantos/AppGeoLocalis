
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";

import { DraggableMarker } from "./DraggableMarker";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { MapCircle } from "./MapCircle";
import BusinessMarkers from "./BusinessMarkers";


const fallbackConfig = {
    center: [-14.2350, -51.9253], // Centro geográfico do Brazil
    zoom: 4, // Zoom ideal para visualizar o país inteiro
};

const MapController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (Array.isArray(center)) { 
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        };
    }, [center, zoom, map]);
    return null;
};

export const BusinessMap = ({
    // Obrigatorios
    center,         // [lat, lng] - centro inicial do mapa
    latitude,       // lat atual do marcador principal
    longitude,      // lng atual do marcador principal 
    onPositionChange,   // callback (lat, lng) -> void

    // Opcionais
    readOnly = false,
    showCurrentLocation = false,
    businesses = [],
    favorites = new Set(),
    onFavoriteToggle,
    zoom = 13,
    radius = 5000,
    className = "",
    style,
    minZoom = 3,
    maxZoom = 19,
    scrollWheelZoom = true,
    dragging = true,
    showRadius = true,
}) => {
    
    const leafletInitialized = useRef(false);

    useEffect(() => {
        if (!leafletInitialized.current) {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });
            leafletInitialized.current = true;
        }
    }, []); 

    // Validação estrita
    const hasValidCenter = Array.isArray(center) && center.length === 2 &&
        typeof center[0] === 'number' &&
        typeof center[1] === 'number';

    // Definição das propriedades ativas
    const activeCenter = hasValidCenter ? center : fallbackConfig.center;
    const activeZoom = hasValidCenter ? zoom : fallbackConfig.zoom;
    
    // Posição do marcador principal
    const hasPosition = typeof latitude === 'number' && typeof longitude === 'number';
    const markerPosition = hasPosition ? [latitude, longitude] : null;
    const handlePositionChange = (lat, lng) => onPositionChange?.({ lat, lng });

    return (
        <div className={`w-full h-full ${className}`} style={style}>
            <MapContainer
                center={activeCenter}
                zoom={activeZoom}
                minZoom={minZoom}
                maxZoom={maxZoom}
                scrollWheelZoom={scrollWheelZoom}
                dragging={dragging}
                className="w-full h-full rounded-2xl overflow-hidden shadow-md isolate"
                style={{ ...style, isolation: 'isolate' }}
                aria-label="Mapa de localização do comércio"
            >
                <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController 
                    center={activeCenter} 
                    zoom={activeZoom} 
                />

                {/* Renderiza radius e localização atual Se o centro for real e válido */}
                {hasValidCenter && (
                    <>
                        {/* Raio do círculo */}
                        {showRadius && 
                            <MapCircle 
                                center={activeCenter} 
                                radius={radius}
                            />
                        }

                        {/* Marcador */}
                        {showCurrentLocation && (
                            <CurrentLocationMarker 
                                position={activeCenter} 
                                label="Você está aqui" 
                            />
                        )}  
                    </>
                )}

                {/* Marcador principal (arrastável/clicável) */}
                <DraggableMarker
                    position={markerPosition}
                    onPositionChange={handlePositionChange}
                    draggable={!readOnly}
                    title={readOnly ? undefined : "Arraste para ajustar localização"}
                />

                {/* Marcadores de negócios próximos */}
                {businesses.length > 0 && (
                    <BusinessMarkers
                        businesses={businesses}
                        favorites={favorites}
                        onFavoriteToggle={onFavoriteToggle}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default BusinessMap;