import { useApp } from "@/controllers/AppContext";
import { useMemo, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Loader2, MapPinned, Phone, Star } from "lucide-react";
import { useSessionId } from "@/hooks/useSessionId";

const BusinessMarkers = ({ businesses, favorites, onFavoriteToggle }) => {
    const { api } = useApp();
    const [isLoading, setIsLoading] = useState(null);
    const sessionId = useSessionId();

    const handleClick = async (businessId) => {
        if (isLoading) return;
        setIsLoading(businessId);

        try {
            await onFavoriteToggle?.(businessId);
        } finally {
            setIsLoading(null);
        }
    };

    const createIcon = useMemo(() => (business) => L.divIcon({
    className: "custom-business-marker",
    html: business.image
      ? `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
            <div style="width:32px;height:32px;border-radius:50%;overflow:hidden;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);background-image:url('${business.image}');background-size:cover;background-position:center;background-color:#f97316;"></div>
            <span style="background:rgba(0,0,0,0.05);color:black;font-size:10px;padding:1px 4px;border-radius:4px;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;">${business.name}</span>
         </div>`
      : `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
            <div style="background:#f97316;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px;font-weight:bold;">🏪</div>
            <span style="background:rgba(0,0,0,0.05);color:black;font-size:10px;padding:1px 4px;border-radius:4px;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center;">${business.name}</span>
         </div>`,
    iconSize: [80, 50],
    iconAnchor: [40, 16],
  }), []);

  return (
    <>
        {businesses.map((business) => (
            <Marker
                key={business.id}
                position={[parseFloat(business.latitude), parseFloat(business.longitude)]}
                eventHandlers={{
                    popupopen: () => {
                        api.post("/api/metrics/view", {
                            businessId: business.id,
                            sessionId: sessionId,
                        })
                        .catch(() => {});
                    },
                }}
                icon={createIcon(business)}
            >
                <Popup>
                    <div className="min-w-[180px]">
                        <strong className="flex items-center gap-2 mt-2 text-sm text-gray-900">
                            {business.name}
                        </strong>
                        <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <MapPinned className="w-4 h-4" />
                            {business.distance.toFixed(2)} Km
                        </p>
                        {business.whatsapp && (
                            <a
                                onClick={() => {
                                    api.post("/api/metrics/click", {
                                        businessId: business.id,
                                        sessionId: sessionId,
                                    })
                                    .catch(() => {});
                                }}
                                href={`https://wa.me/55${business.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer !text-gray-600 dark:!text-gray-400 no-underline hover:bg-green-600 hover:!text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:!text-white dark:hover:border-green-600 transition-colors"
                                title="WhatsApp"
                            >
                                <Phone className="w-4 h-4" />
                                WhatsApp
                            </a>
                        )}
                        {onFavoriteToggle && (
                            <button
                                onClick={() => handleClick(business.id)}
                                disabled={isLoading === business.id}
                                className="mt-2 block w-full flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={favorites?.has(business.id) ? "Favoritos" : "Favoritar"}
                            >
                                {isLoading === business.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Star className={`w-4 h-4 ${favorites?.has(business.id) ? "fill-yellow-500 text-yellow-500" : ""}`} />
                                )}
                                {favorites?.has(business.id) ? "Favoritos" : "Favoritar"}
                            </button>
                        )}
                    </div>
                </Popup>
            </Marker>
        ))}
    </>
  );
};

export default BusinessMarkers;