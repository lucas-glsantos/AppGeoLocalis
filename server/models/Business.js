import { pool } from "../configs/db.js";

// Função criar tabela businesses
async function createBusinessTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS businesses (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(100),
                phone VARCHAR(50),
                whatsapp VARCHAR(50),
                image TEXT,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                address TEXT,
                city VARCHAR(100),
                state VARCHAR(50),
                author_id VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("Tabela businesses criada/verificada");
    } catch (error) {
        console.error("Erro ao criar tabela businesses:", error);
        throw error;
    }
}

async function create({ name, description, category, phone, whatsapp, image, latitude, longitude, address, city, state, authorId }) {
    try {
        const result = await pool.query(
            `INSERT INTO businesses (name, description, category, phone, whatsapp, image, latitude, longitude, address, city, state, author_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [name, description, category, phone, whatsapp, image, latitude, longitude, address, city, state, authorId]

        );
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function find(query = {}) {
    try {
        let sql = 'SELECT * FROM businesses';
        const values = [];
        const conditions = [];

        if (query.is_active !== undefined) {
            conditions.push(`is_active = $${conditions.length + 1}`);

            values.push(query.is_active);
        }

        if (query.author) {
            conditions.push(`author_id = $${conditions.length + 1}`);

            values.push(query.author);
        }

        if (query.category) {
            conditions.push(`category = $${conditions.length + 1}`);
            values.push(query.category);
        }

        if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
        sql += ' ORDER BY created_at DESC';

        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function findById(id) {
    try {
        const result = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function findByAuthor(authorId) {
    try {
        const result = await pool.query('SELECT * FROM businesses WHERE author_id = $1 ORDER BY created_at DESC', [authorId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function findNearby(lat, lon, radiusKm = 5) {
    try {
        const result = await pool.query(`
            SELECT *, (
                6371 * acos(
                    cos(radians($1)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians($2)) +
                    sin(radians($1)) * sin(radians(latitude))
                )
            ) AS distance
            FROM businesses
            WHERE is_active = true
            HAVING distance < $3
            ORDER BY distance    
        `, [lat, lon, radiusKm]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function findOneAndDelete(query) {
    try {
        const conditions = [];
        const values = [];

        if (query.id) {
            conditions.push(`id = $${conditions.length + 1}`);
            values.push(query.id);
        }

        if (query.author && !query.isAdmin) {
            conditions.push(`author_id = $${conditions.length + 1}`);
            values.push(query.author);
        }

        if (conditions.length === 0) return null;

        const result = await pool.query(`DELETE FROM businesses WHERE ${conditions.join(' AND ')} RETURNING *`, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function findOneAndUpdate(query, update) {
    try {
        const conditions = [];
        const values = [];

        if (query.id) {
            conditions.push(`id = $${conditions.length + 1}`);
            values.push(query.id);
        }

        if (query.author && !query.isAdmin) {
            conditions.push(`author_id = $${conditions.length + 1}`);
            values.push(query.author)
        }

        if (conditions.length === 0) return null;

        const setClauses = [];
        for (const [key, value] of Object.entries(update)) {
            setClauses.push(`${key} = $${values.length + 1}`);
            values.push(value);
        }

        const result = await pool.query(`UPDATE businesses SET ${setClauses.join(', ')} WHERE ${conditions.join(' AND ')} RETURNING *`, values);
        
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}


export const Business = {
    createBusinessTable, create, find, findById, findByAuthor, findNearby, findOneAndDelete, findOneAndUpdate,
};