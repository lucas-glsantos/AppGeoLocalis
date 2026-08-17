import { fieldErrorClass, inputClass } from "./fieldStyles";

const TextArea = ({ label, value, onChange, placeholder = "", title, rows = 3, error }) => (
    <div>
        {label && (
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>
        )}
        <textarea
            rows={rows}
            placeholder={placeholder}
            className={inputClass}
            value={value}
            title={title}
            onChange={(event) => onChange(event.target.value)}
        />
        {error && <p className={fieldErrorClass}>{error}</p>}
    </div>
);

export default TextArea;