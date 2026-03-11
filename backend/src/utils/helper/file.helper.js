import fs from "fs";
import path from "path";

/**
 * Convierte una URL relativa almacenada en la BD (ej: /uploads/models/...) en una ruta absoluta del sistema de archivos.
 *
 * @param {string|null} fileUrl - URL relativa del archivo (puede empezar con / o no)
 * @returns {string|null} Ruta absoluta completa o null si no se proporciona URL
 */
const getAbsolutePath = (fileUrl) => {
    if (!fileUrl) return null;

    const relativePath = fileUrl.startsWith("/")
        ? fileUrl.slice(1)
        : fileUrl;
    return path.resolve(process.cwd(), relativePath);
};

/**
 * Elimina un archivo físico del disco de forma segura.
 * No lanza error si el archivo no existe o falla la eliminación (solo registra en consola).
 *
 * @param {string} fileUrl - URL relativa del archivo a eliminar
 * @returns {boolean} true si se eliminó correctamente, false si no existía o falló
 */
const deletePhysicalFile = (fileUrl) => {
    const absolutePath = getAbsolutePath(fileUrl);

    if (!absolutePath || !fs.existsSync(absolutePath)) {
        return false;
    }

    try {
        fs.unlinkSync(absolutePath);
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Elimina una carpeta completa y todo su contenido recursivamente.
 * Útil al borrar un modelo entero (incluye main file, parts, gallery, etc.).
 * No lanza error si la carpeta no existe o falla (solo registra en consola).
 *
 * @param {string} fileUrl - URL relativa de cualquier archivo dentro de la carpeta a eliminar
 * @returns {boolean} true si se eliminó la carpeta, false si no existía o falló
 */
const deletePhysicalFolder = (fileUrl) => {
    const absolutePath = getAbsolutePath(fileUrl);
    if (!absolutePath) return false;

    const folderPath = path.dirname(absolutePath);

    if (!fs.existsSync(folderPath)) {
        return false;
    }

    try {
        fs.rmSync(folderPath, {
            recursive: true,
            force: true,
        });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Limpia el nombre del archivo para mostrarlo al usuario o en descargas.
 * Elimina prefijos internos como "main_", "cover_" o timestamps "123456_".
 *
 * @param {string} serverFileName - Nombre del archivo tal como está guardado en el servidor
 * @returns {string} Nombre limpio y legible para el usuario
 */
const getDisplayFileName = (serverFileName) => {
    return serverFileName.replace(
        /^(main_|cover_)?(\d+_)?/,
        "",
    );
};

export {
    getAbsolutePath,
    deletePhysicalFile,
    deletePhysicalFolder,
    getDisplayFileName,
};
