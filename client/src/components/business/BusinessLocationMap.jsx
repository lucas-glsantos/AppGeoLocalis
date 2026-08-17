import { MapPin } from "lucide-react";
import { BusinessMap } from "@/components/map/BusinessMap";

const BusinessLocationMap = ({
    center,
    latitude,
    longitude,
    onPositionChange,
    showCurrentLocation = false,
    readOnly = false,
    error,
    hint = "Clique no mapa para ajustar a localização do comércio",
}) => {
    const hasPosition = latitude !== null && latitude !== undefined;

    return (
        <div>
            <label className="mb-2 flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5" />
                Localização no Mapa
            </label>
            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
            <div className="h-[300px] overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600">
                <BusinessMap
                    center={center}
                    latitude={latitude}
                    longitude={longitude}
                    onPositionChange={onPositionChange}
                    showCurrentLocation={showCurrentLocation}
                    readOnly={readOnly}
                    showRadius={false}
                />
            </div>
            {hasPosition && (
                <p className="mt-1 text-xs text-gray-500">
                    Lat: {Number(latitude).toFixed(4)}, Lng: {Number(longitude).toFixed(4)}
                </p>
            )}
            {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
};

export default BusinessLocationMap;