import { assets } from "../assets/assets";
import { Mail, Phone, Link } from "lucide-react";
import { useApp } from "../controllers/AppContext";
import { useTheme } from "../controllers/ThemeContext";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const { api } = useApp();
    const { darkMode, ThemeToggle } = useTheme();

    
    const categories = ["Tudo", "Tecnologia", "Startup", "Finanças", "Lifestyle"];
    
    const contact = [
        { label: "playzlukaz@gmail.com", href: "mailto:playzlukaz@gmail.com" },
        { label: "+55 (11) 99999-9999", href: "tel:+5511999999999" }
    ];
    
    const social = [
        { icon: assets.instagram_icon, href: "https://www.instagram.com/lucas.glsantos/", label: "Instagram" },
        { icon: assets.linkedin_icon, href: "https://www.linkedin.com/in/lucasglsantos/", label: "LinkedIn" },
        { icon: assets.github_icon, href: "https://github.com/lucas-glsantos/AppGeoLocalis", label: "GitHub" }
    ];

    return (
        <footer className="relative bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 dark:from-gray-900/50 to-transparent -z-10" />
                <div className="flex-1 gap-4 p-4">
                    <div className="grid grid-cols-1">
                
                        <div className="flex items-center justify-left">
                            <img
                                src={assets.geolocalis} 
                                title="Logo" 
                                className="w-28 sm:w-28"
                            />
                        </div>
                        <h3 className="flex items-center justify-left text-semibold text-gray-500 dark:text-gray-300 mb-6">
                            Seu Blog de publicação pessoal. Conectando pessoas a comunidades atráves de Tecnologia.
                        </h3>
                        <div className="flex items-center justify-left gap-5 px-4">
                            <h3 className="flex items-center justify-left text-semibold text-gray-500 dark:text-gray-300">
                                Siga-nos
                            </h3>

                            {social.map((item, index) => (
                                <a 
                                    key={index}
                                    href={item.href}
                                    aria-label={item.label}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <img src={item.icon} alt={item.label} className="w-8 h-8 dark:invert" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                Categorias
                            </h3>
                            <ul className="space-y-3">
                                {categories.map((item, index) => (
                                    <li key={index}>
                                        <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1">
                                            <Link className="w-3 h-3" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Comunidade
                            </h3>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Contato
                            </h3>
                            <ul className="space-y-3">
                                <li>
                                    <a href={contact[0].href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        {contact[0].label}
                                    </a>
                                </li>
                                <li>
                                    <a href={contact[1].href} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {contact[1].label}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                Sobre a plataforma
                            </h3>
                        </div>
                    </div>
                
                <div className="mt-6 pt-10 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-center items-center gap-3">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        © {currentYear} <span className="p-1 font-bold text-gray-500 dark:text-gray-300">GeoLocalis.</span> Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;