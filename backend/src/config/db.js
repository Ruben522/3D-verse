import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL en la nube"))
  .catch((err) => console.error("❌ Error conectando a la base de datos", err));

export default pool;