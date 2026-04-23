import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../hooks/useAPI.js";
import useMessage from "../hooks/useMessage.js";

const user = createContext();

const UserContext = ({ children }) => {
  const navegar = useNavigate();
  const authAPI = useAPI();
  const { showMessage, showConfirm } = useMessage();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const userLocal = localStorage.getItem("user");
  const tokenLocal = localStorage.getItem("token");

  const sesionIniciadaInicial = !!tokenLocal;
  const datosSesionInicial = { name: "", username: "", email: "", password: "" };

  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(sesionIniciadaInicial);
  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [errorAuth, setErrorAuth] = useState(null);

  const [publicMyProfile, setPublicMyProfile] = useState(null);
  const [publicProfile, setPublicProfile] = useState(null);
  const [communityUsers, setCommunityUsers] = useState([]);

  const [isLoadingMyProfile, setIsLoadingMyProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });

  const normalizeUser = (userObj) => {
    if (!userObj) return null;

    let avatarUrl = null;
    let bannerUrl = null;

    if (userObj.avatar) {
      const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const cleanPath = userObj.avatar.startsWith('/') ? userObj.avatar : `/${userObj.avatar}`;
      avatarUrl = userObj.avatar.startsWith('http') ? userObj.avatar : `${cleanBase}${cleanPath}`;
    }

    if (userObj.banner_url) {
      const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const cleanPath = userObj.banner_url.startsWith('/') ? userObj.banner_url : `/${userObj.banner_url}`;
      bannerUrl = userObj.banner_url.startsWith('http') ? userObj.banner_url : `${cleanBase}${cleanPath}`;
    }

    const primaryColor = userObj.primary_color || '#3b82f6';
    const bgColorHex = primaryColor.replace('#', '');
    const safeUsername = userObj.username || 'User';

    const computedAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${safeUsername}&background=${bgColorHex}&color=fff&bold=true`;

    const computedBannerStyle = bannerUrl
      ? { backgroundImage: `url(${bannerUrl})` }
      : { backgroundColor: primaryColor };

    return {
      ...userObj,
      avatarUrl,
      bannerUrl,
      primaryColor,
      computedAvatar,
      computedBannerStyle,
      inicial: safeUsername.charAt(0).toUpperCase(),
      fechaRegistro: userObj.created_at ? new Date(userObj.created_at).toLocaleDateString() : "Desconocida",
    };
  };

  useEffect(() => {
    if (userLocal) {
      setCurrentUser(normalizeUser(JSON.parse(userLocal)));
    }
  }, []);

  useEffect(() => {
    getCommunityUsers();
  }, []);

  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setDatosSesion(datosSesionInicial);
    setErrorAuth(null);
  };

  const iniciarSesion = async (evento) => {
    if (evento) evento.preventDefault();
    setErrorAuth(null);
    try {
      const response = await authAPI.post(`${backendUrl}/auth/login`, {
        email: datosSesion.email,
        password: datosSesion.password
      });
      const { token, user } = response.data || response;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(normalizeUser(user));
      setIsAuthenticated(true);
      limpiarFormulario();
      navegar("/");
    } catch (error) {
      setErrorAuth("Credenciales incorrectas o error de servidor.");
    }
  };

  const registrarse = async (evento) => {
    if (evento) evento.preventDefault();
    setErrorAuth(null);
    try {
      const response = await authAPI.post(`${backendUrl}/auth/register`, datosSesion);
      const { token, user } = response.data || response;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setCurrentUser(normalizeUser(user));
      setIsAuthenticated(true);
      limpiarFormulario();
      navegar("/");
    } catch (error) {
      setErrorAuth("El usuario o correo ya están registrados.");
    }
  };

  const cerrarSesion = () => {
    showConfirm("¿Estás seguro que quieres cerrar sesión?", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsAuthenticated(false);
      limpiarFormulario();
      navegar("/login");
    });
  };

  const getCommunityUsers = async (page = 1, limit = 20) => {
    setIsLoadingCommunity(true);
    try {
      const response = await authAPI.get(`${backendUrl}/users/public?page=${page}&limit=${limit}`);
      const responseData = response.data?.data || response.data;
      const usersArray = responseData?.data || responseData;

      if (Array.isArray(usersArray)) {
        setCommunityUsers(usersArray.map(normalizeUser));
        setPagination({ page: response.data.page, total: response.data.total, totalPages: response.data.totalPages });
      } else {
        setCommunityUsers([]);
      }

    } catch (error) {
      console.error("Error cargando la comunidad:", error);
    } finally {
      setIsLoadingCommunity(false);
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
      console.error("Error cargando el perfil:", error);
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
      console.error("Error cargando tu perfil:", error);
    } finally {
      setIsLoadingMyProfile(false);
    }
  };

  const checkIsOwnProfile = (userId) => {
    return currentUser?.id === userId;
  };

  const getProfileRoute = (userId, username) => {
    return checkIsOwnProfile(userId) ? '/profile' : `/perfil/${username}`;
  };

  const exportData = {
    currentUser,
    isAuthenticated,
    datosSesion,
    errorAuth,
    isAuthLoading: authAPI.isLoading,
    actualizarDato,
    limpiarFormulario,
    iniciarSesion,
    registrarse,
    cerrarSesion,
    publicProfile,
    publicMyProfile,
    communityUsers,
    isLoadingProfile,
    isLoadingMyProfile,
    isLoadingCommunity,
    getCommunityUsers,
    getMyPublicProfile,
    getPublicProfile,
    checkIsOwnProfile,
    getProfileRoute,
    pagination,
  };

  return <user.Provider value={exportData}>{children}</user.Provider>;
};

export { user };
export default UserContext;