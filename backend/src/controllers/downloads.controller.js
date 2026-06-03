import archiver from "archiver";
import https from "https";
import prisma from "../config/prisma.js";
import { recordDownload, getDownloadsHistory, getModelDownloadStats } from "../services/downloads.service.js";
import { sendSuccess, sendError } from "../utils/helper/response.helper.js";

const appendUrlToArchive = (archive, url, zipPath) => {
    return new Promise((resolve, reject) => {
        if (!url) return resolve();
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                console.warn(`⚠️ No se pudo descargar: ${url}`);
                return resolve();
            }
            archive.append(response, { name: zipPath });
            response.on('end', resolve);
            response.on('error', reject);
        }).on('error', reject);
    });
};

const record = async (req, res) => {
    try {
        const { modelId } = req.params;
        const { type } = req.query;

        await recordDownload(modelId, req.user || null, req.ip, req.headers["user-agent"]);

        const model = await prisma.models.findUnique({
            where: { id: modelId },
            include: { model_parts: true, model_images: true }
        });

        if (!model) return sendError(res, "El modelo solicitado no existe.", 404);

        const cleanTitle = model.title.replace(/[^a-zA-Z0-9]/g, "_");

        if (!type || type === "main") {
            const downloadUrl = model.file_url.replace('/upload/', '/upload/fl_attachment/');
            return res.redirect(downloadUrl);
        }

        res.attachment(`${cleanTitle}_${type}.zip`);
        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        const downloadPromises = [];

        if (type === "all" || type === "parts") {
            if (type === "all" && model.file_url) {
                const ext = model.file_url.split('.').pop();
                downloadPromises.push(appendUrlToArchive(archive, model.file_url, `${cleanTitle}_main.${ext}`));
            }

            if (model.model_parts && model.model_parts.length > 0) {
                model.model_parts.forEach((part, index) => {
                    const ext = part.file_url.split('.').pop();
                    const partName = part.part_name ? part.part_name.replace(/[^a-zA-Z0-9]/g, "_") : `parte_${index}`;
                    downloadPromises.push(appendUrlToArchive(archive, part.file_url, `parts/${partName}.${ext}`));
                });
            } else if (type === "parts") {
                return sendError(res, "No hay partes adicionales.", 404);
            }
        }

        if (type === "all" || type === "gallery") {
            if (model.model_images && model.model_images.length > 0) {
                model.model_images.forEach((img, index) => {
                    const ext = img.image_url.split('.').pop();
                    downloadPromises.push(appendUrlToArchive(archive, img.image_url, `gallery/imagen_${index + 1}.${ext}`));
                });
            } else if (type === "gallery") {
                return sendError(res, "No hay galería disponible.", 404);
            }
        }

        if (!["main", "all", "parts", "gallery"].includes(type)) {
            return sendError(res, "Tipo de descarga no válido.", 400);
        }

        await Promise.all(downloadPromises);
        await archive.finalize();

    } catch (error) {
        console.error("❌ Error en descarga:", error);
        if (!res.headersSent) {
            sendError(res, "Error al procesar la descarga. " + error.message, 500);
        }
    }
};

const getUserHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const history = await getDownloadsHistory(req.user.id, { page, limit });
        sendSuccess(res, "Historial de descargas recuperado correctamente.", history);
    } catch (error) { sendError(res, error.message + ".", 500); }
};

const getModelStats = async (req, res) => {
    try {
        const stats = await getModelDownloadStats(req.params.modelId, req.user);
        sendSuccess(res, "Estadísticas de descargas recuperadas correctamente.", stats);
    } catch (error) {
        const status = error.message.includes("El modelo") ? 404 : 403;
        sendError(res, error.message + ".", status);
    }
};

export { record, getUserHistory, getModelStats };