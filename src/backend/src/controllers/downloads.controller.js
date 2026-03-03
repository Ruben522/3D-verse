// src/controllers/downloads.controller.js
import archiver from "archiver";
import fs from "fs";
import path from "path";
import {
    recordDownload,
    getDownloadsHistory,
    getModelDownloadStats,
    getDownloadInfo,
} from "../services/downloads.service.js";

const record = async (req, res) => {
    try {
        const tokenUser = req.user || null;
        const { modelId } = req.params;
        const { type } = req.query; // Extraemos el tipo de descarga (?type=all, parts, gallery)

        // 1. Registramos la descarga en la base de datos
        await recordDownload(
            modelId,
            tokenUser,
            req.ip,
            req.headers["user-agent"],
        );

        // 2. Obtenemos las rutas físicas desde el servicio
        const info = await getDownloadInfo(modelId);

        // ==========================================
        // CASO A: Descarga del archivo principal (Por defecto si no hay ?type)
        // ==========================================
        if (!type || type === "main") {
            return res.download(
                info.absolutePath,
                info.cleanName,
            );
        }

        // ==========================================
        // CASO B: Descarga de carpetas (Empaquetado en ZIP)
        // ==========================================
        const archive = archiver("zip", {
            zlib: { level: 9 },
        }); // Nivel máximo de compresión

        // Configuramos el nombre del ZIP según lo que pidan
        const baseName = info.cleanName.split(".")[0];
        res.attachment(`${baseName}_${type}.zip`); // Obliga al navegador a descargarlo

        // Conectamos el archivo ZIP a la respuesta HTTP
        archive.pipe(res);

        if (type === "all") {
            // Añade toda la carpeta raíz (incluye parts, gallery y el archivo principal)
            archive.directory(info.modelFolder, false);
        } else if (type === "parts") {
            const partsDir = path.join(
                info.modelFolder,
                "parts",
            );
            if (fs.existsSync(partsDir)) {
                archive.directory(partsDir, false);
            } else {
                return res
                    .status(404)
                    .json({
                        error: "No hay partes adicionales para este modelo.",
                    });
            }
        } else if (type === "gallery") {
            const galleryDir = path.join(
                info.modelFolder,
                "gallery",
            );
            if (fs.existsSync(galleryDir)) {
                archive.directory(galleryDir, false);
            } else {
                return res
                    .status(404)
                    .json({
                        error: "No hay galería para este modelo.",
                    });
            }
        } else {
            return res
                .status(400)
                .json({
                    error: "Tipo de descarga no válido (use main, all, parts o gallery)",
                });
        }

        // Finaliza el empaquetado y envía el ZIP al usuario
        await archive.finalize();
    } catch (error) {
        // Solo enviamos error si las cabeceras aún no se han enviado al cliente
        if (!res.headersSent) {
            res.status(400).json({ error: error.message });
        }
    }
};

const getUserHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const history = await getDownloadsHistory(
            req.user.id,
            { page, limit },
        );
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getModelStats = async (req, res) => {
    try {
        const stats = await getModelDownloadStats(
            req.params.modelId,
            req.user,
        );
        res.status(200).json(stats);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export { record, getUserHistory, getModelStats };
