import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../hooks/useAPI.js";
import useMessage from "../hooks/useMessage.js";
import { normalizeUser, normalizeModelForCard } from "../utils/normalizers";
import { usersIndex } from "../services/meiliClient";
import { validateLogin, validateRegister } from "../utils/userValidations";
import { useTranslation } from "react-i18next";

const userContext = createContext();

const UserContext = ({ children }) => {
  const navigate = useNavigate();
  const authAPI = useAPI();
  const { showMessage, showConfirm } = useMessage();
  const { t } = useTranslation();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const initialAuthData = { name: "", username: "", email: "", password: "" };
  const initialProfileData = {
    username: "", name: "", lastname: "", bio: "", location: "",
    youtube: "", twitter: "", linkedin: "", github: "",
    card_bg_color: "#eaeaea", primary_color: "#851bd1"
  };
  const initialPagination = { page: 1, total: 0, totalPages: 1 };

  const sortOptions = [
    { value: "followers_count:desc", label: t("user_context.sort_options.more_followers") },
    { value: "models_count:desc", label: t("user_context.sort_options.more_models") }
  ];

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [authData, setAuthData] = useState(initialAuthData);
  const [authError, setAuthError] = useState(null);

  const [profileData, setProfileData] = useState(initialProfileData);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [activeProfileData, setActiveProfileData] = useState(null);
  const [isLoadingActiveProfile, setIsLoadingActiveProfile] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState("models");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [publicMyProfile, setPublicMyProfile] = useState(null);
  const [publicProfile, setPublicProfile] = useState(null);
  const [isLoadingMyProfile, setIsLoadingMyProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [communityUsers, setCommunityUsers] = useState([]);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [userSortBy, setUserSortBy] = useState("followers_count:desc");
  const [pagination, setPagination] = useState(initialPagination);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const userLocal = localStorage.getItem("user");
    if (userLocal) {
      setCurrentUser(normalizeUser(JSON.parse(userLocal)));
    }
  }, []);

  const updateAuthData = useCallback((e) => {
    const { name, value } = e.target;
    setAuthData((prev) => ({ ...prev, [name]: value }));
    if (authError) setAuthError(null);
  }, [authError]);

  const clearAuthForm = useCallback(() => {
    setAuthData(initialAuthData);
    setAuthError(null);
  }, []);

  const login = async (e) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const validationError = validateLogin(authData);
    if (validationError) return setAuthError(validationError);

    try {
      const response = await authAPI.post(`${backendUrl}/auth/login`, {
        email: authData.email.trim(),
        password: authData.password
      });
      const { token, user } = response.data || response;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(normalizeUser(user));
      setIsAuthenticated(true);
      clearAuthForm();
      navigate("/");
    } catch (error) {
      setAuthError(t("user_context.login_error"));
    }
  };

  const register = async (e) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const validationError = validateRegister(authData);
    if (validationError) return setAuthError(validationError);

    try {
      const response = await authAPI.post(`${backendUrl}/auth/register`, {
        name: authData.name.trim(),
        username: authData.username.trim(),
        email: authData.email.trim(),
        password: authData.password
      });
      const { token, user } = response.data || response;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(normalizeUser(user));
      setIsAuthenticated(true);
      clearAuthForm();
      navigate("/");
    } catch (error) {
      setAuthError(t("user_context.register_error"));
    }
  };

  const logout = useCallback(() => {
    showConfirm(t("user_context.logout_question"), () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsAuthenticated(false);
      clearAuthForm();
      navigate("/login");
    });
  }, [showConfirm, clearAuthForm, navigate]);

  const deleteUser = useCallback(async (userId) => {
    showConfirm(
      t("user_context.delete_user_confirmation"),
      async () => {
        setIsUpdatingProfile(true);
        try {
          await authAPI.remove(`${backendUrl}/users/${userId}`);

          const isMyAccount = String(currentUser?.id) === String(userId);

          if (isMyAccount) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setCurrentUser(null);
            setIsAuthenticated(false);
            clearAuthForm();
            navigate("/", { replace: true });
            showMessage(t("user_context.delete_user_success"), "success");
          } else {
            setCommunityUsers(prev => prev.filter(u => u.id !== userId));
            showMessage(t("user_context.delete_user_success"), "success");
          }
        } catch (error) {
          showMessage(t("user_context.delete_user_error"), "error");
        } finally {
          setIsUpdatingProfile(false);
        }
      }
    );
  }, [currentUser, authAPI, backendUrl, navigate, showConfirm, showMessage, clearAuthForm]);

  const searchCommunityUsers = useCallback(async (query = "", page = 1) => {
    setIsLoadingCommunity(true);
    setIsSearchingUsers(true);
    try {
      const searchParams = {
        hitsPerPage: 20,
        page: page,
        sort: [userSortBy]
      };

      const results = await usersIndex.search(query, searchParams);
      setCommunityUsers(results.hits.map(normalizeUser));
      setPagination({
        page: results.page,
        total: results.totalHits,
        totalPages: results.totalPages
      });
    } catch (error) {
      showMessage(t("user_context.community_search_error"), "error");
    } finally {
      setIsLoadingCommunity(false);
      setIsSearchingUsers(false);
    }
  }, [userSortBy]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCommunityUsers(searchUserTerm, 1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchUserTerm, userSortBy, searchCommunityUsers]);

  const loadProfileSettings = useCallback(() => {
    if (currentUser) {
      setProfileData({
        username: currentUser.username || "",
        name: currentUser.name || "",
        lastname: currentUser.lastname || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        youtube: currentUser.youtube || "",
        twitter: currentUser.twitter || "",
        linkedin: currentUser.linkedin || "",
        github: currentUser.github || "",
        primary_color: currentUser.primary_color || "#3b82f6",
        banner_url: currentUser.banner_url || "",
        avatar: currentUser.avatar || ""
      });
    }
  }, [currentUser]);

  const updateProfileData = useCallback((e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const saveProfileChanges = async (e) => {
    if (e) e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await authAPI.put(`${backendUrl}/users/${currentUser.id}`, profileData);
      const updatedUser = response.data?.data || response.data;

      const normalUser = normalizeUser(updatedUser);
      setCurrentUser(normalUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate('/profile');
      showMessage(t("user_context.profile_updated"), "success");
    } catch (error) {
      showMessage(error.response?.data?.message || t("user_context.profile_update_error"), "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const clearAvatar = useCallback(() => setProfileData(prev => ({ ...prev, avatar: "" })), []);
  const clearBanner = useCallback(() => setProfileData(prev => ({ ...prev, banner_url: "" })), []);

  const loadProfile = async (usernameParam) => {
    const own = !usernameParam;
    setIsOwnProfile(own);
    setIsLoadingActiveProfile(true);
    setActiveProfileData(null);

    try {
      let data;
      if (own) {
        if (!currentUser?.id) return;
        const response = await authAPI.get(`${backendUrl}/users/${currentUser.id}`);
        data = response.data?.data || response.data;
      } else {
        const response = await authAPI.get(`${backendUrl}/users/perfil/${usernameParam}`);
        data = response.data?.data || response.data;
      }

      const normalizedUserProfile = normalizeUser(data.profile);
      const normalizedModels = (data.content?.recent_models || []).map(rawModel =>
        normalizeModelForCard(rawModel, normalizedUserProfile)
      );

      setActiveProfileData({
        profile: normalizedUserProfile,
        stats: data.stats,
        content: {
          ...data.content,
          recent_models: normalizedModels
        },
      });
    } catch (error) {
      showMessage(t("user_context.load_profile_error"), "error");
    } finally {
      setIsLoadingActiveProfile(false);
    }
  };

  const getPublicProfile = async (username) => {
    setIsLoadingProfile(true);
    setPublicProfile(null);
    try {
      const response = await authAPI.get(`${backendUrl}/users/perfil/${username}`);
      const data = response.data?.data || response.data;
      setPublicProfile({
        profile: normalizeUser(data.profile),
        stats: data.stats,
        content: data.content
      });
    } catch (error) {
      showMessage(t("user_context.load_profile_error"), "error");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const getMyPublicProfile = async (id) => {
    setIsLoadingMyProfile(true);
    setPublicMyProfile(null);
    try {
      const response = await authAPI.get(`${backendUrl}/users/${id}`);
      const data = response.data?.data || response.data;
      setPublicMyProfile({
        profile: normalizeUser(data.profile),
        stats: data.stats,
        content: data.content
      });
    } catch (error) {
      showMessage(t("user_context.load_profile_error"), "error");
    } finally {
      setIsLoadingMyProfile(false);
    }
  };

  const checkIsOwnProfile = useCallback((userId) => currentUser?.id === userId, [currentUser]);
  const checkIsOwnModel = useCallback((model) => {
    if (!currentUser || !model) return false;
    return currentUser.id === (model.user_id || model.userId) || currentUser.username === model.username;
  }, [currentUser]);

  const getProfileRoute = useCallback((userId, username) => checkIsOwnProfile(userId) ? '/profile' : `/perfil/${username}`, [checkIsOwnProfile]);
  const changeProfileTab = useCallback((tab) => setActiveProfileTab(tab), []);
  const getProfileModels = useCallback(() => activeProfileData?.content?.recent_models || [], [activeProfileData]);

  const getProfileStyles = useCallback((userObj) => {
    if (!userObj) return {};
    const custom = userObj.customization || userObj.profile || userObj;
    return {
      bannerBg: {
        backgroundImage: custom.banner_url ? `url(${custom.banner_url})` : 'none',
        backgroundColor: custom.primary_color || '#3b82f6',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    };
  }, []);

  const clearCommunitySearch = useCallback(() => {
    setSearchUserTerm("");
  }, []);

  const exportData = {
    currentUser,
    isAuthenticated,
    authData,
    authError,
    isAuthLoading: authAPI.isLoading,
    updateAuthData,
    clearAuthForm,
    login,
    register,
    logout,
    deleteUser,
    profileData,
    updateProfileData,
    loadProfileSettings,
    saveProfileChanges,
    isUpdatingProfile,
    clearAvatar,
    clearBanner,
    publicProfile,
    publicMyProfile,
    communityUsers,
    isLoadingProfile,
    isLoadingMyProfile,
    isLoadingCommunity,
    getMyPublicProfile,
    getPublicProfile,
    checkIsOwnProfile,
    checkIsOwnModel,
    getProfileRoute,
    pagination,
    changeProfileTab,
    getProfileModels,
    activeProfileTab,
    activeProfileData,
    isLoadingActiveProfile,
    loadProfile,
    isOwnProfile,
    searchUserTerm,
    setSearchUserTerm,
    searchCommunityUsers,
    userSortBy,
    setUserSortBy,
    isSearchingUsers,
    getProfileStyles,
    isAdmin,
    sortOptions,
    clearCommunitySearch,
    datosSesion: authData,
    errorAuth: authError,
    actualizarDato: updateAuthData,
    limpiarFormulario: clearAuthForm,
    iniciarSesion: login,
    registrarse: register,
    cerrarSesion: logout,
    eliminarUsuario: deleteUser,
    datosPerfil: profileData,
    actualizarDatoPerfil: updateProfileData,
    cargarDatosConfiguracion: loadProfileSettings,
    guardarCambiosPerfil: saveProfileChanges,
    handleClearAvatar: clearAvatar,
    handleClearBanner: clearBanner
  };

  return <userContext.Provider value={exportData}>{children}</userContext.Provider>;
};

// Mantenemos el export de la variable antigua "user" por compatibilidad
export { userContext };
export default UserContext;