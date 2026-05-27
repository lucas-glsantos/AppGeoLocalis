import { pool } from '../configs/db.js';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

async function createUsersTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password TEXT,
        image TEXT,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela users criada/verificada");
  } catch (error) {
    console.error("Erro ao criar tabela users:", error);
    throw error;
  }
}

async function createUser({ clerkId, email, name, image, password }) {
  try {
    if (!name || name.trim() === '') {
      throw new Error("Nome do usuário é obrigatório");
    }

    const isAdmin = email?.toLowerCase() === ADMIN_EMAIL;
    const hashedPassword = password || null;
    
    const result = await pool.query(
      `INSERT INTO users (clerk_id, email, name, password, image, is_admin) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (clerk_id) DO UPDATE SET 
         name = EXCLUDED.name, 
         password = COALESCE(EXCLUDED.password, users.password),
         image = EXCLUDED.image, 
         is_admin = EXCLUDED.is_admin, 
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [clerkId, email, name.trim(), hashedPassword, image || '', isAdmin]
    );
    
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function findUserByClerkId(clerkId) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE clerk_id = $1', [clerkId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function updateUser(clerkId, updates) {
  try {
    const setClauses = [];
    const values = [];
    let idx = 1;
    
    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
    values.push(clerkId);
    
    const result = await pool.query(
      `UPDATE users SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE clerk_id = $${idx} RETURNING *`,
      values
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function updateUserName(clerkId, newName) {
  try {
    if (!newName || newName.trim() === '') {
      throw new Error("Nome do usuário é obrigatório");
    }
    
    const result = await pool.query(
      `UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE clerk_id = $2 RETURNING *`,
      [newName.trim(), clerkId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const User = {
  createUsersTable,
  createUser,
  findUserByClerkId,
  findUserByEmail,
  updateUser,
  updateUserName,
};

export default User;