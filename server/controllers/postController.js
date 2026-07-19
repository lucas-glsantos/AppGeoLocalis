import { v2 as cloudinary } from "cloudinary";
import { Posts } from "../models/Posts.js";
import { User } from "../models/User.js";
import { z } from "zod";
import sanitizeHtml from "sanitize-html";
import { post_categories } from "../configs/constants.js";

// Schema de Validação
const postSchema = z.object({
	title: z.string().min(5).max(100).trim(),
	subTitle: z.string().max(200).optional(),
	description: z.string().min(10).max(10000), // Limite de 10k de caracteres
	category: z.enum(post_categories), // Validação de categoria
	is_published: z.boolean().default(false),
});

// Função Adicionar Postagem
export const addPost = async (req, res) => {
	try {
		const userId = req.userId;

		let rawPayload;
		try {
			rawPayload = typeof req.body.post === "string" ? JSON.parse(req.body.post) : req.body.post;
		} catch {
			rawPayload = req.body;
		}

		const validation = postSchema.safeParse(rawPayload);
		if (!validation.success) {
			return res.status(400).json({ success: false, errors: validation.error.format() });
		}

		const { title, subTitle, description, category, is_published } = validation.data;
		const imageFile = req.file;

		if (!imageFile) {
			return res.status(400).json({ success: false, message: "Imagem é obrigatória" });
		}

		const cleanDescription = sanitizeHtml(description, {
			allowedTags: ["b", "i", "em", "strong", "p", "h1", "h2", "h3", "ol", "ul", "li", "a", "img", "blockquote", "code"],
		});

		const uploadResult = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream({ folder: "posts", resource_type: "image" }, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
			uploadStream.end(imageFile.buffer);
		});

		const user = await User.findUserByClerkId(userId);

		await Posts.create({
			title: sanitizeHtml(title, { allowedTags: [] }),
			subTitle: subTitle ? sanitizeHtml(subTitle, { allowedTags: [] }) : "",
			description: cleanDescription,
			category,
			image: uploadResult.secure_url,
			isPublished: is_published,
			author: userId,
			authorName: user?.name || "Anonymous",
		});

		res.status(201).json({ success: true, message: "Post publicado" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Erro interno no Servidor" });
	}
};

// Função Obter Todas Postagens Publicadas (público)
export const getAllPublishedPosts = async (req, res) => {
	try {
		const posts = await Posts.find({ is_published: true });
		res.status(200).json({ success: true, posts });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: error.message });
	}
};

// Função Obter Postagem Publicada por ID (público - só retorna se publicado)
export const getPublishedPostById = async (req, res) => {
	try {
		const { postId } = req.params;
		const post = await Posts.findById(parseInt(postId));

		if (!post) {
			return res.status(404).json({ success: false, message: "Post não encontrado" });
		}

		if (!post.is_published) {
			return res.status(404).json({ success: false, message: "Post não encontrado" });
		}

		res.status(200).json({ success: true, post });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Erro interno no Servidor" });
	}
};

// Função Obter Postagem por ID (protegida - autor/admin veem rascunhos)
export const getPostById = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.userId;
		const isAdmin = req.isAdmin;
		const post = await Posts.findById(parseInt(postId));

		if (!post) {
			return res.status(404).json({ success: false, message: "Post não encontrado" });
		}

		const isAuthor = post.author_id === userId;

		if (!isAuthor && !isAdmin && !post.is_published) {
			return res.status(403).json({ success: false, message: "Você não tem permissão para ver este post" });
		}

		res.status(200).json({ success: true, post });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Erro interno no Servidor" });
	}
};

