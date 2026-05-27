import { FileText, Loader2, ImageIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Componente interno (PostCard)
const PostCard = ({ post }) => {
    const { title, description, category, image, id, author_name } = post;
    const navigate = useNavigate();

    const post_categories = ["Tudo", "Tecnologia", "Startup", "Finanças", "Lifestyle"];

    const categoryColors = {
        "Tudo": "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        "Startup": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "Tecnologia": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        "Finanças": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        "Lifestyle": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };

    const colorClass = categoryColors[category];

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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="p-5">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${colorClass}`}>
                    {category || "Tudo"}
                </span>

                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {title || "Sem título"}
                </h3>

                {author_name && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white mb-3">
                        <User className="w-3 h-3" />
                        <span>Por: <span className="font-medium">{author_name}</span></span>
                    </div>
                )}

                <p className="text-sm text-gray-500 dark:text-white line-clamp-2">
                    {description 
                        ? description.replace(/<[^>]*>/g, "").slice(0, 80)
                        : "Descrição não disponível..."
                    }
                </p>
            </div>
        </article>
    );
};

export default PostCard;