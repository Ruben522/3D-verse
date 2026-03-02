import {
    recordDownload,
    getDownloadsHistory,
    getModelDownloadStats,
} from "../services/downloads.service.js";

const record = async (req, res) => {
    try {
        const tokenUser = req.user || null;
        const ip = req.ip;
        const userAgent = req.headers["user-agent"];

        const result = await recordDownload(
            req.params.modelId,
            tokenUser,
            ip,
            userAgent,
        );

        const fullUrl = `${req.protocol}://${req.get('host')}${result.file_url}`;

        res.status(200).json({
            ...result,
            file_url: fullUrl
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserHistory = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const history = await getDownloadsHistory(req.user.id, { page, limit });

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getModelStats = async (req, res) => {
    try {
        const stats = await getModelDownloadStats(req.params.modelId, req.user);
        res.status(200).json(stats);
    } catch (error) {
        res.status(403).json({ error: error.message });
    }
};

export { record, getUserHistory, getModelStats };