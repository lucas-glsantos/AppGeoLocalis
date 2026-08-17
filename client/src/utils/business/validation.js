export const businessFieldValidators = {
    name: (value) => (!value || !value.trim() ? "O nome do comércio é obrigatório" : undefined),
    category: (value) => (value ? undefined : "Selecione uma categoria"),
    location: (latitude, longitude) =>
        latitude !== null && longitude !== null ? undefined : "Marque a localização no mapa",
};

export const validateBusinessForm = ({ name, category, latitude, longitude }) => {
    const errors = {
        name: businessFieldValidators.name(name ?? ""),
        category: businessFieldValidators.category(category ?? ""),
        location: businessFieldValidators.location(latitude, longitude),
    };
    return { errors, isValid: Object.values(errors).every((error) => error === undefined) };
};