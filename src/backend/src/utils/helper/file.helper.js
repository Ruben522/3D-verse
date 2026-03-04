import fs from "fs";
import path from "path";

/**
 * Resuelve la ruta absoluta de un archivo a partir de su URL en la base de datos.
 */
const getAbsolutePath = (fileUrl) => {
    if (!fileUrl) return null;
    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    return path.resolve(process.cwd(), relativePath);
};

/**
 * Borra un archivo físico del disco de forma segura.
 */
const deletePhysicalFile = (fileUrl) => {
    const absolutePath = getAbsolutePath(fileUrl);
    
    if (absolutePath && fs.existsSync(absolutePath)) {
        try {
            fs.unlinkSync(absolutePath);
            console.log(`[FILE HELPER] 🗑️ Archivo eliminado: ${absolutePath}`);
            return true;
        } catch (error) {
            console.error(`[FILE HELPER] ❌ Error al borrar: ${absolutePath}`, error);
        }
    } else {
        console.log(`[FILE HELPER] ⚠️ El archivo no existía en el disco: ${absolutePath}`);
    }
    return false;
};

/**
 * Borra una carpeta completa y todo su contenido (ej: al borrar un modelo entero).
 */
const deletePhysicalFolder = (fileUrl) => {
    const absolutePath = getAbsolutePath(fileUrl);
    if (!absolutePath) return false;

    const folderPath = path.dirname(absolutePath);
    if (fs.existsSync(folderPath)) {
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`[FILE HELPER] 📂 Carpeta eliminada: ${folderPath}`);
            return true;
        } catch (error) {
            console.error(`[FILE HELPER] ❌ Error al borrar carpeta: ${folderPath}`, error);
        }
    }
    return false;
};

/**
 * Extrae el nombre limpio del archivo para mostrarlo al usuario (sin prefijos ni fechas).
 */
const getDisplayFileName = (serverFileName) => {
    return serverFileName.replace(/^(main_|cover_)?(\d+_)?/, "");
};

export { 
    getAbsolutePath, 
    deletePhysicalFile, 
    deletePhysicalFolder, 
    getDisplayFileName 
};