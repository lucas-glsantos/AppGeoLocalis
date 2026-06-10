import { useApp } from "../../../../controllers/AppContext";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Briefcase, Loader2, MapPin, Phone, Send, Tag, Upload } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

const business_categories = [
    "Alimentação", "Artesanato", "Beleza", "Consultoria", "Educação", "Moda", "Saúde", "Serviços", "Tecnologia", "Tudo"
];

const DraggableMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) { setPosition([e.latlng.lat, e.latlng.lng]); },
    });
    return position ? <Marker position={position} draggable={true} /> : null; 
};

const UserAddBusiness = () => {
    const { api } = useApp();
    const [isAdding, setIsAdding] = useState(false);

    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [phone, setPhone] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [address, setAddress] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const resetForm = () => {
        setImage(null); 
        setName(""); 
        setDescription("");
        setCategory(""); 
        setPhone(""); 
        setWhatsapp("");
        setAddress(""); 
        setLatitude(null); 
        setLongitude(null);
    };

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

            setIsAdding(true);

            const business = { 
                name: name.trim(), 
                description, 
                category, 
                phone, 
                whatsapp, 
                address, 
                latitude, 
                longitude 
            };

            const formData = new FormData();
            formData.append("business", JSON.stringify(business));
            if (image) formData.append("image", image);

            const { data } = await api.post("/api/business/add", formData);

            if (data.success) {
                toast.success(data.message);
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200 min-h-full">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-10">
                <div className="bg-white dark:bg-gray-800 w-full p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Cadastrar Comércio
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Imagem */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Foto
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
                                            <span className="text-white text-sm font-medium">
                                                Clique para alterar
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <Upload className="w-10 h-10 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Foto do comércio (opcional)
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
                                placeholder="Ex: Padaria Pão Gostoso" required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 rounded-xl transition-all"
                                onChange={(e) => setName(e.target.value)} 
                                value={name}
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
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                onChange={(e) => setDescription(e.target.value)} 
                                value={description}
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
                                    value={category} required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all cursor-pointer"
                                >
                                    <option value="" disabled>
                                        Selecionar
                                    </option>
                                    {business_categories.map((cat) => (
                                        <option 
                                            key={cat} 
                                            value={cat}
                                        >
                                            {cat}
                                        </option>
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
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    value={whatsapp}
                                />
                            </div>
                        </div>

                        {/* Telefone + Endereço */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="(11) 3333-4444"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Endereço
                                </label>
                                <input
                                    type="text"
                                    placeholder="Rua, Número, Bairro..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                    onChange={(e) => setAddress(e.target.value)}
                                    value={address}
                                />
                            </div>
                        </div>

                        {/* Mapa */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">

                                <MapPin className="w-4 h-4" />
                                Localização no Mapa
                            </label>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Clique no mapa para marcar onde seu comércio está localizado
                            </p>
                            <div className="h-[300px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                                <MapContainer
                                    center={[-23.5505, -46.6333]}
                                    zoom={13}
                                    className="w-full h-full"
                                    scrollWheelZoom={true}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <DraggableMarker
                                        position={latitude !== null ? [latitude, longitude] : null}
                                        setPosition={([lat, lng]) => { setLatitude(lat); setLongitude(lng); }}
                                    />
                                </MapContainer>
                            </div>
                            {latitude !== null && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
                                </p>
                            )}
                        </div>

                        {/* Botão */}
                        <button
                            type="submit"
                            disabled={isAdding}
                            className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl cursor-pointer font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAdding ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Cadastrar Comércio
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserAddBusiness;