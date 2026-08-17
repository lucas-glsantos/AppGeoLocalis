// Marcador de localização atual

import { Marker, Popup } from "react-leaflet"
import L from "leaflet";

const currentLocationIcon = L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;border-radius:50%;background:#3b82f6;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
})

export const CurrentLocationMarker = ({ position, label = "Você está aqui" }) => {
    if (!position) return null;

    return (
        <Marker 
            position={position} 
            icon={currentLocationIcon}
        >
            <Popup>
                {label}
            </Popup>
        </Marker>
    );
};

export default CurrentLocationMarker;