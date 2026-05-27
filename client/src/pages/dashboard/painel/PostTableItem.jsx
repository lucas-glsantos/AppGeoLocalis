import { useEffect, useState, useCallback, useRef } from "react";
import { useApp } from "../../../controllers/AppContext";
import moment from "moment";
import toast from "react-hot-toast";
import { Edit3, Trash2, Eye, EyeOff, Calendar, FileText, AlertTriangle, X } from "lucide-react";


const PostTableItem = ({ post, fetchPosts, index, isCard }) => {
    const { title, created_at, is_published, image } = post;

    const PostDate = moment(created_at).format("DD/MM/YYYY");

    const { api, fetchPosts: fetchPublicPosts } = useApp();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const cancelledRef = useRef(false);

    const openConfirmModalDelete = (postId) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setPostToDelete(null);
    };

    const deletePost = async () => {
        if (!postToDelete) return;

        try {
            const { data } = await api.delete(`/api/post/delete/${postToDelete}`);
            if (data.success) {
                toast.success(data.message);
                fetchPosts();
                fetchPublicPosts();
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
                        Você tem certeza que deseja excluir este Post? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={closeDeleteModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={deletePost}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors"
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    const togglePublish = async () => {
        try {
            const { data } = await api.put(`/api/post/toggle-publish/${post.id}`);
            if (data.success) {
                toast.success(data.message);
                await fetchPosts();
                await fetchPublicPosts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (isCard) {
        return (
            <>
            <DeleteModal />
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                    {image && (
                        <img src={image} alt={title} className="w-16 h-16 rounded-xl object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3" />
                            {PostDate}
                        </div>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                            is_published 
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}>
                            {is_published ? "Publicado" : "Arquivado"}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button 
                        onClick={togglePublish} 
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {is_published ? (
                            <>
                                <EyeOff className="w-4 h-4" />
                                Arquivar
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4" />
                                Publicar
                            </>
                        )}
                    </button>
                    <button 
                        onClick={() => openConfirmModalDelete(post.id)} 
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm border border-red-200 dark:border-red-800 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
        <tr className="border-y border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <th className="px-6 py-4 text-gray-600 dark:text-gray-300">{index}</th>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {image && (
                        <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    )}
                    <span className="font-medium text-gray-800 dark:text-gray-200 max-w-xs truncate">{title}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {PostDate}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    is_published 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                }`}>
                    {is_published ? "Publicado" : "Arquivado"}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={togglePublish} 
                        className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={is_published ? "Arquivar" : "Publicar"}
                    >
                        {is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button 
                        onClick={() => openConfirmModalDelete(post.id)} 
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

export default PostTableItem;