import dotenv from "dotenv";
import app from "./app.js";
import "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
console.log("🔥 ESTE ES EL SERVER CORRECTO 🔥");
app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en http://localhost:${PORT}`);
});
