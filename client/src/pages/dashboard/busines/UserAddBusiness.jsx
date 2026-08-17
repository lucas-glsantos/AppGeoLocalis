import { useEffect, useMemo, useState } from "react";
import { Edit3, Home, Loader2, MapPin, Phone, Send, Smartphone, Store, Tag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useApp } from "@/controllers/AppContext";
import { business_categories } from "@/hooks/useCategory";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useBusinessForm } from "@/hooks/useBusinessForm";
import { validateBusinessForm } from "@/utils/business/validation";
import BusinessLocationMap from "@/components/business/BusinessLocationMap";
import ImageUploader from "@/components/business/form/ImageUploader";
import TextInput from "@/components/business/form/TextInput";
import TextArea from "@/components/business/form/TextArea";
import SelectInput from "@/components/business/form/SelectInput";
import { FALLBACK_CENTER } from "@/constants/location";
import LoadingScreen from "@/components/shared/loader/LoadingScreen";

const UserAddBusiness = () => {
    const { api } = useApp();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [existingBusiness, setExistingBusiness] = useState(null);
    const [formErrors, setFormErrors] = useState(null);

    const {
        values,
        setField,
        imagePreview,
        setImageFile,
        reset,
        buildAddFormData,
    } = useBusinessForm();

    const { userCoords } = useUserLocation(api, {
        onLocated: ({ lat, lon }) => {
            setField("latitude", lat);
            setField("longitude", lon);
        },
    });

    const handleField = (key) => (value) => {
        setField(key, value);
        setFormErrors((prev) => (prev && prev[key] ? { ...prev, [key]: undefined } : prev));
    };

    const handlePositionChange = ({ lat, lng }) => {
        setField("latitude", lat);
        setField("longitude", lng);
        setFormErrors((prev) => (prev ? { ...prev, location: undefined } : prev));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const { errors, isValid } = validateBusinessForm(values);
        setFormErrors(errors);
        if (!isValid) {
            toast.error(Object.values(errors).find(Boolean));
            return;
        }

        setIsAdding(true);
        try {
            const { data } = await api.post("/api/business/add", buildAddFormData());
            if (data.success) {
                toast.success(data.message);
                reset();
            } else {
                toast.error(data.message);
            }
            navigate("/dashboard/list-business");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleCancel = (cancel) => {
        cancel.preventDefault();
        navigate("/dashboard/list-business");
    };

    useEffect(() => {
        const checkExisting = async () => {
            try {
                const { data } = await api.get("/api/business/user");
                if (data.success && data.businesses.length > 0) {
                    setExistingBusiness(data.businesses[0]);
                }
            } catch (error) {
                toast.error(error.response?.data.message || error.message);
            } finally {
                setIsLoading(false);
            }
        };
        checkExisting();
    }, [api]);

    const mapSection = useMemo(
        () => (
            <BusinessLocationMap
                center={userCoords || FALLBACK_CENTER}
                latitude={values.latitude}
                longitude={values.longitude}
                onPositionChange={handlePositionChange}
                showCurrentLocation={true}
                error={formErrors?.location}
            />
        ),
        [userCoords, values.latitude, values.longitude, formErrors, handlePositionChange]
    );

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (existingBusiness) {
        return (
            <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 justify-items-center text-center shadow-lg border border-gray-300 dark:border-gray-700">
                        <Store className="w-16 h-16 text-blue-500 dark:text-blue-400 mb-4" aria-hidden="true" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Comércio já cadastrado
                        </h2>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {existingBusiness.name}
                        </p>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-6">
                            É permitido apenas um comércio por usuário. Caso queira fazer alterações, edite o existente.
                        </p>

                        <div className="flex flex-row justify-center gap-4 pt-4 w-full">
                            <button
                                onClick={() => navigate(`/dashboard/edit-business/${existingBusiness.id}`)}
                                disabled={isAdding}
                                className="mt-5 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Editar Comércio"
                            >
                                <Edit3 className="w-4 h-4" />
                                Editar
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                disabled={isAdding}
                                className="mt-5 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Voltar"
                                aria-label="Voltar"
                            >
                                <Home className="w-4 h-4" />
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={onSubmitHandler} className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200 min-h-full">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-10">
                <div className="bg-white dark:bg-gray-800 w-full p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Store className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Cadastrar Comércio
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {/* Imagem */}
                        <ImageUploader preview={imagePreview} onSelect={setImageFile} />

                        {/* Nome */}
                        <TextInput
                            label="Nome do Comércio"
                            value={values.name}
                            onChange={handleField("name")}
                            placeholder="Digite o nome do comércio"
                            required
                            title="Nome do Comércio"
                            error={formErrors?.name}
                        />

                        {/* Descrição */}
                        <TextArea
                            label="Descrição"
                            value={values.description}
                            onChange={handleField("description")}
                            placeholder="Descreva seu comércio (opcional)"
                            title="Descrição"
                        />

                        {/* Categoria + WhatsApp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SelectInput
                                label="Categoria"
                                icon={Tag}
                                value={values.category}
                                onChange={handleField("category")}
                                options={business_categories}
                                error={formErrors?.category}
                            />
                            <TextInput
                                label="WhatsApp"
                                icon={Phone}
                                type="tel"
                                value={values.whatsapp}
                                onChange={handleField("whatsapp")}
                                placeholder="(11) 91234-5678"
                                title="Adicionar WhatsApp"
                            />
                        </div>

                        {/* Telefone + Endereço */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TextInput
                                label="Telefone"
                                icon={Smartphone}
                                type="tel"
                                value={values.phone}
                                onChange={handleField("phone")}
                                placeholder="(11) 3333-4444"
                                title="Adicionar Telefone"
                            />
                            <TextInput
                                label="Endereço"
                                icon={MapPin}
                                value={values.address}
                                onChange={handleField("address")}
                                placeholder="Rua, Número, Bairro..."
                                title="Adicionar Endereço"
                            />
                        </div>

                        {/* Mapa */}
                        {mapSection}

                        {/* Botões */}
                        <div className="flex flex-row justify-center items-center gap-4 pt-4 w-full">
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="mt-5 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cadastrar Comércio"
                                aria-label="Cadastrar Comércio"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cadastrando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Cadastrar
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isAdding}
                                className="mt-5 px-6 py-3 bg-red-500 text-white dark:bg-red-600 dark:text-white rounded-xl hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Cancelar"
                                aria-label="Cancelar"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserAddBusiness;