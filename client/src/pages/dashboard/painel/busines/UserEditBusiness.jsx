import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../../../controllers/AppContext";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, MapPin, Phone, Save, Smartphone, Store, Tag, Upload, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const business_categories = [
    "Alimentação", "Artesanato", "Beleza", "Consultoria", "Educação", "Moda", "Saúde", "Serviços", "Tecnologia", "Outro"
];

const DraggableMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) { setPosition([e.latlng.lat, e.latlng.lng]); },
    });
    return position ? <Marker position={position} draggable={true} /> : null;
};

const UserEditBusiness = () => {
    const { businessId } = useParams();
    const { api } = useApp();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const cancelledRef = useRef(false);

    useEffect(() => {
        cancelledRef.current = false;

        const fetchBusiness = async () => {
            try {
                const { data } = await api.get(`/api/business/${businessId}`);
                if (cancelledRef.current) return;

                if (data.success) {
                    const b = data.business;
                    setName(b.name ?? "");
                    setCategory(b.category ?? "");
                    setDescription(b.description ?? "");
                    setPhone(b.phone ?? "");
                    setWhatsapp(b.whatsapp ?? "");
                    setImagePreview(b.image ?? "");
                    setAddress(b.address ?? "");
                    setLatitude(b.latitude ?? null);
                    setLongitude(b.longitude ?? null);
                } else {
                    toast.error("Comércio não encontrado");
                    navigate("/dashboard/list-business");
                }
            } catch (error) {
                if (error.name === 'CanceledError') return;
                toast.error(error.response?.data?.message || "Erro ao carregar comércio");
                navigate("/dashboard/list-business");
            } finally {
                if (!cancelledRef.current)
                setIsLoading(false);
            }
        };
        fetchBusiness();

        return () => {
            cancelledRef.current = true;
        };
    }, [businessId, api, navigate]);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!name.trim()) {
                toast.error("O nome do comércio é obrigatório");
                return;
            }
            if (!category) {
                toast.error("Selecione uma categoria");
                return;
            }
            if (latitude === null || longitude === null) {
                toast.error("Marque a localização no mapa");
                return;
            }
            setIsSaving(true);

            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("description", description);
            formData.append("category", category);
            formData.append("phone", phone);
            formData.append("whatsapp", whatsapp);
            formData.append("address", address);
            formData.append("latitude", String(latitude));
            formData.append("longitude", String(longitude));
            if (image) formData.append("image", image);

            const { data } = await api.put(`/api/business/${businessId}`, formData);

            if (data.success) {
                toast.success(data.message || "Comércio atualizado com sucesso!");
                navigate("/dashboard/list-business");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        navigate("/dashboard/list-business");
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
        );
    }
    return (
        <form onSubmit={onSubmitHandler} className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200 min-h-full">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-10">
                <div className="bg-white dark:bg-gray-800 w-full p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Editar Comércio
                        </h2>
                    </div>
                    <div className="space-y-6">
                        {/* Imagem */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Imagem de Capa
                            </label>
                            <label htmlFor="image" className="block cursor-pointer">
                                {image ? (
                                    <div className="relative group">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-full h-40 sm:h-48 object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">Clique para alterar</span>
                                        </div>
                                    </div>
                                ) : imagePreview ? (
                                    <div className="relative group">
                                        <img
                                            src={imagePreview}
                                            alt="Imagem atual"
                                            className="w-full h-40 sm:h-48 object-cover rounded-xl"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">Clique para alterar</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <Upload className="w-10 h-10 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Clique ṕara fazer upload (opcional)
                                        </span>
                                    </div>
                                )}
                                <input
                                    onChange={(e) => setImage(e.target.files[0])}
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    className="hidden"
                                />
                            </label>
                        </div>
                        
                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nome do Comércio
                            </label>
                            <input
                                type="text"
                                placeholder="Digite o nome do Comércio"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                title="Nome do Comércio"
                            />
                        </div>
                        
                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            <textarea
                                placeholder="Descreva seu comércio (opcional)"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                title="Descrição"
                            />
                        </div>

                        {/* Categoria + WhatsApp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Categoria
                                </label>
                                <select
                                    onChange={(e) => setCategory(e.target.value)}
                                    value={category}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all cursor-pointer"
                                >
                                    <option value="" disabled>Selecionar</option>
                                    {business_categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    placeholder="(11) 91234-5678"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    value={whatsapp}
                                    title="Adicionar WhatsApp"
                                />
                            </div>
                        </div>
                        {/* Telefone + Endereço */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="(11) 3333-4444"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    title="Adicionar Telefone"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rua, Número, Bairro..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}
                                    title="Adicionar Endereço"
                                />
                            </div>
                        </div>
                        {/* Mapa */}
                        <div>
                            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Localização no Mapa
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Clique no mapa para ajustar a localização do comércio
                            </p>
                            <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                                <MapContainer
                                    center={latitude !== null ? [latitude, longitude] : [-23.5505, -46.6333]}
                                    zoom={13}
                                    className="w-full h-full"
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <DraggableMarker
                                        position={latitude !== null ? [latitude, longitude] : null}
                                        setPosition={([lat, lng]) => { setLatitude(lat); setLongitude(lng); }}
                                    />
                                </MapContainer>
                            </div>
                            {latitude !== null && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Lat: {Number(latitude).toFixed(4)}, Lng: {Number(longitude).toFixed(4)}
                                </p>
                            )}
                        </div>
                        {/* Botão */}
                        <div className="flex flex-row justify-center items-center gap-4 pt-4 w-full">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-auto p-4 sm:px-6 sm:py-4 border border-gray-800 dark:border-gray-400 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors font-semibold flex items-center justify-center gap-2"
                                title="Salvar"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Salvar
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="w-auto p-4 sm:px-6 sm:py-4 border border-gray-800 dark:border-gray-400 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 transition-colors font-semibold flex items-center justify-center gap-2"
                                title="Cancelar"
                            >
                                <X className="w-5 h-5" />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
export default UserEditBusiness;
