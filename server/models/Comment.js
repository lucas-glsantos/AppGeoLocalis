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
        author_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela comments criada/verificada");
  } catch (error) {
    console.error("Erro ao criar tabela comments:", error);
    throw error;
  }
}

async function create({ post, name, content, author }) {
  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, name, content, author_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [post, name, content, author]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function find(query = {}) {
  try {
    let sql = 'SELECT * FROM comments';
    const values = [];
    const conditions = [];

    if (query.post) {
      conditions.push(`post_id = $${conditions.length + 1}`);
      values.push(query.post);
    }
    if (query.isApproved !== undefined) {
      conditions.push(`is_approved = $${conditions.length + 1}`);
      values.push(query.isApproved);
    }
    if (query.author) {
      conditions.push(`author_id = $${conditions.length + 1}`);
      values.push(query.author);
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
      'SELECT * FROM comments WHERE author_id = $1 ORDER BY created_at DESC',
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