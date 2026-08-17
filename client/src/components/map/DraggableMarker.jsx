
import { Marker, useMapEvents } from "react-leaflet";

export const DraggableMarker = ({
    position, onPositionChange, draggable = true, icon, title
}) => {
    useMapEvents(
        draggable
            ? { click: (event) => onPositionChange?.(event.latlng.lat, event.latlng.lng)} 
            : {}
    );

    if (!position) return null;

    return (
        <Marker
            position={position}
            draggable={draggable}
            {...(icon ? { icon } : {})}
            {...(title ? {title} : {})}
            eventHandlers = {
                draggable 
                ? {
                    dragend: (event) => onPositionChange?.(event.target.getLatLng().lat, event.target.getLatLng().lng),
                  }
                : {}
                }
        />
    );
};

export default DraggableMarker;