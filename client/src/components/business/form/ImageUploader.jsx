import { Upload } from "lucide-react";

const ImageUploader = ({ label = "Imagem de Capa", preview = "", onSelect }) => (
    <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </label>
        <label htmlFor="business-image" className="block cursor-pointer">
            {preview ? (
                <div className="relative group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-40 sm:h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                            Clique para alterar
                        </span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center gap-3 w-full h-40 sm:h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Foto do comércio (opcional)
                    </span>
                </div>
            )}
        </label>
        <input
            id="business-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onSelect?.(event.target.files[0])}
        />
    </div>
);

export default ImageUploader;