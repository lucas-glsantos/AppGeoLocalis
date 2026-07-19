import { pool } from "../configs/db.js";

// Função criar tabela favoritos
async function createFavoritesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) NOT NULL,
                business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, business_id)
            )
        `);
        console.log("Tabela favorites criada/verificada");
    } catch (error) {
        console.error("Erro ao criar tabela favorites:", error);
        throw error;
    }
}

async function add(userId, businessId) {
    try {
        const result = await pool.query(
            `INSERT INTO favorites (user_id, business_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, business_id) DO NOTHING
             RETURNING *`,
            [userId, businessId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function remove(userId, businessId) {
    try {
        const result = await pool.query(
            `DELETE FROM favorites
             WHERE user_id = $1 AND business_id = $2
             RETURNING *`,
            [userId, businessId]
        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function findByUser(userId) {
    try {
        const result = await pool.query(
            `SELECT b.*, f.created_at AS favorited_at
             FROM favorites f
             JOIN businesses b ON f.business_id = b.id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
            [userId]
        );
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function isFavorited(userId, businessId) {
    try {
        const result = await pool.query(
            `SELECT 1 FROM favorites
             WHERE user_id = $1 AND business_id = $2
             LIMIT 1`,
            [userId, businessId]
        );
        return result.rows.length > 0;
    } catch (error) {
        throw error;
    }
}

export const Favorite = {
    createFavoritesTable,
    add,
    remove,
    findByUser,
    isFavorited,
};

export default Favorite;