import {
    recordDownload,
    getDownloadsHistory,
    getModelDownloadStats,
    getDownloadInfo,
} from "../services/downloads.service.js";
import archiver from "archiver";
import path from "path";
import fs from "fs";

const record = async (req, res) => {
    try {
        const { modelId } = req.params;
        const { type } = req.query; // Puede ser 'file', 'all', 'parts', 'gallery'

        // 1. Registrar la descarga en la BD (lo que ya hacías)
        const result = await recordDownload(
            modelId,
            req.user || null,
            req.ip,
            req.headers["user-agent"],
        );

        // 2. Obtener información del archivo físico
        const info = await getDownloadInfo(modelId);
        const folderPath = path.join(
            process.cwd(),
            info.modelFolder,
        );

        // CASO A: Descargar solo el archivo principal (Renombrado)
        if (!type || type === "file") {
            return res.download(
                info.absolutePath,
                info.cleanName,
            );
        }

        // CASO B: Descargar carpetas como ZIP
        const archive = archiver("zip", {
            zlib: { level: 9 },
        });

        // Nombre del ZIP: Nombre_Modelo_Carpeta.zip
        const zipName = `${info.cleanName.split(".")[0]}_${type}.zip`;

        res.attachment(zipName); // Configura el header Content-Disposition

        archive.pipe(res);

        if (type === "all") {
            // Añade toda la carpeta del modelo (incluyendo subcarpetas)
            archive.directory(folderPath, false);
        } else if (type === "parts") {
            const partsDir = path.join(folderPath, "parts");
            if (fs.existsSync(partsDir))
                archive.directory(partsDir, "parts");
            else
                return res
                    .status(404)
                    .json({
                        error: "No hay carpeta de partes",
                    });
        } else if (type === "gallery") {
            const galleryDir = path.join(
                folderPath,
                "gallery",
            );
            if (fs.existsSync(galleryDir))
                archive.directory(galleryDir, "gallery");
            else
                return res
                    .status(404)
                    .json({
                        error: "No hay carpeta de galería",
                    });
        }

        archive.finalize();
    } catch (error) {
        res.status(400).json({ error: error.message });
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
