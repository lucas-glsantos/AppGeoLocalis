import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/controllers/AppContext";
import { CheckCircle, Trash2, Calendar, User, MessageSquare, AlertTriangle, X, Archive, CircleFadingPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";


const CommentTableItem = ({ comment, fetchComments, isCard }) => {
    const { api } = useApp();
    const { id, content, name, user_image, created_at, is_approved, is_archived, post_title } = comment;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const CommentDate = moment(created_at).format("DD/MM/YYYY");
    
    // Função Toggle Alternar Status comentário (Arquivado <-> Aprovado)
    const toggleStatus = useCallback(async () => {
        try {
            setIsLoading(true);

            const { data } = await api.put(`/api/comment/toggle-status/${id}`);

            if (data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (error.name !== 'CanceledError') return;
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    }, [api, id]);


    useEffect(() => {
        const controller = new AbortController();

        fetchComments(controller.signal);

        return () => controller.abort();
    }, [fetchComments])

    // Função Deletar Comentário
    const deleteComment = async () => {
        setIsLoading(true);

        try {
            const { data } = await api.delete(`/api/comment/${id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchComments();
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

    const getStatusComment = () => {
        if (is_approved)
            return { label: "Aprovado", style: "bg-green-200 text-green-500 dark:bg-green-500/30 dark:text-green-400" };
        if (is_archived)
            return { label: "Arquivado", style: "bg-yellow-200 text-yellow-500 dark:bg-yellow-500/30 dark:text-yellow-400" };
        return { label: "Pendente", style: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400" };
    };

    const status = getStatusComment();
    const isApproved = is_approved;
    const statusIcon = isApproved ? Archive : CheckCircle;
    const statusLabel = isApproved ? "Arquivar" : "Aprovar";

    const StatusIcon = statusIcon;
    
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
                        Excluir este <span className="font-medium text-gray-900 dark:text-white">"Comentário"?</span> Esta ação não pode ser desfeita.
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
                            onClick={deleteComment}
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

    const commentDate = (
        <div 
            className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400"
            title="Data"
        
        >
            <Calendar className="w-4 h-4" />
            {CommentDate}
        </div>
    );

    const postRef = post_title && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
            <p className="truncate">
                Comentado em: <span className="font-semibold" title="Título">{post_title}</span>
            </p>
        </div>
    );

    const actionBtn = (
        <button
            onClick={toggleStatus}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isApproved
                ? "hover:bg-yellow-600 hover:text-white hover:border-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-white dark:hover:border-yellow-600"
                : "hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600"
            }`}
            title={statusLabel}
        >
            <StatusIcon className="w-4 h-4" />
            {statusLabel}
        </button>
    );

    const deleteBtn = (
        <button
            onClick={() => setShowDeleteModal(true)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-400 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:border-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Excluir"
        >
            <Trash2 className="w-4 h-4" />
            Excluir
        </button>
    );

    if (isCard) {
        return (
            <>
                <DeleteModal />
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-300 dark:border-gray-700">
                    <div className="flex items-start gap-4 mb-3">
                        {user_image ? (
                            <img
                                src={user_image}
                                alt={name}
                                className="w-10 h-10 rounded-full object-cover"
                                title="Imagem"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0" title="User">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                                <span className="font-semibold text-gray-900 dark:text-white" title="Nome">
                                    {name}
                                </span>
                            </div>
                            {commentDate}

                            <p className="text-xs flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400" title="Status">
                                <CircleFadingPlus className="w-4 h-4" />
                                Status:
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${status.style}`}>
                                    {status.label}
                                </span>
                            </p>
                        </div>
                    </div>
                    {postRef}

                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center p-3 mb-4 gap-2" title="Comentário">
                        <MessageSquare className="w-4 w-4" />
                        {content}
                    </p>
                    
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-300 dark:border-gray-700">
                        {actionBtn}
                        {deleteBtn}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DeleteModal />
            <tr className="border-y border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3 mb-2">
                        {user_image ? (
                            <img
                                src={user_image}
                                alt={name}
                                className="w-10 h-10 rounded-full object-cover"
                                title="Imagem"
                            />
                        ): (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0" title="Imagem">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                        )}

                        <div>
                            <span className="font-semibold text-gray-900 dark:text-white" title="Nome">
                                {name}
                            </span>
                        </div>
                    </div>
                    {postRef}
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center p-3 mb-4 gap-2" title="Comentário">
                        <MessageSquare className="w-4 w-4" />
                        {content}
                    </p>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2" title="Data">
                        <Calendar className="w-4 h-4" />
                        {CommentDate}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.style}`} title="Status">
                        {status.label}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleStatus}
                            disabled={isLoading}
                            className={`p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isApproved
                                ? "hover:bg-yellow-600 hover:text-white hover:border-yellow-600 dark:hover:bg-yellow-600 dark:hover:text-white dark:hover:border-yellow-600"
                                : "hover:bg-green-600 hover:text-white hover:border-green-600 dark:hover:bg-green-600 dark:hover:text-white dark:hover:border-green-600"
                            }`}
                            title={statusLabel}
                        >
                            <StatusIcon className="w-4 h-4" />
                        </button>

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
};

export default CommentTableItem;