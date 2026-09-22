import { useEffect, useState } from "react";
import { MapPin, Star, Store, X } from "lucide-react";
import { assets } from "@/assets/assets";

const welcomeKey = "geolocalis_welcome_seen_v1";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(welcomeKey)) setOpen(true);
    } catch { 
        setOpen(true); 
    }
  }, []);
  if (!open) return null;
  const close = (remember = true) => {
    try { 
        if (remember) localStorage.setItem(welcomeKey, "1"); 
    } catch {
        // Empty block statement
    }
    setOpen(false);
  };

    // Logo GeoLocalis
    const LogoGeoLocalis = () => (
        <img
            className="w-25 pointer-events: none" 
            src={assets.geolocalis} 
            aria-label="Logo GeoLocalis"
            title="GeoLocalis" 
        />
    );
  return (
    <>
    <div 
        role="dialog" 
        aria-modal="true" 
        aria-label="Boas-vindas ao GeoLocalis"
        className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60"
        onClick={() => close(true)}
    >
      
        <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl p-6"
        >
        
            <div className="flex items-center justify-center gap-4">
                <h2 className="text-lg ml-auto font-bold text-gray-900 dark:text-white">
                    Bem-vindo ao <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-700 dark:from-blue-700 dark:to-sky-500">GeoLocalis</span>
                </h2>
                <button 
                    onClick={() => close(true)} 
                    aria-label="Fechar boas-vindas" 
                    title="Fechar"
                    className="p-2 rounded-full ml-auto bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:opacity-80 outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center justify-center">
                <LogoGeoLocalis />
            </div>


        <ul className="justify-center mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <li className="flex gap-2">
                <MapPin className="w-5 h-5 text-blue-500" /> 
                Toque em "Usar minha localização" para ver comércios perto de Você
            </li>
            <li className="flex gap-2">
                <Store className="w-5 h-5 text-orange-500" />
                Clique <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> para favoritar Comércios
            </li>
        </ul>

        <button 
            onClick={() => close(true)}
            className="mt-6 w-full min-h-11 rounded-full font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Começar a usar"
            title="Começar a usar"
        >
            Começar a usar
        </button>
        <button
            onClick={() => close(false)}
            className="mt-3 w-full min-h-11 rounded-full font-medium text-gray-500 dark:text-gray-400 hover:underline hover:text-blue-500 outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Mostrar depois" 
            title="Mostrar depois"
        >
            Mostrar depois
        </button>
      </div>
    </div>
    </>
  );
}