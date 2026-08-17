import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Phone, Save, Smartphone, Store, Tag, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useApp } from "@/controllers/AppContext";
import { business_categories } from "@/hooks/useCategory";
import { useBusinessForm } from "@/hooks/useBusinessForm";
import { validateBusinessForm } from "@/utils/business/validation";
import BusinessLocationMap from "@/components/business/BusinessLocationMap";
import ImageUploader from "@/components/business/form/ImageUploader";
import TextInput from "@/components/business/form/TextInput";
import TextArea from "@/components/business/form/TextArea";
import SelectInput from "@/components/business/form/SelectInput";
import LoadingScreen from "@/components/shared/loader/LoadingScreen";

const UserEditBusiness = () => {
    const { businessId } = useParams();
    const { api } = useApp();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState(null);

    const {
        values,
        setField,
        imagePreview,
        setImageFile,
        setImagePreview,
        populate,
        buildEditFormData,
    } = useBusinessForm();

    const cancelledRef = useRef(false);

    useEffect(() => {
        cancelledRef.current = false;

        const fetchBusiness = async () => {
            try {
                const { data } = await api.get(`/api/business/${businessId}`);
                if (cancelledRef.current) return;

                if (data.success) {
                    populate(data.business);
                    setImagePreview(data.business.image ?? "");
                } else {
                    toast.error("Comércio não encontrado");
                    navigate("/dashboard/list-business");
                }
            } catch (error) {
                if (error.name === "CanceledError") return;
                toast.error(error.response?.data?.message || "Erro ao carregar comércio");
                navigate("/dashboard/list-business");
            } finally {
                if (!cancelledRef.current) setIsLoading(false);
            }
        };
        fetchBusiness();

        return () => {
            cancelledRef.current = true;
        };
    }, [businessId, api, navigate, populate, setImagePreview]);

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

        setIsSaving(true);
        try {
            const { data } = await api.put(`/api/business/${businessId}`, buildEditFormData());
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

    const handleCancel = (cancel) => {
        cancel.preventDefault();
        navigate("/dashboard/list-business");
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <form onSubmit={onSubmitHandler} className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-200 min-h-full">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-10">
                <div className="bg-white dark:bg-gray-800 w-full p-4 sm:p-6 lg:p-8 shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <Store className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Editar Comércio
                        </h2>
                    </div>
                    <div className="space-y-6">
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
                        <BusinessLocationMap
                            center={[values.latitude, values.longitude]}
                            latitude={values.latitude}
                            longitude={values.longitude}
                            onPositionChange={handlePositionChange}
                            showCurrentLocation={false}
                            readOnly={isSaving}
                            error={formErrors?.location}
                        />

                        {/* Botões */}
                        <div className="flex flex-row justify-center items-center gap-4 pt-4 w-full">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="mt-5 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 justify-center font-medium min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Salvar"
                                aria-label="Salvar"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Salvar
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
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

export default UserEditBusiness;