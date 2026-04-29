import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../hooks/useAPI.js";
import useMessage from "../hooks/useMessage.js";
import { normalizeUser, normalizeModelForCard } from "../utils/normalizers";
import { usersIndex } from "../services/meiliClient";

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
  const datosPerfilInicial = {
    username: "", name: "", lastname: "", bio: "", location: "",
    youtube: "", twitter: "", linkedin: "", github: "",
    card_bg_color: "#ffffff", primary_color: "#3b82f6"
  };
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(sesionIniciadaInicial);
  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [datosPerfil, setDatosPerfil] = useState(datosPerfilInicial); // 🔥 NUEVO
  const [errorAuth, setErrorAuth] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [publicMyProfile, setPublicMyProfile] = useState(null);
  const [publicProfile, setPublicProfile] = useState(null);
  const [communityUsers, setCommunityUsers] = useState([]);

  const [isLoadingMyProfile, setIsLoadingMyProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [activeProfileTab, setActiveProfileTab] = useState("modelos");

  const [activeProfileData, setActiveProfileData] = useState(null);
  const [isLoadingActiveProfile, setIsLoadingActiveProfile] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [searchUserTerm, setSearchUserTerm] = useState("");
  const [userSortBy, setUserSortBy] = useState("followers_count:desc");
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);

  useEffect(() => {
    if (userLocal) {
      setCurrentUser(normalizeUser(JSON.parse(userLocal)));
    }
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

  const searchCommunityUsers = async (query = "", page = 1) => {
    setIsLoadingCommunity(true);
    setIsSearchingUsers(true);
    try {
      const searchParams = {
        hitsPerPage: 20,
        page: page,
        sort: [userSortBy]
      };

      const results = await usersIndex.search(query, searchParams);
      console.log("Hits de Meili:", results.hits);
      setCommunityUsers(results.hits.map(normalizeUser));
      setPagination({
        page: results.page,
        total: results.totalHits,
        totalPages: results.totalPages
      });
    } catch (error) {
      console.error("Error buscando en la comunidad:", error);
    } finally {
      setIsLoadingCommunity(false);
      setIsSearchingUsers(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCommunityUsers(searchUserTerm, 1);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchUserTerm, userSortBy]);

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
      console.error("Error cargando perfil:", error);
    } finally {
      setIsLoadingActiveProfile(false);
    }
  };

  const changeProfileTab = (tab) => {
    setActiveProfileTab(tab);
  };

  const getProfileModels = () => {
    return activeProfileData?.content?.recent_models || [];
  };


  const actualizarDatoPerfil = (evento) => {
    const { name, value } = evento.target;
    setDatosPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const cargarDatosConfiguracion = () => {
    if (currentUser) {
      setDatosPerfil({
        username: currentUser.username || "",
        name: currentUser.name || "",
        lastname: currentUser.lastname || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
        youtube: currentUser.youtube || "",
        twitter: currentUser.twitter || "",
        linkedin: currentUser.linkedin || "",
        github: currentUser.github || "",
        card_bg_color: currentUser.card_bg_color || "#ffffff",
        primary_color: currentUser.primary_color || "#3b82f6"
      });
    }
  };

  const guardarCambiosPerfil = async (evento) => {
    if (evento) evento.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const response = await authAPI.put(`${backendUrl}/users/${currentUser.id}`, datosPerfil);
      const updatedUser = response.data?.data || response.data;

      const normalUser = normalizeUser(updatedUser);
      setCurrentUser(normalUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      showMessage("Perfil actualizado correctamente", "success");
    } catch (error) {
      showMessage(error.response?.data?.message || "Error al actualizar el perfil", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
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
    getMyPublicProfile,
    getPublicProfile,
    checkIsOwnProfile,
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
    userSortBy,
    setUserSortBy,
    isSearchingUsers,
    datosPerfil,
    actualizarDatoPerfil,
    cargarDatosConfiguracion,
    guardarCambiosPerfil,
    isUpdatingProfile,
    setSearchUserTerm,
    setUserSortBy
  };

  return <user.Provider value={exportData}>{children}</user.Provider>;
};

export { user };
export default UserContext;