import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import modelsRoutes from "./routes/models.routes.js";
import usersRoutes from "./routes/users.routes.js";
import favoritesRoutes from "./routes/favorites.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import followersRoutes from "./routes/followers.routes.js";
import tagsRoutes from "./routes/tags.routes.js"
import modelPartsRoutes from "./routes/modelParts.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRoutes);
app.use("/models", modelsRoutes);
app.use("/users", usersRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/comments", commentsRoutes);
app.use("/followers", followersRoutes);
app.use("/tags", tagsRoutes);
app.use("/model-parts", modelPartsRoutes);

app.get("/", (req, res) => {
    res.send("Bienvenido a la API de 3D-verse");
});

export default app;
