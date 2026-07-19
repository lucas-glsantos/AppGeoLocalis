import { pool } from "../configs/db.js";

// Função criar tabela e os índices de métricas
async function createMetricsTable() {
	try {
		await pool.query(`
            CREATE TABLE IF NOT EXISTS metrics_events (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255),
                business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
                event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('view', 'click', 'contact')),
                session_id VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

		// CREATE INDEX para performance nas consultas do dashboard
		await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_metrics_business
            ON metrics_events(business_id, event_type, created_at)
        `);

		console.log("Tabela e índices metrics_events criada/verificada");
	} catch (error) {
		console.error("Erro ao criar tabela metrics_events:", error);
		throw error;
	}
}

async function insertEvent({ businessId, eventType, userId = null, sessionId = null }) {
	const result = await pool.query(
		`INSERT INTO metrics_events (business_id, event_type, user_id, session_id)
         VALUES ($1, $2, $3, $4) RETURNING *`,
		[businessId, eventType, userId, sessionId],
	);
	return result.rows[0];
}

// Mostra no Dashboard total de eventos por tipo, agrupado por business_id do autor
async function getMetricsByAuthor(authorId) {
	const result = await pool.query(
		`SELECT 
            b.id AS business_id,
            b.name AS business_name,
            b.category,
            COUNT(m.id) FILTER (WHERE m.event_type = 'view') AS views,
            COUNT(m.id) FILTER (WHERE m.event_type = 'click') AS clicks,
            COUNT(m.id) FILTER (WHERE m.event_type = 'contact') AS contacts
        FROM businesses b
        LEFT JOIN metrics_events m ON m.business_id = b.id
        WHERE b.author_id = $1
        GROUP BY b.id, b.name, b.category
        ORDER BY views DESC`,
		[authorId],
	);
	return result.rows;
}

// Mês atual vs mês anterior (CARD AUMENTO MENSAL)
async function getMonthlyComparison(authorId) {
	const result = await pool.query(
		`SELECT 
            COALESCE(SUM(CASE WHEN m.created_at >= date_trunc('month', CURRENT_DATE)
                THEN 1 ELSE 0 END), 0) AS current_month,
            COALESCE(SUM(CASE WHEN m.created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
                AND m.created_at < date_trunc('month', CURRENT_DATE)
                THEN 1 ELSE 0 END), 0) AS previous_month
        FROM metrics_events m
        JOIN businesses b ON m.business_id = b.id
        WHERE b.author_id = $1`,
		[authorId],
	);
	return result.rows[0];
}

export const Metrics = {
	createMetricsTable,
	insertEvent,
	getMetricsByAuthor,
	getMonthlyComparison,
};

export default Metrics;
