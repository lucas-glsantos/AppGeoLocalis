import { v2 as cloudinary } from "cloudinary";
import { Business } from "../models/Business.js";
import { User } from "../models/User.js";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { business_categories } from "../configs/constants.js";

const businessSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().max(2000).optional(),
    category: z.enum(business_categories),
    phone: z.string().max(20).optional(),
    whatsapp: z.string().max(20).optional(),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    address: z.string().max(300).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(50).optional(),
});

export const addBusiness = async (req, res) => {
    try {
        const userId = req.userId;

        const existingBusinesses = await Business.findByAuthor(userId);
        if (existingBusinesses.length > 0) {
            return res.status(400).json({ success: false, message: 'Você já possui um comércio cadastrado. Edite-o em "Meus Comércios" '})
        }

        let rawPayload;
        try {
            rawPayload = typeof req.body.business === "string" ? JSON.parse(req.body.business) : req.body.business;
        } catch {
            rawPayload = req.body;
        }

        const validation = businessSchema.safeParse(rawPayload);
        if (!validation.success) {
            return res.status(400).json({ success: false, errors: validation.error.format() });
        }

        const { name, description, category, phone, whatsapp, latitude, longitude, address, city, state } = validation.data;
        const imageFile = req.file;

        let imageUrl = '';
        if (imageFile) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'businesses', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(imageFile.buffer);
            });
            imageUrl = uploadResult.secure_url;
        }

        await Business.create({
            name: sanitizeHtml(name, { allowedTags: [] }),
            description: description ? sanitizeHtml(description, { allowedTags: [] }) : '',
            category, phone, whatsapp,
            image: imageUrl,
            latitude, longitude,
            address: address || '', city: city || '', state: state || '',
            authorId: userId,
        });

        res.status(201).json({ success: true, message: "Comércio cadastrado com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erro interno no Servidor" });
    }
};

export const getAllActiveBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find({ is_active: true });

        res.status(200).json({ success: true, businesses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getBusinessById = async (req, res) => {
    try {
        const { businessId } = req.params;
        const business = await Business.findById(parseInt(businessId));

        if (!business) {
            return res.status(404).json({ success: false, message: "Comércio não encontrado" });
        }

        res.status(200).json({ success: true, business });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro interno no Servidor" });
    }
};

export const getNearbyBusinesses = async (req, res) => {
    try {
        const { lat, lon, radius } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ success: false, message: "lat e lon são obrigatórios" });
        }

        const businesses = await Business.findNearby(
            parseFloat(lat), parseFloat(lon), parseFloat(radius || 5)
        );

        res.status(200).json({ success: true, businesses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserBusinesses = async (req, res) => {
    try {
        const businesses = await Business.findByAuthor(req.userId);

        res.status(200).json({ success: true, businesses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteBusinessById = async (req, res) => {
    try {
        const { businessId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;

        const business = await Business.findById(parseInt(businessId));

        if (!business) {
            return res.status(404).json({ success: false, message: "Comércio não encontrado" });
        }

        if (!isAdmin && business.author_id !== userId) {
            return res.status(403).json({ success: false, message: "Você não tem permissão para deletar" });
        }

        await Business.findOneAndDelete({ id: parseInt(businessId)});
        res.status(200).json({ success: true, message: "Comércio excluido com sucesso" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBusinessById = async (req, res) => {
    try {
        const { businessId } = req.params;
        const userId = req.userId;
        const isAdmin = req.isAdmin;
        
        const existing = await Business.findById(parseInt(businessId));

        if (!existing) {
            return res.status(404).json({ success: false, message: "Comércio não encontrado" });
        }

        if (!isAdmin && existing.author_id !== userId) {
            return res.status(403).json({ success: false, message: "Você não tem permissão para editar" });
        }

        const validation = businessSchema.partial().safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ success: false, errors: validation.error.format() });
        }

        const updateData = {};
        for (const [key, value] of Object.entries(validation.data)) {
            if (value !== undefined) updateData[key] = value;
        }

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'businesses', resource_type: 'image' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            updateData.image = uploadResult.secure_url;
        }

        updateData.updated_at = new Date();

        const business = await Business.findOneAndUpdate(
            { id: parseInt(businessId) }, updateData
        );

        res.status(200).json({ success: true, message: "Comércio atualizado com sucesso", business });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};