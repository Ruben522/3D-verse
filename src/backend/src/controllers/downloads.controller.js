import archiver from "archiver";
import fs from "fs";
import path from "path";
import {
    recordDownload,
    getDownloadsHistory,
    getModelDownloadStats,
    getDownloadInfo,
} from "../services/downloads.service.js";
import {
    sendSuccess,
    sendError,
} from "../utils/helper/response.helper.js";
import { getDisplayFileName } from "../utils/helper/file.helper.js";

/**
 * Añade recursivamente los archivos de una carpeta a un ZIP, limpiando nombres de archivo.
 * Ignora subcarpetas (solo archivos directos).
 *
 * @param {archiver.Archiver} archive - Instancia del ZIP en curso
 * @param {string} folderPath - Ruta absoluta de la carpeta a comprimir
 * @param {string} [zipSubFolder=""] - Subcarpeta dentro del ZIP (ej: "parts", "gallery")
 */
const appendCleanFolderToArchive = (
    archive,
    folderPath,
    zipSubFolder = "",
) => {
    if (!fs.existsSync(folderPath)) return;

    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isFile()) {
            const cleanName = getDisplayFileName(file);
            const zipPath = zipSubFolder
                ? `${zipSubFolder}/${cleanName}`
                : cleanName;
            archive.file(filePath, { name: zipPath });
        }
    }
};

/**
 * Registra la descarga y devuelve el archivo solicitado (individual o ZIP comprimido).
 * Soporta tipos: main (por defecto), all, parts, gallery.
 * Limpia nombres de archivo y registra IP, user-agent y usuario (si autenticado).
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const record = async (req, res) => {
    try {
        const { modelId } = req.params;
        const { type } = req.query;

        await recordDownload(
            modelId,
            req.user || null,
            req.ip,
            req.headers["user-agent"],
        );

        const info = await getDownloadInfo(modelId);

        if (!type || type === "main") {
            return res.download(
                info.absolutePath,
                info.cleanName,
            );
        }

        const archive = archiver("zip", {
            zlib: { level: 9 },
        });
        const baseName = info.cleanName.split(".")[0];

        res.attachment(`${baseName}_${type}.zip`);
        archive.pipe(res);

        if (type === "all") {
            appendCleanFolderToArchive(
                archive,
                info.modelFolder,
            );
            appendCleanFolderToArchive(
                archive,
                path.join(info.modelFolder, "parts"),
                "parts",
            );
            appendCleanFolderToArchive(
                archive,
                path.join(info.modelFolder, "gallery"),
                "gallery",
            );
        } else if (type === "parts") {
            const partsDir = path.join(
                info.modelFolder,
                "parts",
            );
            if (!fs.existsSync(partsDir)) {
                return sendError(
                    res,
                    "No hay partes adicionales.",
                    404,
                );
            }
            appendCleanFolderToArchive(archive, partsDir);
        } else if (type === "gallery") {
            const galleryDir = path.join(
                info.modelFolder,
                "gallery",
            );
            if (!fs.existsSync(galleryDir)) {
                return sendError(
                    res,
                    "No hay galería disponible.",
                    404,
                );
            }
            appendCleanFolderToArchive(archive, galleryDir);
        } else {
            return sendError(
                res,
                "Tipo de descarga no válido. Usa: main, all, parts o gallery.",
                400,
            );
        }

        await archive.finalize();
    } catch (error) {
        if (!res.headersSent) {
            const status = error.message.includes(
                "El modelo solicitado no existe",
            )
                ? 404
                : 500;
            sendError(res, error.message + ".", status);
        }
    }
};

/**
 * Obtiene el historial paginado de descargas del usuario autenticado.
 * Requiere autenticación.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getUserHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const history = await getDownloadsHistory(
            req.user.id,
            { page, limit },
        );
        sendSuccess(
            res,
            "Historial de descargas recuperado correctamente.",
            history,
        );
    } catch (error) {
        sendError(res, error.message + ".", 500);
    }
};

/**
 * Obtiene estadísticas detalladas de descargas de un modelo (total, únicos, anónimos, etc.).
 * Requiere ser propietario del modelo o administrador.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getModelStats = async (req, res) => {
    try {
        const stats = await getModelDownloadStats(
            req.params.modelId,
            req.user,
        );
        sendSuccess(
            res,
            "Estadísticas de descargas recuperadas correctamente.",
            stats,
        );
    } catch (error) {
        const status = error.message.includes(
            "El modelo solicitado no existe",
        )
            ? 404
            : 403;
        sendError(res, error.message + ".", status);
    }
};

export { record, getUserHistory, getModelStats };
