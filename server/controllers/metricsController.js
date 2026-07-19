import { z } from "zod";
import { Metrics } from "../models/Metrics.js";

const metricsSchema = z.object({
	businessId: z.coerce.number().int().positive("ID do comércio inválido"),
});

// Função unificada para registrar eventos
const trackEvent = async (req, res, eventType) => {
	try {
		const { businessId } = metricsSchema.parse(req.body);
		const userId = req.userId || null;
		const sessionId = req.body.sessionId || null;

		await Metrics.insertEvent({ businessId, eventType, userId, sessionId });

		return res.status(201).json({ success: true });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ success: false, message: error.errors[0].message });
		}

		if (error.code === '23503' || error.message.includes('foreign key')) {
			return res.status(404).json({ success: false, message: "Comércio não encontrado" });
		}

		// Requisitos de segurança: Registrar o erro original em um logger e não expor ao usuário
		console.error(`Erro ao registrar evento [${eventType}]:`, error);
		return res.status(500).json({success: false, message: "Erro interno no Servidor" });
	}
};

// Controllers
export const trackView = (req, res) => trackEvent(req, res, 'view');
export const trackClick = (req, res) => trackEvent(req, res, 'click');
export const trackContact = (req, res) => trackEvent(req, res, 'contact');


// GET /api/metrics/dashboard (disponível apenas para 1 usuário <-> 1 business)
export const getDashboardMetrics = async (req, res) => {
	try {
		const authorId = req.userId;
		const [topBusinesses, comparison] = await Promise.all([
			Metrics.getMetricsByAuthor(authorId), 
			Metrics.getMonthlyComparison(authorId)
		]);

		if (!topBusinesses.length || topBusinesses.length === 0) {
			return res.status(200).json({
				success: true,
				metrics: null,
				message: "Nenhum comércio cadastrado"
			});
		}

		let totalViews = 0, totalClicks = 0, totalContacts = 0;

		for (const business of topBusinesses) {
			totalViews += Number(business.views || 0);
			totalClicks += Number(business.clicks || 0);
			totalContacts += Number(business.contacts || 0);
		}

		const current = Number(comparison?.current_month || 0);
		const previous = Number(comparison?.previous_month || 0);

		let monthlyIncrease = 0;

		if (previous > 0) {
			monthlyIncrease = ((current - previous) / previous) * 100; 
		} else if (current > 0) { 
			monthlyIncrease = 100;
		}

		res.status(200).json({
			success: true,
			metrics: {
				totalViews,
				totalClicks,
				totalContacts,
				monthlyIncrease: Number(monthlyIncrease.toFixed(2)),
				topBusinesses,
				comparison: { currentMonth: current, previousMonth: previous },
			},
		});
	} catch (error) {
		console.error("Erro ao gerar dashboard:", error);
		res.status(500).json({ success: false, message: "Erro interno no Servidor" });
	}
};
