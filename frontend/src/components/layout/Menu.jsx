import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUsers from "../../hooks/useUsers.js";
import Logo from "../common/Logo";
import Button from "../common/Button";

const Menu = () => {
  const { isAuthenticated, currentUser, cerrarSesion } = useUsers();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const handleCerrarSesionMovil = () => {
    cerrarSesion();
    closeMobileMenu();
  };

  // ÚNICO RETURN
  return (
    <nav className="bg-primary-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          <Logo />

          {/* VERSIÓN ESCRITORIO */}
          <div className="hidden md:flex items-center gap-4 w-full justify-end">

            <div className="flex items-center gap-6 text-sm font-medium mr-2">
              <NavLink to="/models" className={({ isActive }) => isActive ? "text-white" : "text-primary-200 hover:text-white transition-colors"}>
                Explorar
              </NavLink>
              <NavLink to="/comunidad" className={({ isActive }) => isActive ? "text-white" : "text-primary-200 hover:text-white transition-colors"}>
                Comunidad
              </NavLink>
            </div>

            <div className="h-8 w-px bg-primary-700 mx-2"></div>

            <div className="flex items-center gap-4">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-3 hover:bg-primary-800 p-1.5 pr-3 rounded-full transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-primary-700 border-2 border-primary-500 overflow-hidden flex-shrink-0">
                      <img
                        src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8ABC&color=fff&bold=true`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-white">
                      {currentUser.username}
                    </span>
                  </Link>
                  <Link to="/subir"
                    variant="outline"
                    className="!px-4 !py-2 !rounded-full !text-sm border-none bg-white text-primary-900 hover:bg-primary-50 whitespace-nowrap shadow-lg"
                  >
                    Subir Diseño
                  </Link>
                  {/* Icono nativo para salir, para no romper el layout */}
                  <button onClick={cerrarSesion} title="Cerrar Sesión" className="text-primary-300 hover:text-red-400 p-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <NavLink to="/login" className={({ isActive }) => isActive ? "text-white text-sm font-medium" : "text-sm font-medium text-primary-200 hover:text-white transition-colors"}>
                    Iniciar Sesión
                  </NavLink>
                  <NavLink to="/register" className={({ isActive }) => isActive ? "text-white text-sm font-medium" : "text-sm font-medium text-primary-200 hover:text-white transition-colors"}>
                    Registrarse
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* VERSIÓN MÓVIL: Controles */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <Link to="/profile" onClick={closeMobileMenu} className="w-8 h-8 rounded-full bg-primary-700 border-2 border-primary-500 overflow-hidden flex-shrink-0">
                <img src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8ABC&color=fff&bold=true`} alt="Avatar" className="w-full h-full object-cover" />
              </Link>
            ) : null}

            <button onClick={toggleMobileMenu} className="text-primary-200 hover:text-white focus:outline-none p-1 transition-colors">
              {isMobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* --- DESPLEGABLE MÓVIL --- */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-primary-800 ${isMobileOpen ? 'max-h-96 border-t border-primary-700 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-5">

          <NavLink to="/models" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-primary-200 hover:text-white font-medium text-lg transition-colors"}>
            Explorar
          </NavLink>

          <NavLink to="/comunidad" onClick={closeMobileMenu} className={({ isActive }) => isActive ? "text-white font-bold text-lg" : "text-primary-200 hover:text-white font-medium text-lg transition-colors"}>
            Comunidad
          </NavLink>

          {/* USAMOS TU BUTTON PARA MÓVIL */}
          <Link to="/subir"
            variant="outline"
            onClick={closeMobileMenu}
            className="!px-4 !py-3 !rounded-xl !text-sm border-none bg-white text-primary-900 hover:bg-primary-50 shadow-lg w-full text-center transition-colors font-bold"
          >
            + Subir Diseño
          </Link>

          <div className="h-px bg-primary-700 my-2"></div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-5">
              <NavLink to="/login" onClick={closeMobileMenu} className="text-primary-200 hover:text-white font-medium text-lg">
                Iniciar Sesión
              </NavLink>
              <NavLink to="/register" onClick={closeMobileMenu} className="text-primary-200 hover:text-white font-medium text-lg">
                Registrarse
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              <Link to="/profile" onClick={closeMobileMenu} className="bg-primary-700 text-white px-4 py-3 rounded-xl font-bold text-center shadow-sm w-full transition-colors hover:bg-primary-600">
                👤 Mi Perfil
              </Link>

              {/* USAMOS TU BUTTON PARA CERRAR SESIÓN EN MÓVIL */}
              <Button
                onClick={handleCerrarSesionMovil}
                className="!bg-red-500/10 !text-red-400 border border-red-500/20 hover:!bg-red-500/20 w-full"
              >
                Cerrar Sesión
              </Button>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Menu;