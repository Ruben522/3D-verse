import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../hooks/useAPI.js";

const user = createContext();

const UserContext = ({ children }) => {
  const navegar = useNavigate();
  const authAPI = useAPI();
  const backendUrl = "http://localhost:3000" ;

  const userLocal = localStorage.getItem("user");
  const tokenLocal = localStorage.getItem("token");

  const usuarioInicial = userLocal ? JSON.parse(userLocal) : null;
  const sesionIniciadaInicial = !!tokenLocal;
  const datosSesionInicial = { name: "", username: "", email: "", password: "" };
  const errorInicial = null;

  const [currentUser, setCurrentUser] = useState(usuarioInicial);
  const [isAuthenticated, setIsAuthenticated] = useState(sesionIniciadaInicial);
  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [errorAuth, setErrorAuth] = useState(errorInicial);

  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion((user) => ({
      ...user,
      [name]: value,
    }));
  };

  const limpiarFormulario = () => {
    setDatosSesion(datosSesionInicial);
    setErrorAuth(errorInicial);
  };

  const iniciarSesion = async () => {
    try {
      const response = await authAPI.post(`${backendUrl}/auth/login`, { 
        email: datosSesion.email, 
        password: datosSesion.password 
      });
      
      const { token, user } = response.data || response; 

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      limpiarFormulario();
      navegar("/");
    } catch (error) {
      setErrorAuth("Credenciales incorrectas o error de servidor.");
    }
  };

  const registrarse = async () => {
    try {
      const response = await authAPI.post(`${backendUrl}/auth/register`, datosSesion);
      
      const { token, user } = response.data || response;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      setCurrentUser(user);
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
  };

  return (
    <user.Provider value={exportData}>
      {children}
    </user.Provider>
  );
};

export { user };
export default UserContext;