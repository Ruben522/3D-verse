import express from "express";
import cors from "cors";
/*
import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import modelosRoutes from "./routes/modelos.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import favoritosRoutes from "./routes/favoritos.routes.js";
import descargasRoutes from "./routes/descargas.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js"; */

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS

app.get("/", (req, res) => {
  res.json({ message: "API 3D-verse funcionando 🚀" });
});

/*
app.use("/auth", authRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/modelos", modelosRoutes);
app.use("/comentarios", comentariosRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/descargas", descargasRoutes);
app.use(errorMiddleware);
*/
export default app;