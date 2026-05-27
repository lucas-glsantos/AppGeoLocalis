import { useApp } from "../../../controllers/AppContext";
import toast from "react-hot-toast";
import { CheckCircle, Trash2, Calendar, User, MessageSquare, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment";


const CommentTableItem = ({ comment, fetchComments, isCard }) => {
    const { content, name, created_at, is_approved, user_image, post_title } = comment;
    const CommentDate = moment(created_at).format("DD/MM/YYYY");

    const { api } = useApp();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const approveComment = async (commentId) => {
        try {
            const { data } = await api.put(`/api/comment/approve/${commentId}`);
            if (data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openConfirmModalDelete = (commentId) => {
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCommentToDelete(null);
    };

    const deleteComment = async () => {
        if (!commentToDelete) return;

        try {
            const { data } = await api.delete(`/api/comment/${commentToDelete}`);
            if (data.success) {
                toast.success(data.message);
                fetchComments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            closeDeleteModal();
        }
    };

    useEffect(() => {
        if (!showDeleteModal) return;

        const handleClickOutside = (e) => {
            if (e.target === e.currentTarget) {
                closeDeleteModal();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDeleteModal]);

    const DeleteModal = () => (
        showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Confirmar Exclusão
                            </h3>
                        </div>
                        <button onClick={closeDeleteModal} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Você tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={closeDeleteModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={deleteComment}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    const CommentContent = () => (
        <div className="flex items-start gap-3 mb-3">
            {user_image ? (
                <img src={user_image} alt={name} className="w-10 h-10 rounded-full" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        is_approved 
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                        {is_approved ? "Aprovado" : "Pendente"}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {CommentDate}
                </div>
            </div>
        </div>
    );

    const ActionButtons = ({ fullWidth = false }) => (
        <div className={`flex items-center gap-2 ${fullWidth ? '' : ''}`}>
            {!is_approved ? (
                <button 
                    onClick={() => approveComment(comment.id)} 
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium border border-green-200 dark:border-green-800 rounded-xl cursor-pointer text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors ${fullWidth ? 'w-full' : ''}`}
                >
                    <CheckCircle className="w-4 h-4" />
                    Aprovar
                </button>
            ) : (
                <div className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl ${fullWidth ? 'w-full' : ''}`}>
                    <CheckCircle className="w-4 h-4" />
                    Aprovado
                </div>
            )}
            <button 
                onClick={() => openConfirmModalDelete(comment.id)} 
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium border border-red-200 dark:border-red-800 rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${fullWidth ? 'w-full' : ''}`}
            >
                <Trash2 className="w-4 h-4" />
                Excluir
            </button>
        </div>
    );

    if (isCard) {
        return (
            <>
                <DeleteModal />
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <CommentContent />
                    {post_title && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                            <MessageSquare className="w-4 h-4" />
                            <span className="truncate">Em: {post_title}</span>
                        </div>
                    )}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                        {content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <ActionButtons fullWidth />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DeleteModal />
            <tr className="border-y border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3 mb-2">
                        {user_image ? (
                            <img src={user_image} alt={name} className="w-8 h-8 rounded-full" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        <span className="font-medium text-gray-800 dark:text-gray-200">{name}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 pl-11">{content}</p>
                    {post_title && (
                        <div className="flex items-center gap-1 mt-2 pl-11 text-xs text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-3 h-3" />
                            Post: {post_title}
                        </div>
                    )}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {CommentDate}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        {!is_approved ? (
                            <button 
                                onClick={() => approveComment(comment.id)} 
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-green-200 dark:border-green-800 rounded-full cursor-pointer text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Aprovar
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-green-200 dark:border-green-800 rounded-full text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="w-4 h-4" />
                                Aprovado
                            </div>
                        )}
                        <button 
                            onClick={() => openConfirmModalDelete(comment.id)} 
                            className="p-2 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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