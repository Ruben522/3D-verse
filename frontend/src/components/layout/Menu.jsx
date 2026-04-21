import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUsers from "../../hooks/useUsers.js";
import Logo from "../common/Logo";
import Button from "../common/Button";
import LanguageSelector from "../language/LanguageSelector";
import { useTranslation } from "react-i18next";

const Menu = () => {
  const { isAuthenticated, currentUser, cerrarSesion } = useUsers();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useTranslation();
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
  const closeMobileMenu = () => setIsMobileOpen(false);

  const handleCerrarSesionMovil = () => {
    cerrarSesion();
    closeMobileMenu();
  };

  return (
    <nav className="bg-primary-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">

          <Logo />

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6 w-full justify-end">
            <div className="flex items-center gap-6 text-sm font-medium">
              <NavLink to="/models" className={({ isActive }) => isActive ? "text-white" : "text-primary-200 hover:text-white transition-colors"}>
                {t('links.explore')}
              </NavLink>
              <NavLink to="/comunidad" className={({ isActive }) => isActive ? "text-white" : "text-primary-200 hover:text-white transition-colors"}>
                {t('links.comunity')}
              </NavLink>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated && currentUser ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-3 hover:bg-primary-800 p-1.5 pr-4 rounded-full transition-colors cursor-pointer">
                    <div className="w-9 h-9 rounded-full bg-primary-700 border-2 border-primary-500 overflow-hidden">
                      <img
                        src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8ABC&color=fff&bold=true`}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-white hidden lg:block">
                      {currentUser.username}
                    </span>
                  </Link>

                  <Link to="/subir" className="px-5 py-2.5 rounded-2xl text-sm font-semibold bg-white text-primary-900 hover:bg-primary-50 transition-colors shadow-lg">
                    {t('links.upload')}
                  </Link>

                  <LanguageSelector />

                  <button onClick={cerrarSesion} className="text-primary-300 hover:text-red-400 p-2 transition-colors" title="Cerrar Sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>

                </div>
              ) : (
                <>
                  <NavLink to="/login" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">{t('links.login')}</NavLink>
                  <NavLink to="/register" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">{t('links.register')}</NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center gap-2">

            {/* Avatar */}
            {isAuthenticated && currentUser && (
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary-400">
                <img
                  src={currentUser.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </Link>
            )}

            {/* Language Selector (modo compacto) */}
            <div className="scale-90 origin-center">
              <LanguageSelector />
            </div>

            {/* Botón menú */}
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors text-2xl"
            >
              {isMobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-primary-800 border-t border-primary-700 transition-all duration-300 overflow-hidden ${isMobileOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}>

        <div className="px-6 py-6 flex flex-col gap-5 text-lg">
          <NavLink to="/models" onClick={closeMobileMenu} className="text-white hover:text-primary-200">{t('links.explore')}</NavLink>
          <NavLink to="/comunidad" onClick={closeMobileMenu} className="text-white hover:text-primary-200">{t('links.comunity')}</NavLink>

          <Link
            to="/subir"
            onClick={closeMobileMenu}
            className="mt-4 bg-white text-primary-900 font-bold py-4 rounded-2xl text-center shadow-lg active:scale-95 transition-transform"
          >
            + Subir Diseño
          </Link>

          <div className="h-px bg-primary-700 my-4"></div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-5">
              <NavLink to="/login" onClick={closeMobileMenu} className="text-white hover:text-primary-200">{t('links.login')}</NavLink>
              <NavLink to="/register" onClick={closeMobileMenu} className="text-white hover:text-primary-200">{t('links.register')}</NavLink>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <Link to="/profile" onClick={closeMobileMenu} className="text-white hover:text-primary-200">👤 Mi Perfil</Link>
              <button onClick={handleCerrarSesionMovil} className="text-red-400 hover:text-red-300 font-medium text-left">{t('links.logout')}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;