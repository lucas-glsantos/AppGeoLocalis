import { MapContainer, useMap, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useEffect, useState, useCallback } from "react";
import { MapPin, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import LocalSearch from "./LocalSearch";
import { useApp } from "../controllers/AppContext";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

const MapController = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13, { duration: 1.5 });
        }
    }, [center, map]);

    return null;
};

const SourceMap = () => {
    const { api } = useApp();
    const [center, setCenter] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [error, setError] = useState(null);
    const [userRegion, setUserRegion] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        if (!navigator.geolocation) {
            handleAllowLocation();
        }
    }, []);

    // Obter localização pelo ip
    const getLocationByIp = useCallback(async () => {
        const { data } = await api.get("/api/location/my-ip");
        if (data.success && data.city) {
            return {
                city: data.city,
                state: data.region,
            };
        }
        return null;
    }, [api]);

    // Obter localização central da cidade
    const getCityCenter = useCallback(async (city, state, retries = 2) => {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);

                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${city},${state},brasil&format=json&limit=1`, 
                    { 
                        headers: { "User-Agent": "GeoLocalisApp/1.0" }, 
                        signal: controller.signal 
                    }
                );

                clearTimeout(timeout);
                if (!res.ok) continue;

                const data = await res.json();
        
                if (!data || data.length === 0) return null;
                
                return {
                    center: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
                    displayName: data[0].display_name,
                };
            } catch {
                if (attempt === retries) return null;
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        return null;
    }, []);

    // Botão Tentar Localização ip
    const handleAllowLocation = useCallback(async () => {
        setLoadingLocation(true);
        setError(null);

        try {
            // 1 Tentativa IP Nominatim
            const ipInfo = await getLocationByIp();
            if (ipInfo) {
                // Usa o nome da cidade para buscar o centro geográfico
                const cityCenter = await getCityCenter(ipInfo.city, ipInfo.state);
                if (cityCenter) {
                    setCenter(cityCenter.center);
                    setUserRegion({ city: ipInfo.city, state: ipInfo.state });
                    return; // early return
                } else {
                    setError("Não foi possível determinar sua localização. Tente novamente");
                }
            } else {
                setError("Não possível determinar sua localização pelo IP. Tente novamente");
            }
        } catch {
            setError("Erro ao obter localização. Tente novamente.");
        } finally {
            setLoadingLocation(false);
        }
    }, [getLocationByIp, getCityCenter]);


    // Estado de carregamento inicial
    if (loadingLocation) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 px-4">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />

                    <p className="text-gray-500 dark:text-gray-400">
                        Obtendo sua Localização...
                    </p>
                </div>
            </div>
        );
    }

    // Estado de Erro caso falha
    if (error) {
        return (
            <div className="h-[350px] sm:h-[450px] flex flex-col items-center justify-center text-center px-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <p className="text-red-500 font-semibold">
                    Localização indisponível
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm">
                    {error}
                </p>
                
                <button
                    onClick={handleAllowLocation}
                    className="mt-5 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px]"
                    aria-label="Tentar novamente"
                >
                    <RefreshCw className="w-4 h-4" />
                    Tentar novamente
                </button>
            </div>
        );
    }

    // Estado mapa carregado
    if (center) {
        return (
            <div className="w-full">
                {userRegion && (
                    <LocalSearch userRegion={userRegion} setCenter={setCenter} />
                )}

                <div className="w-full h-[300px] sm:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-md mt-4">
                    <MapContainer
                        center={center}
                        zoom={13}
                        scrollWheelZoom={!isMobile}
                        dragging={true}
                        className="w-full h-full"
                        aria-label="Mapa de comércios locais"
                    >
                        <MapController center={center} />

                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={center}>
                            <Popup>Você está Aqui</Popup>
                        </Marker>

                        <Circle
                            center={center}
                            radius={500}
                            pathOptions={{
                                color: "#2563eb",
                                fillColor: "#2563eb",
                                fillOpacity: 0.15,
                            }}
                        />
                    </MapContainer>
                </div>
            </div>
        );
    }

    

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 px-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
                    <MapPin className="w-12 h-12 text-blue-500" />
                </div>
                <p className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">
                    Descubra comércios próximos
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
                    Ative sua localização para encontrar negócios e serviços perto de você
                </p>

                <button
                    onClick={handleAllowLocation}
                    disabled={loadingLocation}
                    className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-medium hover:opacity-90 transition-all flex items-center gap-2 justify-center mx-auto min-h-[48px] disabled:opacity-60"
                    aria-label="Permitir localização"
                >
                    <MapPin className="w-5 h-5" />
                    Usar minha localização

                </button>
            </div>
        </div>
    );
};

export default SourceMap;
