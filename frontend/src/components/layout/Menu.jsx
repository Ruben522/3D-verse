import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUsers from "../../hooks/useUsers.js";
import Logo from "../common/Logo";
import LanguageSelector from "../language/LanguageSelector";
import ThemeToggle from "../common/ThemeToggle";
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
    <nav className="sticky top-0 z-50 w-full bg-primary-800 dark:bg-primary-900 text-white border-b border-primary-700/50 dark:border-primary-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            <NavLink
              to="/models"
              className={({ isActive }) => `text-sm font-bold tracking-wide transition-all duration-300 ${isActive ? "text-white drop-shadow-md" : "text-primary-200 dark:text-primary-100 hover:text-white"}`}
            >
              {t('links.explore')}
            </NavLink>
            <NavLink
              to="/comunidad"
              className={({ isActive }) => `text-sm font-bold tracking-wide transition-all duration-300 ${isActive ? "text-white drop-shadow-md" : "text-primary-200 dark:text-primary-100 hover:text-white"}`}
            >
              {t('links.comunity')}
            </NavLink>

            <Link
              to="/subir"
              className="px-5 py-2.5 rounded-full text-sm font-bold text-primary-900 bg-white dark:bg-gray-800 dark:text-white hover:bg-primary-50 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-0.5"
            >
              {t('links.upload')}
            </Link>

          </div>

          <div className="hidden md:flex items-center gap-4 justify-end flex-shrink-0">
            <ThemeToggle />
            <LanguageSelector />

            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-3 pl-3 border-l border-primary-700/50 dark:border-primary-800">

                <Link to="/profile" className="flex items-center gap-3 hover:bg-white/10 p-1.5 pr-4 rounded-full transition-all duration-300 cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-primary-700 dark:bg-primary-800 border border-white/20 group-hover:border-white/40 overflow-hidden transition-all duration-300 shadow-sm">
                    <img
                      src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${currentUser.username}&background=0D8ABC&color=fff&bold=true`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-bold text-white hidden lg:block">
                    {currentUser.username}
                  </span>
                </Link>


                <button onClick={cerrarSesion} className="text-primary-200 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-full transition-all duration-300 ml-1" title="Cerrar Sesión">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>

              </div>
            ) : (
              <div className="flex items-center gap-4 pl-3 border-l border-primary-700/50 dark:border-primary-800">
                <NavLink to="/login" className="text-sm font-bold text-primary-200 hover:text-white transition-colors duration-300">{t('links.login')}</NavLink>
                <NavLink to="/register" className="text-sm font-bold px-5 py-2.5 rounded-full border border-primary-600 dark:border-primary-700 hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-300">{t('links.register')}</NavLink>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-1">
            {isAuthenticated && currentUser && (
              <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-white/20 mr-1 shadow-sm">
                <img
                  src={currentUser.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </Link>
            )}

            <div className="scale-90 origin-center">
              <LanguageSelector />
            </div>

            <div className="scale-90 origin-center">
              <ThemeToggle />
            </div>

            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden transition-all duration-300 overflow-hidden bg-primary-800 dark:bg-primary-900 ${isMobileOpen ? 'max-h-[520px] opacity-100 border-t border-primary-700/50 dark:border-primary-800' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-6 flex flex-col gap-5 text-lg font-bold">
          <NavLink to="/models" onClick={closeMobileMenu} className="text-white hover:text-primary-200 transition-colors">{t('links.explore')}</NavLink>
          <NavLink to="/comunidad" onClick={closeMobileMenu} className="text-white hover:text-primary-200 transition-colors">{t('links.comunity')}</NavLink>

          <Link
            to="/subir"
            onClick={closeMobileMenu}
            className="mt-2 bg-white text-primary-900 py-3.5 rounded-full text-center shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
            </svg>
            {t('links.upload')}
          </Link>

          <div className="h-px bg-primary-700 dark:bg-primary-800 my-2"></div>

          {!isAuthenticated ? (
            <div className="flex flex-col gap-5">
              <NavLink to="/login" onClick={closeMobileMenu} className="text-white hover:text-primary-200 transition-colors">{t('links.login')}</NavLink>
              <NavLink to="/register" onClick={closeMobileMenu} className="text-white hover:text-primary-200 transition-colors">{t('links.register')}</NavLink>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <Link to="/profile" onClick={closeMobileMenu} className="text-white hover:text-primary-200 transition-colors">👤 Mi Perfil</Link>
              <button onClick={handleCerrarSesionMovil} className="text-red-400 hover:text-red-300 text-left transition-colors">{t('links.logout')}</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;