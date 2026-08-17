import { fieldErrorClass, inputClass } from "./fieldStyles";

const TextInput = ({
    label,
    icon: Icon,
    value,
    onChange,
    placeholder = "",
    title,
    type = "text",
    required = false,
    error,
    className = "",
}) => (
    <div>
        {label && (
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {Icon && <Icon className="w-4 h-4" />}
                {label}
            </label>
        )}
        <input
            type={type}
            required={required}
            placeholder={placeholder}
            className={`${inputClass} ${className}`}
            value={value}
            title={title}
            onChange={(event) => onChange(event.target.value)}
        />
        {error && <p className={fieldErrorClass}>{error}</p>}
    </div>
);

export default TextInput;