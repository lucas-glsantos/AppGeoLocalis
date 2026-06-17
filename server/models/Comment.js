import { pool } from '../configs/db.js';

// Função Criar Tabela Comentários
async function createCommentTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        is_archived BOOLEAN DEFAULT false,
        commenter_id VARCHAR(255),
        author_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      ALTER TABLE comments
      ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false
    `);
    await pool.query(`
      ALTER TABLE comments
      ADD COLUMN IF NOT EXISTS commenter_id VARCHAR(255)
    `);
    console.log("Tabela comments criada/verificada");
  } catch (error) {
    console.error("Erro ao criar tabela comments:", error);
    throw error;
  }
}

async function create({ post, name, content, author, commenterId }) {
  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, name, content, author_id, commenter_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [post, name, content, author, commenterId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function find(query = {}) {
  try {
    let sql = `SELECT c.*, u.image AS user_image
               FROM comments c
               LEFT JOIN users u ON c.commenter_id = u.clerk_id`;
    const values = [];
    const conditions = [];

    if (query.post) {
      conditions.push(`c.post_id = $${conditions.length + 1}`);
      values.push(query.post);
    }
    if (query.isApproved !== undefined) {
      conditions.push(`c.is_approved = $${conditions.length + 1}`);
      values.push(query.isApproved);
    }
    if (query.author) {
      conditions.push(`c.author_id = $${conditions.length + 1}`);
      values.push(query.author);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY c.created_at DESC';

    const result = await pool.query(sql, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function findById(id) {
  try {
    const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function findByAuthor(authorId) {
  try {
    const result = await pool.query(
      `SELECT c.*, p.title AS post_title, u.image AS user_image
       FROM comments c 
       LEFT JOIN posts p ON c.post_id = p.id
       LEFT JOIN users u ON c.commenter_id = u.clerk_id
       WHERE c.author_id = $1
       ORDER BY c.created_at DESC`,
      [authorId]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function findOneAndDelete(id) {
  try {
    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function findOneAndUpdate(query, update) {
  try {
    const setClauses = [];
    const values = [];
    let idx = 1;
    
    for (const [key, value] of Object.entries(update)) {
      setClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
    values.push(query.id);
    
    const result = await pool.query(
      `UPDATE comments SET ${setClauses.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const Comment = {
  createCommentTable,
  create,
  find,
  findById,
  findByAuthor,
  findOneAndDelete,
  findOneAndUpdate,
};

export default Comment;