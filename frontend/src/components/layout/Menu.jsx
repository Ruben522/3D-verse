import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useUsers from "../../hooks/useUsers.js";
import Logo from "../common/Logo";
import LanguageSelector from "../language/LanguageSelector";
import ThemeToggle from "../common/ThemeToggle";
import { useTranslation } from "react-i18next";

import UploadIcon from "../../assets/icons/UploadIcon";
import ExitAccountIcon from "../../assets/icons/ExitAccountIcon.jsx";
import ExploreIcon from "../../assets/icons/ExploreIcon";
import CommunityIcon from "../../assets/icons/CommunityIcon";
import ProfileIcon from "../../assets/icons/ProfileIcon";
import MenuToggleIcon from "../../assets/icons/MenuToggleIcon";

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
    <>
      <nav className="sticky top-0 z-50 w-full bg-primary-800 dark:bg-primary-900 text-white border-b border-primary-700/50 dark:border-primary-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            <div className="flex-shrink-0">
              <Logo />
            </div>

            <div className="hidden md:flex flex-1 items-center justify-center gap-8">
              <NavLink
                to="/models"
                className={({ isActive }) => `text-sm font-bold tracking-wide transition-all duration-300 ${isActive ? "text-white drop-shadow-md" : "text-primary-100 dark:text-primary-200 hover:text-white dark:hover:text-white"}`}
              >
                {t('links.explore')}
              </NavLink>
              <NavLink
                to="/comunidad"
                className={({ isActive }) => `text-sm font-bold tracking-wide transition-all duration-300 ${isActive ? "text-white drop-shadow-md" : "text-primary-100 dark:text-primary-200 hover:text-white dark:hover:text-white"}`}
              >
                {t('links.comunity')}
              </NavLink>
            </div>

            <div className="hidden md:flex items-center gap-4 justify-end flex-shrink-0">

              <div className="flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>

              <Link
                to="/subir"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:-translate-y-0.5 transition-all duration-300"
              >
                <UploadIcon className="w-4 h-4" />
                {t('links.upload')}
              </Link>

              {isAuthenticated && currentUser ? (
                <div className="flex items-center gap-3 pl-3 border-l border-primary-700/50 dark:border-primary-800">
                  <Link to="/profile" className="flex items-center gap-3 hover:bg-white/10 dark:hover:bg-white/5 p-1.5 pr-4 rounded-full transition-all duration-300 cursor-pointer group">
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

                  <button onClick={cerrarSesion} className="text-primary-100 dark:text-primary-200 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all duration-300 ml-1" title="Cerrar Sesión">
                    <ExitAccountIcon />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 pl-3 border-l border-primary-700/50 dark:border-primary-800">
                  <NavLink to="/login" className="text-sm font-bold text-primary-100 dark:text-primary-200 hover:text-white dark:hover:text-white transition-colors duration-300">{t('links.login')}</NavLink>
                  <NavLink to="/register" className="text-sm font-bold px-5 py-2.5 rounded-xl border border-primary-400 text-white hover:bg-white/10 transition-colors duration-300">{t('links.register')}</NavLink>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && currentUser && (
                <Link to="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-sm">
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                </Link>
              )}

              <button
                onClick={toggleMobileMenu}
                className="text-white p-2 hover:bg-white/10 dark:hover:bg-white/5 rounded-xl transition-colors duration-300"
              >
                <MenuToggleIcon isOpen={isMobileOpen} />
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden bg-primary-800/95 dark:bg-primary-900/95 backdrop-blur-xl ${isMobileOpen ? 'max-h-[700px] opacity-100 border-t border-primary-700/50 dark:border-primary-800 shadow-2xl' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-6 flex flex-col gap-2">

            <NavLink to="/models" onClick={closeMobileMenu} className="flex items-center gap-3 text-lg font-bold text-white hover:text-primary-100 dark:hover:text-primary-200 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <ExploreIcon />
              {t('links.explore')}
            </NavLink>

            <NavLink to="/comunidad" onClick={closeMobileMenu} className="flex items-center gap-3 text-lg font-bold text-white hover:text-primary-100 dark:hover:text-primary-200 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <CommunityIcon />
              {t('links.comunity')}
            </NavLink>

            <Link
              to="/subir"
              onClick={closeMobileMenu}
              className="mt-4 mb-2 flex items-center justify-center gap-2 text-lg font-bold bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 py-3.5 rounded-xl shadow-sm active:scale-95 transition-all"
            >
              <UploadIcon />
              {t('links.upload')}
            </Link>

            <div className="h-px bg-primary-700/50 dark:bg-primary-800 my-4"></div>

            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <NavLink to="/login" onClick={closeMobileMenu} className="text-lg font-bold text-white hover:text-primary-100 dark:hover:text-primary-200 p-3 rounded-xl hover:bg-white/5 transition-colors">{t('links.login')}</NavLink>
                <NavLink to="/register" onClick={closeMobileMenu} className="text-lg font-bold text-white hover:text-primary-100 dark:hover:text-primary-200 p-3 rounded-xl hover:bg-white/5 transition-colors">{t('links.register')}</NavLink>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/profile" onClick={closeMobileMenu} className="flex items-center gap-3 text-lg font-bold text-white hover:text-primary-100 dark:hover:text-primary-200 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <ProfileIcon />
                  {t('links.myProfile')}
                </Link>
                <button onClick={handleCerrarSesionMovil} className="flex items-center gap-3 text-lg font-bold text-red-400 hover:text-red-300 p-3 rounded-xl hover:bg-red-500/10 text-left transition-colors">
                  <ExitAccountIcon />
                  {t('links.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Menu;