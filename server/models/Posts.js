import { pool } from '../configs/db.js';

// Função Criar Tabela Postagem no DB
async function createPostTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        sub_title VARCHAR(500),
        description TEXT,
        category VARCHAR(100),
        image TEXT,
        is_published BOOLEAN DEFAULT false,
        author_id VARCHAR(255),
        author_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela posts criada/verificada");
  } catch (error) {
    console.error("Erro ao criar tabela posts:", error);
    throw error;
  }
}

// Função criar Postagem
async function create({ title, subTitle, description, category, image, isPublished, author, authorName }) {
  try {
    const result = await pool.query(
      `INSERT INTO posts (title, sub_title, description, category, image, is_published, author_id, author_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, subTitle, description, category, image, isPublished, author, authorName || 'Anonymous']
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Função buscar todas postagens
async function find(query = {}) {
  try {
    let sql = 'SELECT * FROM posts';
    const values = [];
    const conditions = [];

    if (query.is_published !== undefined) {
      conditions.push(`is_published = $${conditions.length + 1}`);
      values.push(query.is_published);
    }
    if (query.author) {
      conditions.push(`author_id = $${conditions.length + 1}`);
      values.push(query.author);
    }
    if (query.id) {
      conditions.push(`id = $${conditions.length + 1}`);
      values.push(query.id);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY created_at DESC';

    const result = await pool.query(sql, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Função buscar postagem por ID
async function findById(id) {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Função buscar por Autor
async function findByAuthor(authorId) {
  try {
    const result = await pool.query('SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC', [authorId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// Função Buscar e Deletar por ID
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

    const result = await pool.query(
      `DELETE FROM posts WHERE ${conditions.join(' AND ')} RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Função Buscar e Atualizar por ID
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
      values.push(query.author);
    }

    if (conditions.length === 0) return null;

    const setClauses = [];
    for (const [key, value] of Object.entries(update)) {
      setClauses.push(`${key} = $${values.length + 1}`);
      values.push(value);
    }

    const result = await pool.query(
      `UPDATE posts SET ${setClauses.join(', ')} WHERE ${conditions.join(' AND ')} RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const Posts = {
  createPostTable,
  create,
  find,
  findById,
  findByAuthor,
  findOneAndDelete,
  findOneAndUpdate,
};

export default Posts;