import { MapContainer, useMap, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { Loader2, Tag, MapPinned, Phone, Star } from "lucide-react";

import { useApp } from "../../../controllers/AppContext";
import { useIsMobile } from "@/hooks/useIsMobile";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
	iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

const MapController = ({ center }) => {
	const map = useMap();
	useEffect(() => {
		if (center) map.flyTo(center, 13, { duration: 1.5 });
	}, [center, map]);
	return null;
};

// Subcomponente para renderizar marcadores de cómercios próximos
const BusinessMarkers = ({ businesses, favorites, onFavoriteToggle }) => {
	const { api } = useApp();
	const sessionId = useRef(localStorage.getItem("metrics_sid") || crypto.randomUUID());
	const [isLoading, setIsLoading] = useState(null);

	useEffect(() => {
		localStorage.setItem("metrics_sid", sessionId.current);
	}, []);

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
					eventHandlers={{
						popupopen: () => {
							api.post("/api/metrics/view", {
								businessId: biz.id,
								sessionId: sessionId.current,
							})
							.catch(() => {});
						},
					}}
					icon={L.divIcon({
						className: "custom-business-marker",
						html: biz.image
							? `<div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
									<div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3); background-image:url('${biz.image}'); background-size: cover; background-position: center; background-color: #f97316;"></div>
									<span style="background:rgba(0, 0, 0, 0.05); color: black; font-size: 10px; padding: 1px 4px; border-radius: 4px; max-width: 80px; overflow: hidden; text-oveflow: ellipsis; white-space: nowrap; text-align: center;">${biz.name}</span>
								</div>`
							: `<div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
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
							{biz.distance !== null && biz.distance !== undefined && (
								<p className="flex items-center gap-2 mt-2 text-sm text-gray-600" title="Distância">
									<MapPinned className="w-4 h-4" />
									{biz.distance.toFixed(2)} Km de distância
								</p>
							)}
							{biz.whatsapp && (
								<a
									onClick={() => {
										api.post("/api/metrics/click", {
											businessId: biz.id,
											sessionId: sessionId.current,
										}).catch(() => {});
									}}
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
										<Star className={`w-4 h-4 ${favorites?.has(biz.id) ? "fill-yellow-500 text-yellow-500" : ""}`} />
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

const SourceMap = ({ center, businesses, favorites, onFavoriteToggle }) => {
	const isMobile = useIsMobile();

	useEffect(() => {
		document.querySelector('.leaflet-container')?.style.setProperty('isolation', 'isolate');
	}, []);

	return (
		<div className="w-full h-full">
			<MapContainer
				center={center}
				zoom={13}
				scrollWheelZoom={!isMobile}
				dragging={true}
				className="w-full h-full rounded-2xl overflow-hidden shadow-md"
				aria-label="Mapa de Comércios Locais"
			>
				<MapController center={center} />

				<TileLayer
					attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Marker position={center}>
					<Popup>Você está Aqui</Popup>
				</Marker>

				<Circle
					center={center}
					radius={5000}
					pathOptions={{
						color: "#2563eb",
						fillColor: "#2563eb",
						fillOpacity: 0.15,
					}}
				/>

				<BusinessMarkers
					businesses={businesses}
					favorites={favorites}
					onFavoriteToggle={onFavoriteToggle}
				/>
			</MapContainer>
		</div>
	);
};

export default SourceMap;
