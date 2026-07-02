import { MapContainer, useMap, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import { MapPin, AlertTriangle, RefreshCw, Loader2, Tag, MapPinned, Phone, Star } from "lucide-react";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import LocalSearch from "./LocalSearch";
import { useApp } from "../controllers/AppContext";
import toast from "react-hot-toast";
import { infoToast } from "../assets/infoToast";

const businesses_categories_filter = ["Alimentação", "Artesanato", "Beleza", "Consultoria", "Educação", "Moda", "Saúde", "Serviços", "Tecnologia", "Outro"];

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

// Subcomponente para renderizar marcadores de cómercios próximos
const BusinessMarkers = ({ businesses, center, onRecenter, favorites, onFavoriteToggle }) => {
	const map = useMap();

	const [isLoading, setIsLoading] = useState(null);

	// Recentralizar no usuário
	useEffect(() => {
		if (onRecenter && center) {
			map.flyTo(center, 13, { duration: 1.5 });
		}
	}, [onRecenter, center, map]);

	const handleClick = async (bizId) => {
		if (isLoading) return;
		setIsLoading(bizId);

		try {
			await onFavoriteToggle(bizId);
		} finally {
			setIsLoading(null);
		}
	};

	return (
		<>
			{businesses.map((biz) => (
				<Marker
					key={biz.id}
					position={[parseFloat(biz.latitude), parseFloat(biz.longitude)]}
					icon={L.divIcon({
						className: "custom-business-marker",
						html: biz.image
							?	`<div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
									<div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); background-image:url('${biz.image}'); background-size: cover; background-position: center; background-color: #f97316;"></div>
									<span style="background:rgba(0, 0, 0, 0.05); color: black; font-size: 10px; padding: 1px 4px; border-radius: 4px; max-width: 80px; overflow: hidden; text-oveflow: ellipsis; white-space: nowrap; text-align: center;">${biz.name}</span>
								</div>`
							: 	`<div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
									<div style="background: #f97316; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); font-size: 14px; font-weight: bold;">🏪</div>
									<span style="background:rgba(0, 0, 0, 0.05); color: black; font-size: 10px; padding: 1px 4px; border-radius: 4px; max-width: 80px; overflow: hidden; text-oveflow: ellipsis; white-space: nowrap; text-align: center;">${biz.name}</span>
								</div>`,
						iconSize: [80, 50],
						iconAnchor: [40, 16],
					})}
				>
					<Popup>
						<div className="min-w-[180px]">
							<strong className="flex items-center gap-2 mt-2 text-sm text-gray-900" title="Comércio">
                                {biz.name}
                            </strong>
							<p className="flex items-center gap-2 mt-2 text-sm text-gray-600" title="Categoria">
								<Tag className="w-4 h-4" />
                                {biz.category}
                            </p>
							{biz.distance !== null && biz.distance !== undefined && 
                                <p className="flex items-center gap-2 mt-2 text-sm text-gray-600" title="Distância">
									<MapPinned className="w-4 h-4" />
                                    {biz.distance.toFixed(2)} Km de distância
                                </p>
                            }
							{biz.whatsapp && (
								<a
									href={`https://wa.me/55${biz.whatsapp.replace(/\D/g, "")}`}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 block flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer !text-gray-600 dark:!text-gray-400 no-underline hover:bg-green-600 hover:!text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:!text-white dark:hover:border-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									title="WhatsApp"
								>
									<Phone className="w-4 h-4" />
									WhatsApp
								</a>
							)}
							{onFavoriteToggle && (
								<button
									onClick={() => handleClick(biz.id)}
									disabled={isLoading === biz.id}
									className="mt-2 block w-full flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									title={favorites?.has(biz.id) ? "Favoritos" : "Favoritar"}
								>
									{isLoading === biz.id ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Star className={`w-4 h-4 ${favorites?.has(biz.id) ? "fill-yellow-500 text-yellow-500" : "hover:fill-yellow-500 hover:text-yellow-500"}`} />
									)}
									{favorites?.has(biz.id) ? "Favoritos" : "Favoritar"}
								</button>
							)}	
						</div>
					</Popup>
				</Marker>
			))}
		</>
	);
};

