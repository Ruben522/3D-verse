const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:3000";

const formatUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
};

const normalizeUser = (userObj) => {
    if (!userObj) return null;

    const avatarUrl = formatUrl(userObj.avatar);
    const bannerUrl = formatUrl(userObj.banner_url);
    const primaryColor = userObj.primary_color || '#3b82f6';
    const bgColorHex = primaryColor.replace('#', '');
    const safeUsername = userObj.username || 'User';

    return {
        ...userObj,
        avatarUrl,
        bannerUrl,
        primaryColor,
        computedAvatar: avatarUrl || `https://ui-avatars.com/api/?name=${safeUsername}&background=${bgColorHex}&color=fff&bold=true`,
        computedBannerStyle: bannerUrl ? { backgroundImage: `url(${bannerUrl})` } : { backgroundColor: primaryColor },
        inicial: safeUsername.charAt(0).toUpperCase(),
        fechaRegistro: userObj.created_at ? new Date(userObj.created_at).toLocaleDateString() : "Desconocida",
    };
};

const normalizeModelForCard = (rawModel, authorOverride = null) => {
    if (!rawModel) return null;
    return {
        id: rawModel.id,
        title: rawModel.title,
        imageUrl: formatUrl(rawModel.main_image_url),
        views: rawModel.views || 0,
        downloads: rawModel.downloads || 0,
        likes: rawModel._count?.model_likes || 0,
        username: authorOverride?.username || rawModel.author?.username || "Desconocido",
        avatarUrl: formatUrl(authorOverride?.avatarUrl || authorOverride?.avatar || rawModel.author?.avatar) || "/default-avatar.png",
        categories: rawModel.model_category?.map(mc => mc.categories?.name) || [],
        tags: rawModel.model_tag?.map(mt => mt.tags?.name) || [],
    };
};

const normalizeModelData = (modelData) => {
    if (!modelData) return null;
    return {
        id: modelData.id,
        username: modelData.author?.username || "Desconocido",
        avatarUrl: formatUrl(modelData.author?.avatar) || "/default-avatar.png",
        createdDate: modelData.created_at ? new Date(modelData.created_at).toLocaleDateString() : "Desconocida",
        description: modelData.description,
        downloads: modelData.downloads || 0,
        fileUrl: formatUrl(modelData.file_url),
        imageUrl: formatUrl(modelData.main_image_url),
        title: modelData.title,
        updated_at: modelData.updated_at,
        videoUrl: formatUrl(modelData.video_url),
        views: modelData.views || 0,
        license: modelData.license,
        mainColor: modelData.main_color,
        likes: modelData._count?.model_likes || 0,
        categories: modelData.model_category?.map((c) => c.categories?.name) || [],
        tags: modelData.model_tag?.map((t) => t.tags?.name) || [],
        gallery: modelData.model_images?.sort((a, b) => a.display_order - b.display_order).map((img) => formatUrl(img.image_url)) || [],
        parts: modelData.model_parts?.map((p) => ({
            id: p.id,
            name: p.part_name,
            fileUrl: formatUrl(p.file_url),
            color: p.color,
        })) || [],
    };
};

const normalizeMeiliHit = (hit) => {
    if (!hit) return null;
    return {
        id: hit.id,
        username: hit.author_username || "Desconocido",
        avatarUrl: formatUrl(hit.author_avatar) || "/default-avatar.png",
        createdDate: hit.created_at ? new Date(hit.created_at).toLocaleDateString() : "Desconocida",
        description: hit.description,
        downloads: hit.downloads || 0,
        imageUrl: formatUrl(hit.main_image_url),
        title: hit.title,
        views: hit.views || 0,
        likes: hit.likes_count || 0,
        categories: hit.category_names || [],
        tags: hit.tag_names || [],
    };
};

export { normalizeUser, normalizeModelForCard, normalizeModelData, normalizeMeiliHit };