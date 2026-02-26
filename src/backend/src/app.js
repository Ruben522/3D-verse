import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import modelsRoutes from "./routes/models.routes.js";
import usersRoutes from "./routes/users.routes.js";
/*
import comentariosRoutes from "./routes/comentarios.routes.js";
import favoritosRoutes from "./routes/favoritos.routes.js";
import descargasRoutes from "./routes/descargas.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js"; */

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS

app.use("/auth", authRoutes);
app.use("/models", modelsRoutes);
app.use("/users", usersRoutes);

/*
app.use("/comentarios", comentariosRoutes);
app.use("/favoritos", favoritosRoutes);
app.use("/descargas", descargasRoutes);
app.use(errorMiddleware);
*/
export default app;