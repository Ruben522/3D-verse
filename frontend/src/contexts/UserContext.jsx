import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../hooks/useAPI.js";

const user = createContext();

const UserContext = ({ children }) => {
  const navegar = useNavigate();
  const authAPI = useAPI();
  const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const normalizeUser = (userObj) => {
    if (!userObj) return null;

    let avatarUrl = null;
    if (userObj.avatar) {
      const cleanBase = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const cleanPath = userObj.avatar.startsWith('/') ? userObj.avatar : `/${userObj.avatar}`;
      avatarUrl = userObj.avatar.startsWith('http') ? userObj.avatar : `${cleanBase}${cleanPath}`;
    }

    return {
      ...userObj,
      avatarUrl,
      inicial: userObj.username ? userObj.username.charAt(0).toUpperCase() : "U",
      fechaRegistro: userObj.created_at ? new Date(userObj.created_at).toLocaleDateString() : "Desconocida",
    };
  };

  const userLocal = localStorage.getItem("user");
  const tokenLocal = localStorage.getItem("token");

  const usuarioInicial = userLocal ? normalizeUser(JSON.parse(userLocal)) : null;
  const sesionIniciadaInicial = !!tokenLocal;
  const datosSesionInicial = { name: "", username: "", email: "", password: "" };

  const [currentUser, setCurrentUser] = useState(usuarioInicial);
  const [isAuthenticated, setIsAuthenticated] = useState(sesionIniciadaInicial);
  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [errorAuth, setErrorAuth] = useState(null);

  const [publicMyProfile, setPublicMyProfile] = useState(null);
  const [publicProfile, setPublicProfile] = useState(null);
  const [communityUsers, setCommunityUsers] = useState([]);

  const [isLoadingMyProfile, setIsLoadingMyProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingCommunity, setIsLoadingCommunity] = useState(false);

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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsAuthenticated(false);
    limpiarFormulario();
    navegar("/");
  };

  const getCommunityUsers = async () => {
    setIsLoadingCommunity(true);
    try {
      const response = await authAPI.get(`${backendUrl}/users/public`);
      const rawUsers = response.data?.data || response.data || response;
      setCommunityUsers(rawUsers.map(normalizeUser));
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
  };

  return <user.Provider value={exportData}>{children}</user.Provider>;
};

export { user };
export default UserContext;