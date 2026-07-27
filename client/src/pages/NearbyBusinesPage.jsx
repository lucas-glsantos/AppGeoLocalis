import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, List, Store, Search, X, MapPin, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

import { useApp } from "@/controllers/AppContext";
import LocalMap from "@/components/shared/maps/LocalMap";
import BusinessCard from "@/components/BusinessCardPage";
import PublicLayout from "@/components/layout/PublicLayout";
import { business_categories } from "@/hooks/useCategory";
import { infoToast } from "@/hooks/useInfoToast";



const Nearby = () => {
  const { api, isAuthenticated } = useApp();
  const [businesses, setBusinesses] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  const [viewMode, setViewMode] = useState("lista");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  // Ao montar, Obtém IP Location + businesses próximos
  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        // IP location
        const locRes = await api.get("/api/location/my-ip", { signal: controller.signal });
        if (!locRes.data.success) throw new Error("Localização não encontrada");

        const lat = Number(locRes.data.latitude ?? locRes.data.lat);
        const lon = Number(locRes.data.longitude ?? locRes.data.lon);

        if (isNaN(lat) || isNaN(lon)) throw new Error("Coordenadas inválidas");

        setUserCoords([lat, lon]);

        // Nearby businesses
        const bizRes = await api.get("/api/business/nearby", {
          params: { lat, lon, radius: 10 },
          signal: controller.signal
        });

        if (bizRes.data.success) {
          setBusinesses(bizRes.data.businesses);
        }
      } catch (error) {
        console.error("Erro ao carregar comércios próximos:", error)
        if (error.name === "AbortError") return; 
        setError("Não foi possível carregar comércios próximos.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => controller.abort();
  }, [api]);

  // Carrega Favoritos do Usuário Logado
  useEffect(() => {
    if (!isAuthenticated) return;
    const controller = new AbortController();
    api.get("/api/favorite/user", { signal: controller.signal })
      .then(({ data }) => {
        if (data.success) setFavorites(new Set(data.favorites.map((f) => f.id)));
      })
      .catch((error) => {
        if (error.name !== "CanceledError") console.error("Erro ao Carregar favoritos:", error);
      });
    return () => controller.abort();
  }, [api, isAuthenticated]);

  // Toggle favoritar
  const handleFavoriteToggle = useCallback(async (businessId) => {
    if (!isAuthenticated) {
      infoToast("favorite-login", "Faça login para favoritar comércios");
      return;
    }

    let wasFavoriteRef = false;
    setFavorites((prevFavorites) => {
      const wasFavorite = prevFavorites.has(businessId)
      wasFavoriteRef = wasFavorite;
      const next = new Set(prevFavorites);
      if (wasFavorite) next.delete(businessId);
      else next.add(businessId);
      return next;
    });

    try {
      if (wasFavoriteRef) await api.delete(`/api/favorite/remove/${businessId}`);
      else await api.post("/api/favorite/add", { businessId });
    } catch (error) {
      // Rollback usa wasFavoriteRef capturado
      setFavorites((prev) => {
        const next = new Set(prev);
        if (wasFavoriteRef) next.add(businessId);
        else next.delete(businessId);
        return next;
      });
      console.error("Erro ao atualizar favorito", error);
      toast.error("Erro ao atualizar favorito");
    }
  }, [api, isAuthenticated]);

  // Memoizar derivados
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchName = business.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = selectedCategory === "Todas" || business.category === selectedCategory;
      return matchName && matchCategory;
    });
  }, [businesses, searchQuery, selectedCategory]);

  // Contador para badges
  const businessCount = filteredBusinesses.length;

  const tabs = [
    { id: "lista", label: "Lista", icon: List, count: businessCount },
    { id: "mapa", label: "Mapa", icon: MapPin, count: businessCount },
  ];

  // Render
  return (
    <PublicLayout>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Comércios Próximos
            </h1>
            <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
              {businessCount} {businessCount === 0 ? 'comércio' : 'comércios'}
            </span>
          </div>

          {/* Tabs: Lista e Mapa */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === tab.id 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"  
                }`}
              > 
               <tab.icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  viewMode === tab.id 
                    ? "bg-white/20" 
                    : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" aria-label="Carregando cómercios próximos..." />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 justify-items-center text-center shadow-lg border border-gray-300 dark:border-gray-700">
              <Store className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Nenhum comércio próximo disponível
              </h3>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-5 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px]"
                title="Tentar novamente"
                aria-label="Tentar novamente"
              >
                <RefreshCcw className="w-4 h-4" />
                Tentar novamente
              </button>
            </div>
          )}

          {/* Success State */}
          {!loading && !error && (
            <>
              {/* Search Filter */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar comércio..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  { (business_categories || []).map((categories) => (
                    <option key={categories} value={categories}>
                      {categories}
                    </option>
                  ))}
                </select>
              </div>

              {viewMode === "lista" ? (
                // Lista
                filteredBusinesses.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum comércio encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map((business) => (
                      <BusinessCard 
                        key={business.id} 
                        business={business} 
                        isFavorited={favorites.has(business.id)} 
                        onFavoriteToggle={handleFavoriteToggle} 
                      />
                    ))}
                  </div>
                )
              ) : (
                // Mapa
                <div className="h-[500px] rounded-2xl overflow-hidden shadow-md">
                  {userCoords && (
                    <LocalMap 
                      center={userCoords} 
                      businesses={filteredBusinesses}
                      favorites={favorites} 
                      onFavoriteToggle={handleFavoriteToggle} 
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Nearby;
