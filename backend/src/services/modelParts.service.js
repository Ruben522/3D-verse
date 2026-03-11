import prisma from "../config/prisma.js";
import fs from "fs";
import path from "path";
import { checkPermission } from "../utils/checkPermission.js";

/**
 * Añade una nueva pieza (parte/componente) a un modelo existente.
 * Solo el propietario del modelo o un administrador puede realizar esta acción.
 *
 * @param {Object} user - Usuario autenticado que realiza la acción
 * @param {string} modelId - ID del modelo al que se añadirá la pieza
 * @param {Object} data - Datos de la pieza a crear
 * @param {string} [data.color] - Color de la pieza (opcional)
 * @param {string} data.part_name - Nombre de la pieza (obligatorio)
 * @param {string} data.file_url - URL/ruta del archivo de la pieza (obligatorio)
 * @param {number} [data.file_size] - Tamaño del archivo en bytes (opcional)
 * @returns {Promise<Object>} La pieza recién creada
 * @throws {Error} "Modelo no encontrado" si el modelo no existe
 * @throws {Error} Si el usuario no tiene permiso sobre el modelo
 * @throws {Error} Si faltan campos obligatorios (part_name o file_url)
 */
const createPart = async (user, modelId, data) => {
    const { color, part_name, file_url, file_size } = data;

    // Validaciones básicas de campos obligatorios
    if (
        !part_name ||
        typeof part_name !== "string" ||
        part_name.trim() === ""
    ) {
        throw new Error(
            "El nombre de la pieza es obligatorio.",
        );
    }

    if (
        !file_url ||
        typeof file_url !== "string" ||
        file_url.trim() === ""
    ) {
        throw new Error(
            "La URL/ruta del archivo de la pieza es obligatoria.",
        );
    }

    const model = await prisma.models.findUnique({
        where: { id: modelId },
        select: { user_id: true },
    });

    if (!model) throw new Error("Modelo no encontrado.");

    checkPermission(model.user_id, user);

    const newPart = await prisma.model_parts.create({
        data: {
            model_id: modelId,
            color: color || null,
            part_name: part_name.trim(),
            file_url: file_url.trim(),
            file_size: file_size || null,
        },
    });

    return newPart;
};

/**
 * Obtiene una lista paginada de TODAS las piezas registradas en el sistema.
 * Útil principalmente para propósitos administrativos o auditoría.
 *
 * @param {Object} [options] - Opciones de paginación
 * @param {number} [options.page=1] - Número de página (base 1)
 * @param {number} [options.limit=20] - Cantidad de registros por página (máximo 50)
 * @returns {Promise<Object>} Objeto con paginación y lista de piezas
 * @property {number} page - Página actual
 * @property {number} limit - Registros por página
 * @property {number} total - Total de piezas en el sistema
 * @property {number} totalPages - Total de páginas disponibles
 * @property {Array<Object>} data - Lista de piezas
 */
const getParts = async ({ page = 1, limit = 20 }) => {
    const safeLimit = Math.min(limit, 50);
    const offset = (page - 1) * safeLimit;

    const [total, partsList] = await prisma.$transaction([
        prisma.model_parts.count(),
        prisma.model_parts.findMany({
            orderBy: { created_at: "desc" },
            skip: offset,
            take: safeLimit,
        }),
    ]);

    return {
        page,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
        data: partsList,
    };
};

/**
 * Obtiene todas las piezas asociadas a un modelo específico,
 * ordenadas por fecha de creación ascendente.
 *
 * @param {string} modelId - ID del modelo cuyas piezas se desean obtener
 * @returns {Promise<Array<Object>>} Lista de piezas del modelo
 */
const getPartsByModelId = async (modelId) => {
    const parts = await prisma.model_parts.findMany({
        where: { model_id: modelId },
        orderBy: { created_at: "asc" },
    });
    return parts;
};

/**
 * Elimina una pieza específica tanto de la base de datos como del sistema de archivos.
 * Solo el propietario del modelo o un administrador puede eliminarla.
 *
 * @param {string} partId - ID de la pieza a eliminar
 * @param {Object} user - Usuario autenticado que realiza la acción
 * @returns {Promise<{ message: string }>} Mensaje de confirmación
 * @throws {Error} "Parte no encontrada" si la pieza no existe
 * @throws {Error} Si el usuario no tiene permiso sobre el modelo propietario
 */
const deletePart = async (partId, user) => {
    const part = await prisma.model_parts.findUnique({
        where: { id: partId },
        include: { models: { select: { user_id: true } } },
    });

    if (!part) throw new Error("Parte no encontrada.");

    checkPermission(part.models.user_id, user);

    await prisma.model_parts.delete({
        where: { id: partId },
    });

    let filePath = part.file_url;
    if (filePath.startsWith("/")) {
        filePath = filePath.slice(1);
    }

    const absolutePath = path.resolve(
        process.cwd(),
        filePath,
    );

    try {
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    } catch (fsError) {}

    return { message: "Parte eliminada correctamente." };
};

export {
    createPart,
    getParts,
    getPartsByModelId,
    deletePart,
};
