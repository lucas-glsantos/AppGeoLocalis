// Componente reutilização para estados de carregamento
import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-900 transition-colors duration-300">
            <Loader2 className="w-8 h-8 text-blue-500  animate-spin" /> 
        </div>
    );
}
