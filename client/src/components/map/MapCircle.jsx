import { Circle } from "react-leaflet";


export const MapCircle = ({
    center,
    radius = 5000, // metros
    color = "#2563eb",
    fillColor = "#2563eb",
    fillOpacity = 0.15,
    weight = 1
}) => {
    // Validação estrita
    const isValidCenter = Array.isArray(center) && center.length === 2 &&
        typeof center[0] === 'number' &&
        typeof center[1] === 'number';
    
    // Se centro não for valido, não renderiza evitnaod crash no Leaflet
    if (!isValidCenter) return null;

    return (
        <Circle
            center={center}
            radius={radius}
            pathOptions={{
                color,
                fillColor,
                fillOpacity,
                weight,
            }}
        />
    );
};

export default MapCircle;