import archiver from "archiver";
import fs from "fs";
import path from "path";
import { recordDownload, getDownloadsHistory, getModelDownloadStats, getDownloadInfo } from "../services/downloads.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";
import { getDisplayFileName } from "../utils/helper/file.helper.js";

/**
 * Añade los archivos de una carpeta a un archivo ZIP limpiando sus nombres.
 */
const appendCleanFolderToArchive = (archive, folderPath, zipSubFolder = "") => {
    if (!fs.existsSync(folderPath)) return;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const cleanName = getDisplayFileName(file);
            const zipPath = zipSubFolder ? `${zipSubFolder}/${cleanName}` : cleanName;
            archive.file(filePath, { name: zipPath });
        }
    }
};

/**
 * Procesa la descarga de un modelo (archivo individual o ZIP comprimido y limpio).
 */
const record = async (req, res) => {
    try {
        const { modelId } = req.params;
        const { type } = req.query; 

        await recordDownload(modelId, req.user || null, req.ip, req.headers["user-agent"]);
        const info = await getDownloadInfo(modelId);

        if (!type || type === "main") {
            return res.download(info.absolutePath, info.cleanName);
        }

        const archive = archiver("zip", { zlib: { level: 9 } });
        const baseName = info.cleanName.split(".")[0];
        res.attachment(`${baseName}_${type}.zip`);
        archive.pipe(res);

        if (type === "all") {
            appendCleanFolderToArchive(archive, info.modelFolder);
            appendCleanFolderToArchive(archive, path.join(info.modelFolder, "parts"), "parts");
            appendCleanFolderToArchive(archive, path.join(info.modelFolder, "gallery"), "gallery");
        } else if (type === "parts") {
            const partsDir = path.join(info.modelFolder, "parts");
            if (!fs.existsSync(partsDir)) return sendError(res, "No hay partes adicionales", 404);
            appendCleanFolderToArchive(archive, partsDir);
        } else if (type === "gallery") {
            const galleryDir = path.join(info.modelFolder, "gallery");
            if (!fs.existsSync(galleryDir)) return sendError(res, "No hay galería", 404);
            appendCleanFolderToArchive(archive, galleryDir);
        } else {
            return sendError(res, "Tipo de descarga no válido (use main, all, parts o gallery)");
        }

        await archive.finalize();
    } catch (error) {
        if (!res.headersSent) sendError(res, error.message);
    }
};

/**
 * Obtiene el historial de descargas del usuario autenticado.
 */
const getUserHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const history = await getDownloadsHistory(req.user.id, { page, limit });
        sendSuccess(res, "Historial recuperado", history);
    } catch (error) {
        sendError(res, error.message, 500);
    }
};

/**
 * Obtiene las estadísticas de descarga de un modelo.
 */
const getModelStats = async (req, res) => {
    try {
        const stats = await getModelDownloadStats(req.params.modelId, req.user);
        sendSuccess(res, "Estadísticas recuperadas", stats);
    } catch (error) {
        sendError(res, error.message, 403);
    }
};

export { record, getUserHistory, getModelStats };