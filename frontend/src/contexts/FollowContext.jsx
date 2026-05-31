import React, { createContext, useState, useEffect } from "react";
import useAPI from "../hooks/useAPI.js";
import useUsers from "../hooks/useUsers.js";
import { normalizeUser } from "../utils/normalizers";
import { useTranslation } from "react-i18next";
import useMessage from "../hooks/useMessage.js";

const follow = createContext();

const FollowContext = ({ children }) => {
    const { isAuthenticated, currentUser } = useUsers();
    const { showMessage } = useMessage();
    const { t } = useTranslation();

    const api = useAPI();

    const backendUrl = import.meta.env.VITE_API_URL;

    const [followedUsers, setFollowedUsers] = useState(new Set());

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [followersPagination, setFollowersPagination] = useState(null);
    const [followingPagination, setFollowingPagination] = useState(null);

    const [isLoadingFollowers, setIsLoadingFollowers] = useState(false);
    const [isLoadingFollowing, setIsLoadingFollowing] = useState(false);

    useEffect(() => {
        if (isAuthenticated && currentUser?.id) {
            loadFollowings();
        } else {
            setFollowedUsers(new Set());
        }
    }, [isAuthenticated, currentUser]);

    const loadFollowings = async () => {
        try {
            const response = await api.get(
                `${backendUrl}/followers/${currentUser.id}/following`
            );
            const users = response.data?.data || [];

            const ids = users.map(user => user.id);

            setFollowedUsers(new Set(ids));
        } catch (error) {
            showMessage(t("follow_context.load_followings_error"), "error");
        }
    };

    const getFollowers = async (userId, page = 1) => {
        setIsLoadingFollowers(true);
        try {
            const response = await api.get(
                `${backendUrl}/followers/${userId}/followers?page=${page}`
            );
            const users = response.data?.data || [];
            setFollowers(users.map(normalizeUser));

            setFollowersPagination({
                page: response.data?.page,
                total: response.data?.total,
                totalPages: response.data?.totalPages,
            });

        } catch (error) {
            showMessage(t("follow_context.load_followers_error"), "error");
        } finally {
            setIsLoadingFollowers(false);
        }
    };

    const getFollowing = async (userId, page = 1) => {
        setIsLoadingFollowing(true);
        try {
            const response = await api.get(
                `${backendUrl}/followers/${userId}/following?page=${page}`
            );
            const users = response.data?.data || [];

            setFollowing(users.map(normalizeUser));

            setFollowingPagination({
                page: response.data?.page,
                total: response.data?.total,
                totalPages: response.data?.totalPages,
            });

        } catch (error) {
            showMessage(t("follow_context.load_following_error"), "error");
        } finally {
            setIsLoadingFollowing(false);
        }
    };

    const toggleFollow = async (e, targetUserId) => {
        if (e) e.preventDefault();
        const isFollowed = followedUsers.has(targetUserId);
        setFollowedUsers((prev) => {
            const next = new Set(prev);
            if (isFollowed) {
                next.delete(targetUserId);
            } else {
                next.add(targetUserId);
            }
            return next;
        });

        try {
            if (isFollowed) {
                await api.remove(`${backendUrl}/followers/${targetUserId}`);
            } else {
                await api.post(`${backendUrl}/followers/${targetUserId}`);
            }
        } catch (error) {
            setFollowedUsers((prev) => {
                const next = new Set(prev);
                if (isFollowed) {
                    next.add(targetUserId);
                } else {
                    next.delete(targetUserId);
                }
                return next;
            });
            showMessage(t("follow_context.toggle_follow_error"), "error");
        }
    };

    const exportData = {
        followedUsers,
        followers,
        following,
        followersPagination,
        followingPagination,
        isLoadingFollowers,
        isLoadingFollowing,
        getFollowers,
        getFollowing,
        toggleFollow,
    };

    return (
        <follow.Provider value={exportData}>
            {children}
        </follow.Provider>
    );
};

export { follow };

export default FollowContext;