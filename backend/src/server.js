import dotenv from "dotenv";

dotenv.config({ override: false });

import app from "./app.js";
import "./config/db.js"; // REVISA ESTE ARCHIVO TAMBIÉN (ver paso 3)

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🔥 Servidor corriendo en puerto ${PORT}`);
});