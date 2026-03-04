/**
 * Envía una respuesta de éxito estándar.
 */
const sendSuccess = (res, message, data = null, statusCode = 200) => {
    const response = { message };
    if (data) response.data = data;
    return res.status(statusCode).json(response);
};

/**
 * Envía una respuesta de error estándar.
 */
const sendError = (res, errorMessage, statusCode = 400) => {
    return res.status(statusCode).json({ error: errorMessage });
};

export { sendSuccess, sendError };