import React, { createContext, useState, useEffect } from "react";
import useAPI from "../hooks/useAPI.js";
import useUsers from "../hooks/useUsers.js";

const follow = createContext();

const FollowContext = ({ children }) => {
    const { isAuthenticated, currentUser } = useUsers();
    const api = useAPI();
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const [followedUsers, setFollowedUsers] = useState(new Set());

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            cargarSeguidos();
        } else {
            setFollowedUsers(new Set());
        }
    }, [isAuthenticated, currentUser]);

    const cargarSeguidos = async () => {
        try {
            // Ajusta esta URL a tu endpoint que devuelve los usuarios que sigues
            const res = await api.get(`${backendUrl}/followers/${currentUser.id}/following`);
            const data = res.data?.data || res.data || res || [];

            const followIds = new Set();
            data.forEach(item => {
                // Dependiendo de tu backend, el ID podría venir como following_id, user_id, o id
                if (item.following_id) followIds.add(item.following_id);
                else if (item.id) followIds.add(item.id);
            });

            setFollowedUsers(followIds);
        } catch (error) {
            console.error("Error al cargar los usuarios seguidos:", error);
        }
    };

    const toggleFollow = async (e, targetUserId) => {
        if (e) e.preventDefault();

        const isFollowed = followedUsers.has(targetUserId);

        setFollowedUsers(prev => {
            const next = new Set(prev);
            isFollowed ? next.delete(targetUserId) : next.add(targetUserId);
            return next;
        });

        try {
            if (isFollowed) {
                await api.remove(`${backendUrl}/followers/${targetUserId}`);
            } else {
                await api.post(`${backendUrl}/followers/${targetUserId}`);
            }
        } catch (error) {
            setFollowedUsers(prev => {
                const next = new Set(prev);
                isFollowed ? next.add(targetUserId) : next.delete(targetUserId);
                return next;
            });
            console.error("Error al procesar el Follow:", error);
        }
    };

    const exportData = { followedUsers, toggleFollow };

    return (
        <follow.Provider value={exportData}>
            {children}
        </follow.Provider>
    );
};

export { follow };
export default FollowContext;