import { useEffect, useState } from "react";
import { MapPin, Store, X } from "lucide-react";

const KEY = "geolocalis_welcome_seen_v1";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch { setOpen(true); }
  }, []);
  if (!open) return null;
  const close = (remember = true) => {
    try { 
        if (remember) localStorage.setItem(KEY, "1"); 
    } catch {
        // Empty block statement
    }
    setOpen(false);
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Boas-vindas ao GeoLocalis"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
      onClick={() => close(true)}>
      <div onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bem-vindo ao GeoLocalis</h2>
          <button onClick={() => close(true)} aria-label="Fechar boas-vindas" title="Fechar"
            className="p-2 rounded-full min-w-[44px] min-h-[44px] bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* contraste AA: gray-900/white no light, white/gray-900 no dark — mesmo padrão da Navbar */}
        <ul className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <li className="flex gap-2"><MapPin className="w-5 h-5 text-blue-500" /> Toque em "Usar minha localização" para ver comércios perto de você.</li>
          <li className="flex gap-2"><Store className="w-5 h-5 text-orange-500" /> Toque na estrela para salvar favoritos e no WhatsApp para falar com o vendedor.</li>
        </ul>
        <button onClick={() => close(true)}
          className="mt-6 w-full min-h-[48px] rounded-xl font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90"
          aria-label="Começar a usar" title="Começar">Começar a usar</button>
        <button onClick={() => close(false)}
          className="mt-2 w-full min-h-[44px] text-sm text-gray-500 dark:text-gray-400 hover:underline"
          aria-label="Mostrar de novo depois" title="Depois">Mostrar de novo depois</button>
      </div>
    </div>
  );
}