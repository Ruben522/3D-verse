/**
 * Envía una respuesta JSON de éxito estandarizada.
 * Formato: { message: string, data?: any }
 * Útil para mantener consistencia en todas las respuestas exitosas de la API.
 *
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @param {string} message - Mensaje descriptivo del éxito
 * @param {any} [data=null] - Datos opcionales a devolver (objeto, array, etc.)
 * @param {number} [statusCode=200] - Código HTTP de estado (200 OK por defecto)
 * @returns {import("express").Response} Respuesta enviada
 */
const sendSuccess = (
    res,
    message,
    data = null,
    statusCode = 200,
) => {
    const response = { message };
    if (data !== null && data !== undefined) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};

/**
 * Envía una respuesta JSON de error estandarizada.
 * Formato: { error: string }
 * Útil para mantener consistencia en respuestas de error de la API.
 *
 * @param {import("express").Response} res - Objeto de respuesta Express
 * @param {string} errorMessage - Mensaje descriptivo del error
 * @param {number} [statusCode=400] - Código HTTP de error (400 Bad Request por defecto)
 * @returns {import("express").Response} Respuesta enviada
 */
const sendError = (res, errorMessage, statusCode = 400) => {
    return res
        .status(statusCode)
        .json({ error: errorMessage });
};

export { sendSuccess, sendError };
