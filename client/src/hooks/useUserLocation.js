import { useEffect, useRef, useState } from "react";


const getBrowserPosition = () => 
    new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);

        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                source: "gps"
            }),
            () => resolve(null),
            { enableHighAccuracy: true, 
                timeout: 7000,
                maximumAge: 180000
            }
        );
    });

export const useUserLocation = (api, { onLocated } = {}) => {
    const [userCoords, setUserCoords] = useState(null);
    const [source, setSource] = useState(null);     // "gps" || "ip"
    const [error, setError] = useState(null);
    const onLocatedRef = useRef(onLocated);

    onLocatedRef.current = onLocated;       // sempre o callback mais recente

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        const persist = (coords, src) => {
            if (cancelled) return;
            setUserCoords(coords);
            setSource(src);
            onLocatedRef.current?.({
                lat: coords[0],
                lon: coords[1]
            });
        };

        (async () => {
            const gps = await getBrowserPosition();
            if (gps) return persist([gps.latitude, gps.latitude], "gps");

            try {
                const { data } = await api.get("/api/location/my-ip", { signal: controller.signal });

                if (cancelled) return;

                if (data.success) {
                    const lat = Number(data.latitude ?? data.lat);
                    const lon = Number(data.longitude ?? data.lon);

                    if (!isNaN(lat) && !isNaN(lon)) 
                        persist([lat, lon], "ip");

                    else if (!cancelled) setError("Coordenadas inválidas");
                }   else if (!cancelled) {
                    setError("Localização não encontrada");
                }
            } catch (error) {
                if (!cancelled && error.name !== "AbortError") setError("Não foi possível carregar a localização");
            }
        })();

        return () =>{ 
            cancelled = true;
            controller.abort();
        };
    }, [api]);

    return { userCoords, source, error };
};