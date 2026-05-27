import { assets } from "../assets/assets";
import { Mail, Phone, Link } from "lucide-react";
import { useApp } from "../controllers/AppContext";
import { useTheme } from "../controllers/ThemeContext";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const { api } = useApp();
    const { darkMode, ThemeToggle } = useTheme();

    
    const categories = ["Startup", "Tecnologia", "Negócios", "Inovação"];
    
    const contact = [
        { label: "playzlukaz@gmail.com", href: "mailto:playzlukaz@gmail.com" },
        { label: "+55 (11) 99999-9999", href: "tel:+5511999999999" }
    ];
    
    const social = [
        { icon: assets.instagram_icon, href: "https://www.instagram.com/lucas.glsantos/", label: "Instagram" },
        { icon: assets.linkedin_icon, href: "https://www.linkedin.com/in/lucasglsantos/", label: "LinkedIn" },
        { icon: assets.github_icon, href: "https://www.github.com/lucas-glsantos/", label: "GitHub" }
    ];

    return (
        <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 dark:from-gray-900/50 to-transparent -z-10" />
            
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="lg:col-span-1">
                        <img
                            src={assets.geolocalis} 
                            alt="Logo" 
                            className="w-28 sm:w-28 cursor-pointer"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                            Seu Blog de publicação pessoal. Conectando pessoas a comunidades atráves de Tecnologia.
                        </p>
                        <div className="flex gap-3">
                            {social.map((item, index) => (
                                <a 
                                    key={index}
                                    href={item.href}
                                    aria-label={item.label}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <img src={item.icon} alt={item.label} className="w-10 h-10 dark:invert" />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            Categorias
                        </h3>
                        <ul className="space-y-3">
                            {categories.map((item, index) => (
                                <li key={index}>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                                        {item}
                                        <Link className="w-3 h-3" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                            Contato
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href={contact[0].href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {contact[0].label}
                                </a>
                            </li>
                            <li>
                                <a href={contact[1].href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {contact[1].label}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        © {currentYear} Lucas Santos. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Feito com
                        </span>
                        <span className="text-red-500">♥</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            usando React + Tailwind
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;