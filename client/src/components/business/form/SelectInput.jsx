import { fieldErrorClass, inputClass } from "./fieldStyles";

const SelectInput = ({ label, icon: Icon, value, onChange, options = [], error }) => (
    <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {Icon && <Icon className="w-4 h-4" />}
            {label}
        </label>
        <select
            value={value}
            required
            onChange={(event) => onChange(event.target.value)}
            className={`${inputClass} cursor-pointer`}
        >
            <option value="" disabled>
                Selecionar
            </option>
            {options.map((option) => (
                <option key={option.id} value={option.name}>
                    {option.name}
                </option>
            ))}
        </select>
        {error && <p className={fieldErrorClass}>{error}</p>}
    </div>
);

export default SelectInput;