// Função Deletar Postagem por ID
export const deletePostById = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.userId;
		const isAdmin = req.isAdmin;

		if (!userId) {
			return res.status(401).json({ success: false, message: "Não autorizado" });
		}

		const post = await Posts.findById(parseInt(postId));

		if (!post) {
			return res.status(404).json({ success: false, message: "Post não encontrado" });
		}

		if (!isAdmin && post.author_id !== userId) {
			return res.status(403).json({ success: false, message: "Você não tem permissão para deletar este post" });
		}

		await Posts.findOneAndDelete({ id: parseInt(postId) });
		res.status(200).json({ success: true, message: "Post deletado" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Função Alternar Publicação
export const togglePublish = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.userId;
		const isAdmin = req.isAdmin;

		if (!userId) {
			return res.status(401).json({ success: false, message: "Não autorizado" });
		}

		const post = await Posts.findById(parseInt(postId));

		if (!post) {
			return res.status(404).json({ success: false, message: "Post não encontrado" });
		}

		if (!isAdmin && post.author_id !== userId) {
			return res.status(403).json({ success: false, message: "Você não tem permissão para alterar este post" });
		}

		const newStatus = !post.is_published;
		await Posts.findOneAndUpdate({ id: parseInt(postId) }, { is_published: newStatus, updated_at: new Date() });

		res.status(200).json({ success: true, message: newStatus ? "Post publicado" : "Post arquivado" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Função atualizar postagem por ID
export const updatePostById = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.userId;
		const isAdmin = req.isAdmin;

		// Verifica se post existe
		const existing = await Posts.findById(parseInt(postId));
		if (!existing) {
			return res.status(404).json({ success: false, message: "Post não encontrado" });
		}

		// Verifica permissão
		if (!isAdmin && existing.author_id !== userId) {
			return res.status(403).json({ success: false, message: "Você não tem permissão para editar este post" });
		}

		// Parser do payload
		let rawPayload;
		try {
			rawPayload = typeof req.body.post === "string" ? JSON.parse(req.body.post) : req.body.post;
		} catch {
			rawPayload = req.body;
		}

		// Validar com Zod partial, todos campos opcionais
		const validation = postSchema.partial().safeParse(rawPayload);
		if (!validation.success) {
			return res.status(400).json({ success: false, errors: validation.error.format() });
		}

		// Monta objeto updateData apenas com campos enviados
		const updateData = {};
		for (const [key, value] of Object.entries(validation.data)) {
			if (value !== undefined) updateData[key] = value;
		}

		// Sanitizar campos de texto
		if (updateData.description) {
			updateData.description = sanitizeHtml(updateData.description, {
				allowedTags: ["b", "i", "em", "strong", "p", "h1", "h2", "h3", "ol", "ul", "li", "a", "img", "blockquote", "code"],
			});
		}

		if (updateData.title) {
			updateData.title = sanitizeHtml(updateData.title, { allowedTags: [] });
		}

		if (updateData.subTitle) {
			updateData.subTitle = sanitizeHtml(updateData.subTitle, { allowedTags: [] });
		}

		if (updateData.subTitle !== undefined) {
			updateData.sub_title = updateData.subTitle;
			delete updateData.subTitle;
		}

		// Upload de nova Imagem opcional
		if (req.file) {
			const uploadResult = await new Promise((resolve, reject) => {
				const uploadStream = cloudinary.uploader.upload_stream({ folder: "posts", resource_type: "image" }, (error, result) => {
					if (error) reject(error);
					else resolve(result);
				});
				uploadStream.end(req.file.buffer);
			});
			updateData.image = uploadResult.secure_url;
		}

		// Atualiza timestamp
		if (Object.keys(updateData).length > 0) {
			updateData.updated_at = new Date();
			await Posts.findOneAndUpdate({ id: parseInt(postId) }, updateData);
		}

		// Busca post atualizado e retorna
		const updated = await Posts.findById(parseInt(postId));

		res.status(200).json({ success: true, message: "Post editado", post: updated });
	} catch (error) {
		res.status(500).json({ success: false, message: "Erro interno no Servidor" });
	}
};

// Função obter postagem por ID
export const getPostByIdInternal = async (id) => {
	return await Posts.findById(id);
};
