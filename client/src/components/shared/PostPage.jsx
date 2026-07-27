import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useApp } from "@/controllers/AppContext";
import toast from "react-hot-toast";
import { Calendar, User, MessageSquare, Send, ArrowLeft, Image as ImageIcon, Tag } from "lucide-react";
import moment from "moment";
import { post_categories } from "@/hooks/useCategory";

const PostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, user, isAuthenticated } = useApp();

    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const cancelledRef = useRef(false);
    const abortControllerRef = useRef(null);


    const fetchPostData = useCallback(async (signal) => {
            try {
                const response = await api.get(`/api/post/published/${id}`, { signal });
                if (response.data.success) {
                    return response.data.post;
                } else {
                    toast.error(response.data.message);
                    return null;
                }
            } catch (error) {
                if (error.name === 'CanceledError') {
                    return null;
                }
                console.error("Post error:", error);
                return null;
            }
    }, [api, id]);

    const fetchComments = useCallback(async (signal) => {
            try {
                const response = await api.get(`/api/comment/post/${id}`, { signal });
                if (response.data.success) {
                    return response.data.comments;
                }
                return [];
            } catch (error) {
                if (error.name === 'CanceledError') {
                    return null;
                }
                console.error("Comments error:", error);
                return [];
            }
    }, [api, id]);

    useEffect(() => {
        cancelledRef.current = false;
        abortControllerRef.current = new AbortController();
        
        const loadData = async () => {
            try {
                const [postData, fetchedComments] = await Promise.all([
                    fetchPostData(abortControllerRef.current.signal), 
                    fetchComments(abortControllerRef.current.signal)
                ]);

                if (cancelledRef.current) return;

                if (postData) setData(postData);
                if (fetchedComments) setComments(fetchedComments);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        return () => {
            cancelledRef.current = true;
            abortControllerRef.current?.abort();
        };
    }, [fetchPostData, fetchComments]);

    const addComment = useCallback(async (e) => {
        e.preventDefault();
        
        if (cancelledRef.current) return;

        if (!isAuthenticated || !user) {
            navigate("/login");
            return;
        }

        if (!content.trim()) {
            toast.error("O comentário não pode estar vazio");
            return;
        }

        if (isSubmitting) return;

        setIsSubmitting(true);
 
        try {
            const { data } = await api.post("/api/comment/add", { 
                post: id, 
                name: user.name,
                content,
                author: user.id
            });
            
            if (cancelledRef.current) return;

            if (data.success) {
                toast.success(data.message);
                setContent("");
                setComments(prev => [...prev, data.comment]);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (cancelledRef.current) return;
            toast.error(error.response?.data?.message || "Erro ao conectar com o servidor");
        } finally {
            setIsSubmitting(false);
        };
    }, [api, id, user, isAuthenticated, content, isSubmitting, navigate]);

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="flex items-center justify-center h-[50vh]">
                    {/* ADICIONAR LOADING */}
                    <h1>SEM POST</h1>
                </div>
                <Footer />
            </div>
        );
    }

    const datePost = moment(data.created_at).format("DD/MM/YYYY");
    const isLoggedIn = isAuthenticated;

    // Define a cor da categoria
    const category = post_categories.find(
        category => category.name === data.category
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar />
            
            <article className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
                <button 
                    onClick={() => navigate("/")}
                    className="mt-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full hover:opacity-90 transition-all inline-flex items-center gap-2 mb-8 font-medium min-h-[48px]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </button>

                <header className="mb-10 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span 
                            title={`Postado em: ${datePost}`}
                            className="inline-flex py-2 gap-1 text-sm font-medium"
                        >
                            <Calendar className="w-4 h-4" />
                            {datePost}
                        </span>

                        <span 
                            title={category.name}
                            className="inline-flex py-2 gap-1 text-sm font-medium"
                        >
                            <Tag className="w-4 h-4" />
                            {category.name}
                        </span>

                        {data.author_name && (
                            <span 
                                title={`Por: ${data.author_name}`}
                                className="inline-flex py-2 gap-1 text-sm font-medium"
                            >
                                <User className="w-4 h-4" />
                                Por: <span className="font-medium">{data.author_name}</span>
                            </span>
                        )}
                    </div>
                    
                    <h1 
                       title={data.title}
                       className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
                    >
                        {data.title}
                    </h1>
                    
                    {data.sub_title && (
                        <p
                            title={data.sub_title}
                            className="text-lg text-gray-600 dark:text-gray-400 mb-6"
                        >
                            {data.sub_title}
                        </p>
                    )}
                </header>

                {data.image ? (
                    <figure className="mb-12 rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-lg">
                        <img 
                            src={data.image} 
                            alt={data.title}
                            className="w-full" 
                        />
                    </figure>
                ) : (
                    <figure className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 h-64 sm:h-96 flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                    </figure>
                )}

                <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-300 dark:border-gray-700">

                    <div
                        title="Descrição"
                        className="prose-content max-w-none mb-16 text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:dark:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:dark:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:dark:text-white [&_p]:text-gray-600 [&_p]:dark:text-gray-300 [&_a]:text-blue-600 [&_a]:dark:text-blue-400 [&_a]:underline [&_strong]:font-semibold [&_strong]:text-gray-900 [&_strong]:dark:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-gray-600 [&_ul]:dark:text-gray-300 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:text-gray-600 [&_ol]:dark:text-gray-300 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:dark:border-gray-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:dark:text-gray-400 [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                </section>

                <section className="mb-12 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-300 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-8">
                        <MessageSquare className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                            {comments.length} Comentários
                        </h2>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                        {comments.length === 0 ? (
                            <div className="text-center py-8">
                                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    Nenhum comentário ainda. Seja o primeiro a comentar!
                                </p>
                            </div>
                        ) : (
                            comments.map((comment, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-3">
                                        {comment.user_image ? (
                                            <img src={comment.user_image} alt="" className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <img src={assets.user_icon} alt="" className="w-10 h-10" />
                                        )}
                                        <div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {comment.name}
                                            </span>
                                            <p className="text-xs text-gray-400">
                                                {datePost}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 pl-13">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={addComment} className="max-w-xl">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-lg">
                            Adicionar comentário
                        </h3>
                        <div className="space-y-4">
                            {isLoggedIn && user ? (
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    {user.image && (
                                        <img 
                                            src={user.image} 
                                            alt={user.name} 
                                            className="w-10 h-10 rounded-full pointer-events-none" 
                                        />
                                    )}
                                    <span>Comentar como: <span className="font-medium text-gray-900 dark:text-white">{user.name}</span></span>
                                </div>
                            ) : isLoggedIn ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <button 
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                    >
                                        Complete seu cadastro
                                    </button> 
                                    {" "}para comentar
                                </p>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <button 
                                        type="button"
                                        onClick={() => navigate("/login")}
                                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                    >
                                        Faça login
                                    </button> 
                                    {" "}para comentar
                                </p>
                            )}
                            
                            <textarea 
                                placeholder="Adicione um comentário..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                disabled={!isLoggedIn}
                                className="w-full px-4 py-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 h-15 resize-none transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!isLoggedIn}
                                className={`px-6 py-3 font-medium rounded-full shadow-lg transition-all inline-flex items-center gap-2 ${
                                    isLoggedIn 
                                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90" 
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                }`}
                                title={isLoggedIn ? "Enviar" : "Enviando" }
                            >
                                <Send className="w-4 h-4" />
                                {isLoggedIn ? "Enviar" : "Faça login para comentar"}
                            </button>
                        </div>
                    </form>
                </section>
            </article>
            <Footer />
        </div>
    );
};

export default PostPage;