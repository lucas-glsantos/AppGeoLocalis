import { useCallback, useEffect, useState } from "react";
import { useApp } from "../controllers/AppContext";
import LocalMap from "../components/LocalMap";
import Footer from "../components/Footer";
import BusinessCard from "../components/BusinessCard";
import { Loader2, List, Store, Search, X, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { infoToast } from "../assets/infoToast";
import { mainNavItems } from "./dashboard/PublicLayout";
import PublicLayout from "./dashboard/PublicLayout";

const Nearby = () => {
  const { api, isAuthenticated } = useApp();
  const [businesses, setBusinesses] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [viewMode, setViewMode] = useState("list"); // "list" | "map"
  const [userCoords, setUserCoords] = useState(null);

  const categories = ["Todas", "Alimentação", "Artesanato", "Beleza", "Consultoria", "Educação", "Moda", "Saúde", "Serviços", "Tecnologia", "Outro"];

  // Ao montar, Obtém IP Location + businesses próximos
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        // IP location
        const locRes = await api.get("/api/location/my-ip");
        if (cancelled) return;
        if (!locRes.data.success) throw new Error("Localização não encontrada");

        const lat = Number(locRes.data.latitude ?? locRes.data.lat);
        const lon = Number(locRes.data.longitude ?? locRes.data.lon);

        if (isNaN(lat) || isNaN(lon)) throw new Error("Coordenadas inválidas");

        setUserCoords([lat, lon]);

        // Nearby businesses
        const bizRes = await api.get("/api/business/nearby", {
          params: { lat, lon, radius: 10 },
        });

        if (cancelled) return;
        if (bizRes.data.success) {
          setBusinesses(bizRes.data.businesses);
        }
      } catch (error) {
        if (!cancelled) setError("Não foi possível carregar comércios próximos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
  }, [api]);

  // Se Logado, carrega favoritos
  useEffect(() => {
    if (!isAuthenticated) return;
    const controller = new AbortController();
    api
      .get("/api/favorite/user", { signal: controller.signal })
      .then(({ data }) => {
        if (data.success) setFavorites(new Set(data.favorites.map((f) => f.id)));
      })
      .catch((error) => {
        if (error.name !== "CanceledError") console.error(error);
      });
    return () => controller.abort();
  }, [api, isAuthenticated]);

  // Toggle favoritar
  const handleFavoriteToggle = useCallback(
    async (businessId) => {
      if (!isAuthenticated) {
        infoToast("favorite-login", "Faça login para favoritar comércios");
        return;
      }

      try {
        if (favorites.has(businessId)) {
          await api.delete(`/api/favorite/remove/${businessId}`);
          setFavorites((prev) => {
            const n = new Set(prev);
            n.delete(businessId);
            return n;
          });
        } else {
          await api.post("/api/favorite/add", { businessId });
          setFavorites((prev) => new Set(prev).add(businessId));
        }
      } catch (error) {
        toast.error("Erro ao atualizar favorito");
      }
    },
    [api, isAuthenticated, favorites],
  );

  // Filtro local
  const filtered = businesses.filter((b) => {
    const matchName = b.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "Todas" || b.category === category;
    return matchName && matchCategory;
  });

  // Render
  return (
    <PublicLayout
      items={[...mainNavItems]}
    >
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Store className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Comércios Próximos</h1>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar comércio..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
            />

            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs: Lista | Mapa */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
          >
            <List className="w-4 h-4" />
            Lista
          </button>

          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === "map" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
          >
            <MapPin className="w-4 h-4" />
            Mapa
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && 
          <div className="text-center py-20 text-red-500">
            {error}
          </div>}

        {/* Content */}
        {!loading &&
          !error &&
          (viewMode === "list" ? (
            filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <Store className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum comércio encontrado</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} isFavorited={favorites.has(biz.id)} onFavoriteToggle={handleFavoriteToggle} />
                ))}
              </div>
            )
          ) : (
            <div className="h-[500px] rounded-2xl overflow-hidden shadow-md">
              {userCoords && <LocalMap initialCoords={userCoords} favorites={favorites} onFavoriteToggle={handleFavoriteToggle} />}
            </div>
          ))}
      </main>
      <Footer />
    </div>
    </PublicLayout>
  );
};

export default Nearby;
