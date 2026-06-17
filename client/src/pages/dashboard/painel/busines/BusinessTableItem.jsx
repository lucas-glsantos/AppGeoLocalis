import { Trash2, MapPin, AlertTriangle, X, Edit3, Calendar, Tag, Phone, CircleFadingPlus, Loader2 } from "lucide-react";
import moment from "moment";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useApp } from "../../../../controllers/AppContext";
import { useNavigate } from "react-router-dom";


const BusinessTableItem = ({ business, fetchBusinesses, index, isCard }) => {
    const { api } = useApp();
    const { name, category, whatsapp, is_active, image, latitude, longitude, created_at } = business;
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const BusinessDate = moment(created_at).format("DD/MM/YYYY");
    const navigate = useNavigate();

    // Função Deletar Business
    const deleteBusiness = async () => {
        setIsLoading(true);

        try {
            const { data } = await api.delete(`/api/business/${business.id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchBusinesses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
        }
    };

    useEffect(() => {
        if (!showDeleteModal) return;

        const handleClickOutside = (e) => {
            if (e.target === e.currentTarget)
                setShowDeleteModal(false);
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDeleteModal]);

    const getStatusBusiness = () => {
        if (is_active)
            return { label: "Ativo", style: "bg-green-200 text-green-500 dark:bg-green-500/30 dark:text-green-400" };
        else
            return { label: "Inativo", style: "bg-gray-200 text-gray-500 dark:bg-gray-500/30 dark:text-gray-400" };
    };

    const status = getStatusBusiness();

    const DeleteModal = () => (
        showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-200 dark:bg-red-900/30">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Confirmar Exclusão
                            </h3>
                        </div>

                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Excluir comércio <span className="font-medium text-gray-900 dark:text-white">"{name}"?</span> Esta ação não pode ser desfeita.
                    </p>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>

                        <button
                            onClick={deleteBusiness}
                            disabled={isLoading}
                            className="px-4 py-2 gap-2 flex items-center text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    if (isCard) {
        return (
            <>
                <DeleteModal />
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-300 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                        {image &&
                            <img
                                src={image}
                                alt={name}
                                className="w-16 h-16 rounded-xl object-cover"
                                title="Imagem"
                            />
                        }
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate" title="Comércio">
                                {name}
                            </h3>

                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400" title="Data">
                                <Calendar className="w-4 h-4" />
                                {BusinessDate}
                            </div>

                            <p className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400" title="Categoria">
                                <Tag className="w-4 h-4" />
                                {category}
                            </p>
                            {whatsapp &&
                                <p className="mt-2">
                                    <a
                                        href={`https://wa.me/55${whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-xs hover:underline cursor-pointer text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-500 transition-colors"
                                        title="WhatsApp"
                                    >
                                        <Phone className="w-4 h-4" />
                                        <span className="font-medium">{whatsapp}</span>
                                    </a>
                                </p>
                            }
                            <p className="text-xs flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400" title="Status">
                                <CircleFadingPlus className="w-4 h-4" />
                                Status:
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.style}`}>
                                    {status.label}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => navigate(`/dashboard/edit-business/${business.id}`)}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors"
                            title="Editar"
                        >
                            <Edit3 className="w-4 h-4" />
                            Editar
                        </button>

                        <a
                            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors"
                            title="Ver no Mapa"
                        >
                            <MapPin className="w-4 h-4" />
                            Mapa

                        </a>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 transition-colors"
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DeleteModal />
            <tr className="border-y border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <th className="px-6 py-4 text-gray-600 dark:text-gray-300">
                    {index}
                </th>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        {image &&
                            <img
                                src={image}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover"
                                title="Imagem"
                            />
                        }
                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs" title="Comércio">
                            {name}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400" title="Data">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {BusinessDate}
                    </div>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400" title="Categoria">
                    {category}
                </td>
                <td className="px-6 py-4">
                    {whatsapp ?
                        <a
                            href={`https://wa.me/55${whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:underline cursor-pointer text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-500 transition-colors"
                            title="WhatsApp"
                        >
                            {whatsapp}
                        </a>
                        :
                        '-'
                    }
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.style}`} title="Status">
                        {status.label}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/dashboard/edit-business/${business.id}`)}
                            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Editar"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>

                        <a
                            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Ver no mapa"
                        >
                            <MapPin className="w-4 h-4" />
                        </a>

                        <button
                            onClick={() => setShowDeleteModal(true)}
                            disabled={isLoading}
                            className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Excluir"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        </>
    );
}


export default BusinessTableItem;