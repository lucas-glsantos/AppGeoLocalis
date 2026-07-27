import { ImageIcon, Tag, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { post_categories } from "@/hooks/useCategory";

// Componente interno (PostCard)
const PostCard = ({ post }) => {
    const { title, image, id, author_name } = post;
    const navigate = useNavigate();


    // Define a cor da categoria
    const category = post_categories.find(
        categorys => categorys.name === post.category
    );

    return (
        <article
            onClick={() => navigate(`/post/${id}`)}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
        >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                {image ? (
                    <img 
                        src={image}
                        alt={title}
                        title={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 
                    className="font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" 
                    title={title}
                >
                    {title || "Sem título"}
                </h3>
                <span
                    title={category.name}
                    className={`inline-flex gap-2 px-2 py-2 text-xs font-medium rounded-xl mb-3 ${category.color}`} 
                >
                    <Tag className="w-3 h-3" />
                    {category.name || "Tudo"}
                </span>
                {author_name && (
                    <div 
                        title={`Por: ${author_name}`}
                        className="flex items-center gap-2 px-2 text-xs text-gray-500 dark:text-white mb-3"
                    >
                        <User className="w-3 h-3" />
                        <span>Por: 
                            <span className="font-medium">
                                {author_name}
                            </span>
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
};

export default PostCard;