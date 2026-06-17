import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../../controllers/AppContext";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FileText, Loader2, Save, Tag, Upload, X } from "lucide-react";
import { post_categories } from "../../../assets/assets";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const QUILL_MODULES = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
    ],
};

const UserEditPost = () => {
    const { postId } = useParams();
    const { api, fetchPosts } = useApp();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [category, setCategory] = useState("");
    const [isPublished, setIsPublished] = useState(false);

    const modules = useMemo(() => QUILL_MODULES, []);
    const cancelledRef = useRef(false);

    useEffect(() => {
        cancelledRef.current = false;

        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/api/post/${postId}`);
                if (cancelledRef.current) return;

                if (data.success) {
                    const p = data.post;
                    setTitle(p.title ?? "");
                    setSubTitle(p.sub_title ?? "");
                    setDescription(p.description ?? "");
                    setCategory(p.category ?? "");
                    setImagePreview(p.image ?? "");
                    setIsPublished(p.is_published ?? false);
                } else {
                    toast.error("Post não encontrado");
                    navigate("/dashboard/list-post");
                }
            } catch (error) {
                if (error.name === 'CanceledError') return;
                toast.error(error.response?.data?.message || "Erro ao carregar post");
                navigate("/dashboard/list-post");
            } finally {
                if (!cancelledRef.current)
                setIsLoading(false);
            }
        };
        fetchPost();

        return () => {
            cancelledRef.current = true;
        };
    }, [postId, api, navigate]);

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!title.trim()) {
                toast.error("O título é obrigatório");
                return;
            }
            if (!description.replace(/<[^>]*>/g, "").trim()) {
                toast.error("A descrição não pode estar vazia");
                return;
            }
            
            setIsSaving(true);

            const post = {
                title: title.trim(),
                subTitle: subTitle.trim(),
                description,
                category,
                is_published: isPublished,
            };

            const formData = new FormData();
            formData.append("post", JSON.stringify(post));
            if (image) formData.append("image", image);

            const { data } = await api.put(`/api/post/edit/${postId}`, formData);

            if (data.success) {
                toast.success(data.message || "Post atualizado com sucesso!");
                await fetchPosts();
                navigate("/dashboard/list-post");
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
        navigate("/dashboard/list-post");
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
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Editar Post
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
                                            Clique para fazer upload (opcional)
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
                        
                        {/* Título */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Título
                            </label>
                            <input
                                type="text"
                                placeholder="Digite o título do post"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                title="Título"
                            />
                        </div>

                        {/* Subtítulo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subtítulo
                            </label>
                            <input
                                type="text"
                                placeholder="Digite o subtítulo (opcional)"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 rounded-xl transition-all"
                                onChange={(e) => setSubTitle(e.target.value)}
                                value={subTitle}
                                title="Subtítulo"
                            />
                        </div>

                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descrição
                            </label>
                            <div className="h-64 sm:h-80 pb-16 sm:pb-10 relative [&_.ql-editor]:min-h-[200px] [&_.ql-container]:text-base bg-gray-100 dark:bg-gray-700/50">
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={setDescription}
                                    modules={modules}
                                    placeholder="Escreva o conteúdo do post..."
                                    className="h-full"
                                />
                            </div>
                        </div>

                        {/* Categoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Categoria
                            </label>
                            <select 
                                onChange={(e) => setCategory(e.target.value)} 
                                value={category}
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 rounded-xl transition-all cursor-pointer"
                            >
                                <option value="" disabled>Selecionar</option>
                                {post_categories.filter(c => c !== "All").map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Publicado */}
                        <div className="flex items-center gap-3 p-4 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                            <input 
                                type="checkbox" 
                                checked={isPublished} 
                                id="publish" 
                                className="w-5 h-5 rounded cursor-pointer accent-blue-600" 
                                onChange={(e) => setIsPublished(e.target.checked)} 
                            />
                            <label 
                                htmlFor="publish" 
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                                Publicado
                            </label>
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
export default UserEditPost;