const SourceMap = ({ favorites, onFavoriteToggle, initialCoords }) => {
	const { api, isAuthenticated } = useApp();
	const [center, setCenter] = useState(initialCoords || null);
	const [loadingLocation, setLoadingLocation] = useState(false);
	const [error, setError] = useState(null);
	const [userRegion, setUserRegion] = useState(null);
	const [isMobile, setIsMobile] = useState(false);
	const [businesses, setBusinesses] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("Todas");
	const [radius, setRadius] = useState(5);
	const [loadingBusinesses, setLoadingBusinesses] = useState(false);
	const [recenterFlag, setRecenterFlag] = useState(0);

	// Obter localização pelo ip
	const getLocationByIp = useCallback(async () => {
		try {
			const { data } = await api.get("/api/location/my-ip");
			if (data.success && data.city) {
				return {
					city: data.city,
					state: data.region,
					lat: data.latitude || data.lat,
					lon: data.longitude || data.lon,
				};
			}
			return null;
		} catch {
			return null;
		}
	}, [api]);

    const fetchRef = useRef(null);
	// Busca de Comércios Próximos
	const fetchNearbyBusinesses = useCallback(async (lat, lon, radiusKm) => {
		fetchRef.current?.abort();
		const controller = new AbortController();
		fetchRef.current = controller;
		setLoadingBusinesses(true);
		try {
			const { data } = await api.get("/api/business/nearby", {
				params: { lat, lon, radius: radiusKm },
				signal: controller.signal,
			});
			if (data.success) setBusinesses(data.businesses);
		} catch (error) {
			if (error.name !== "CanceledError") setBusinesses([]);
		} finally {
			setLoadingBusinesses(false);
		}
	}, [api]);

	// Botão Tentar Localização ip
	const handleAllowLocation = useCallback(async () => {
		setLoadingLocation(true);
		setError(null);

		try {
			// IP location
			const ipInfo = await getLocationByIp();
			if (ipInfo) {
				// Center map + fetch businesses
				setCenter([ipInfo.lat, ipInfo.lon]);
				setUserRegion({ city: ipInfo.city, state: ipInfo.state });
				await fetchNearbyBusinesses(ipInfo.lat, ipInfo.lon, radius);
			} else {
				setError("Não foi possível determinar sua localização. Tente novamente");
			}
		} catch {
			setError("Erro ao obter localização. Tente novamente.");
		} finally {
			setLoadingLocation(false);
		}
	}, [getLocationByIp, fetchNearbyBusinesses, radius]);

    useEffect(() => () => fetchRef.current?.abort(), []);

	useEffect(() => {
		if (center) {
			fetchNearbyBusinesses(center[0], center[1], radius);
		}
	}, [radius, center]);

	// Função para controlar Recenter
	const handleRecenter = useCallback(() => {
		if (center) {
			setRecenterFlag((prev) => prev + 1);
		}
	}, [center]);


	const [localFavorites, setLocalFavorites] = useState(new Set());

	// Função para add/rem favoritos no mapa Home
	const handleLocalToggle = useCallback(async (businessId) => {
		if (!isAuthenticated) {
			infoToast("favorite-login", "Faça login para favoritar comércios");
			return;
		}

		try {
			if (localFavorites.has(businessId)) {
				await api.delete(`/api/favorite/remove/${businessId}`);
				setLocalFavorites(prev => { 
					const n = new Set(prev); 
					n.delete(businessId); 
					return n; 
				});
			} else {
				await api.post("/api/favorite/add", { businessId });
				setLocalFavorites(prev => new Set(prev).add(businessId));
			}
		} catch {
			toast.error("Erro ao atualizar favorito");
		}
	}, [api, isAuthenticated, localFavorites]);

	useEffect(() => {
		if (onFavoriteToggle !== undefined) return;
		if (!isAuthenticated) return;

		api.get("/api/favorite/user")
			.then(({ data }) => {
				if (data.success) setLocalFavorites(new Set(data.favorites.map(f => f.id)));
			})
			.catch(() => {});
	}, [api, isAuthenticated, onFavoriteToggle]);

	const resolvedFavorites = favorites ?? localFavorites;
	const resolvedOnToggle = onFavoriteToggle ?? handleLocalToggle;

	useEffect(() => {
		setIsMobile(window.innerWidth < 768);
	}, []);

	// Estado de carregamento inicial
	if (loadingLocation) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 py-16 px-4">
				<div className="text-center">
					<Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />

					<p className="text-gray-500 dark:text-gray-400">Obtendo sua Localização...</p>
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
				<p className="text-red-500 font-semibold">Localização indisponível</p>

				<p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm">{error}</p>

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

	const filteredBusinesses = selectedCategory === "Todas" ? businesses : businesses.filter((b) => b.category === selectedCategory);

	// Estado mapa carregado
	if (center) {
		return (
			<div className="w-full">
				{userRegion && <LocalSearch userRegion={userRegion} setCenter={setCenter} />}
				<div className="flex flex-wrap items-center gap-3 mb-3">
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="Filtrar por categoria"
					>
						<option value="Todas">Todas Categorias</option>
						{businesses_categories_filter.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>

					<select
						value={radius}
						onChange={(e) => {
							setRadius(Number(e.target.value));
						}}
						className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
						aria-label="Raio de busca"
					>
						<option value={1}>1 Km</option>
						<option value={2}>2 Km</option>
						<option value={5}>5 Km</option>
						<option value={10}>10 Km</option>
						<option value={20}>20 Km</option>
					</select>

					<button
						onClick={handleRecenter}
						className="mt-auto px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1"
						aria-label="Centralizar mapa"
					>
						<MapPin className="w-4 h-4" />
						Centralizar
					</button>

					{loadingBusinesses && <Loader2 className="w-4 h-4 animate-spin text-blue-500 ml-auto" />}
				</div>

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

						<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

						<Marker position={center}>
							<Popup>Você está Aqui</Popup>
						</Marker>

						<Circle
							center={center}
							radius={radius * 1000}
							pathOptions={{
								color: "#2563eb",
								fillColor: "#2563eb",
								fillOpacity: 0.15,
							}}
						/>

						<BusinessMarkers 
							businesses={filteredBusinesses} 
							center={center} 
							onRecenter={recenterFlag} 
							favorites={resolvedFavorites} 
							onFavoriteToggle={resolvedOnToggle}
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
				<p className="text-gray-700 dark:text-gray-200 text-lg font-semibold mb-2">Descubra comércios próximos</p>
				<p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">Ative sua localização para encontrar negócios e serviços perto de você</p>

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
