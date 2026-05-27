import "dotenv/config";
import pkg from 'pg';
const { Pool } = pkg;

// Configurações Pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,    // máximo de conexões simultâneas no pool
  idleTimeoutMillis: 30000,   // fecha conexões ociosas após 30s
  connectionTimeoutMillis: 30000,   // Aborta se conexão demorar mais de 30s
  allowExitOnIdle: true,
});

export async function connectDB () {
  try {
    const client = await pool.connect();
    console.log("Neon PostgreSQL conectado com sucesso");
    client.release();   // Libera cliente para o pool
  } catch (error) {
    console.error("Erro ao conectar Neon PostgreSQL:", error.message);
    process.exit(1);
  }
}

export default { pool, connectDB };