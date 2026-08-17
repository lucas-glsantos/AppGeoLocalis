import { useCallback, useEffect, useRef, useState } from "react";

export const emptyBusinessValues = {
    name: "",
    description: "",
    category: "",
    phone: "",
    whatsapp: "",
    address: "",
    latitude: null,
    longitude: null,
};

export const useBusinessForm = () => {
    const [values, setValues] = useState(emptyBusinessValues);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const previewRef = useRef(imagePreview);
    previewRef.current = imagePreview;

    useEffect(() => {
        const url = previewRef.current;
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, []);

    const setField = useCallback((key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    }, []);

    const populate = useCallback((data = {}) => {
        setValues({
            name: data.name ?? "",
            description: data.description ?? "",
            category: data.category ?? "",
            phone: data.phone ?? "",
            whatsapp: data.whatsapp ?? "",
            address: data.address ?? "",
            latitude: data.latitude != null ? Number(data.latitude) : null,
            longitude: data.longitude != null ? Number(data.longitude) : null,
        });
    }, []);

    const setImageFile = useCallback((file) => {
        setImagePreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return file ? URL.createObjectURL(file) : "";
        });
        setImage(file);
    }, []);

    const reset = useCallback(() => {
        setImagePreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return "";
        });
        setImage(null);
        setValues(emptyBusinessValues);
    }, []);

    const buildBusinessPayload = useCallback(
        () => ({
            name: values.name.trim(),
            description: values.description,
            category: values.category,
            phone: values.phone,
            whatsapp: values.whatsapp,
            address: values.address,
            latitude: values.latitude,
            longitude: values.longitude,
        }),
        [values]
    );

    const buildAddFormData = useCallback(() => {
        const formData = new FormData();
        formData.append("business", JSON.stringify(buildBusinessPayload()));
        if (image) formData.append("image", image);
        return formData;
    }, [buildBusinessPayload, image]);

    const buildEditFormData = useCallback(() => {
        const formData = new FormData();
        const payload = buildBusinessPayload();
        Object.entries(payload).forEach(([key, value]) => {
            formData.append(key, key === "latitude" || key === "longitude" ? String(value) : value);
        });
        if (image) formData.append("image", image);
        return formData;
    }, [buildBusinessPayload, image]);

    return {
        values,
        setField,
        populate,
        image,
        imagePreview,
        setImageFile,
        setImagePreview,
        reset,
        buildAddFormData,
        buildEditFormData,
    };
};