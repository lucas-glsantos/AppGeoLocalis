import { MapPin, Phone, ImageIcon, Tag, MapPinned, Star, Loader2 } from "lucide-react";
import { memo, useRef, useState, useEffect } from "react";
import { useApp } from "../controllers/AppContext";

const BusinessCard = memo(({ business, isFavorited, onFavoriteToggle }) => {
	const { id, name, category, image, whatsapp, city, state, distance } = business;

	const { api } = useApp();
	const [isLoading, setIsLoading] = useState(false);
	const cardRef = useRef(null);
	const sessionId = useRef(localStorage.getItem("metrics_sid") || crypto.randomUUID());

	// Persistir sessionId
	useEffect(() => {
		localStorage.setItem("metrics_sid", sessionId.current);
	}, []);

	// IntersectionObserver dispara view quando card aparece na tela
	useEffect(() => {
		const el = cardRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					api.post("/api/metrics/view", {
						businessId: id,
						sessionId: sessionId.current,
					})
					.catch(() => {});
					observer.disconnect(); // Dispara apenas 1 vez
				}
			},
			{ threshold: 0.3 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [api, id]);

	const handleClick = async () => {
		if (isLoading) return;
		setIsLoading(true);

		try {
			await onFavoriteToggle?.(id);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<article
			ref={cardRef}
			className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-gray-300 dark:border-gray-700"
		>
			{/* Imagem 4:3 */}
			<div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
				{image ? (
					<img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" title="Imagem" />
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
						<ImageIcon className="w-12 h-12 text-gray-400" />
					</div>
				)}
			</div>

			<div className="p-5">
				{/* Nome */}
				<h3 className="font-semibold text-gray-900 dark:text-white truncate" title="Comércio">
					{name}
				</h3>

				{/* Categoria badge*/}
				<p className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400" title="Categoria">
					<Tag className="w-4 h-4" />
					{category}
				</p>

				{/* Distância */}
				{distance !== null && distance !== undefined && (
					<p className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400" title="Distância">
						<MapPinned className="w-4 h-4" />
						{distance.toFixed(2)} Km de distância
					</p>
				)}

				{/* Cidade */}
				{(city || state) && (
					<p className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400" title="Cidade">
						<MapPin className="w-4 h-4" />
						{city}
						{city && state ? " - " : ""}
						{state}
					</p>
				)}

				{/* Botões */}
				<div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					{/* Favoritar */}
					<button
						onClick={handleClick}
						disabled={isLoading}
						className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						title={isFavorited ? "Favoritos" : "Favoritar"}
					>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Star className={`w-4 h-4 ${isFavorited ? "fill-yellow-500 text-yellow-500" : "hover:fill-yellow-500 hover:text-yellow-500"}`} />
						)}
						{isFavorited ? "Favoritos" : "Favoritar"}
					</button>

					{/* WhatsApp */}
					{whatsapp && (
						<a
							onClick={() => {
								api.post("/api/metrics/click", {
									businessId: id,
									sessionId: sessionId.current,
								})
								.catch(() => {});
							}}
							href={`https://wa.me/55${whatsapp.replace(/\D/g, "")}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							title="WhatsApp"
						>
							<Phone className="w-4 h-4" />
							WhatsApp
						</a>
					)}
				</div>
			</div>
		</article>
	);
});

export default BusinessCard;
