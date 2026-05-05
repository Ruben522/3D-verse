import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Button from "../components/common/Button.jsx";
import { useTranslation } from "react-i18next";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoginView, setIsLoginView] = useState(location.pathname === "/login");
  const { t } = useTranslation();

  useEffect(() => {
    setIsLoginView(location.pathname === "/login");
  }, [location.pathname]);

  const toggleView = () => {
    const nextIsLogin = !isLoginView;
    setIsLoginView(nextIsLogin);
    navigate(nextIsLogin ? "/login" : "/register", { replace: true });
  };

  return (
    // 1. El contenedor principal ya no usa 'bg-surface'. Hereda el fondo global del body.
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-300">

      {/* 2. Tarjeta central: Pasa de blanca a gris oscuro. Se ajusta la sombra para que sea coherente. */}
      <div className="relative w-full max-w-5xl h-[750px] md:h-[650px] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl dark:shadow-black/50 overflow-hidden flex flex-col md:flex-row transition-colors duration-300">

        {/* Contenedor de Login */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full z-10 transition-all duration-700 ease-in-out ${isLoginView ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 md:opacity-100 pointer-events-none -translate-x-full md:translate-x-0'}`}>
          <Login onToggleView={toggleView} />
        </div>

        {/* Contenedor de Registro */}
        <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full z-10 transition-all duration-700 ease-in-out ${!isLoginView ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 md:opacity-100 pointer-events-none translate-x-full md:translate-x-0'}`}>
          <Register onToggleView={toggleView} />
        </div>

        {/* Panel deslizante decorativo (Solo Desktop) */}
        <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-primary-600 dark:bg-primary-700 z-20 transition-transform duration-700 ease-in-out items-center justify-center text-center shadow-[0_0_40px_rgba(0,0,0,0.2)] dark:shadow-black/40 ${isLoginView ? 'translate-x-full' : 'translate-x-0'}`}>

          {/* 3. Degradado: Se profundiza ligeramente en modo oscuro para mayor confort visual */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-500 dark:from-primary-900 dark:to-primary-600 opacity-90 transition-colors duration-300"></div>

          <span className="absolute top-10 right-10 text-7xl opacity-10 transform rotate-12">🧊</span>
          <span className="absolute bottom-10 left-10 text-7xl opacity-10 transform -rotate-12">🚀</span>

          <div className="relative z-30 text-white px-12">
            {isLoginView ? (
              <div className="animate-fade-in flex flex-col items-center">
                <h2 className="text-4xl font-extrabold mb-4">{t('messages.new_user')}</h2>
                <p className="text-lg text-primary-100 dark:text-primary-200 mb-8 leading-relaxed transition-colors">
                  {t('messages.create_account')}
                </p>
                <Button onClick={toggleView} variant="ghost" className="px-10 dark:hover:bg-white/10">
                  {t('messages.create_account_tittle')}
                </Button>
              </div>
            ) : (
              <div className="animate-fade-in flex flex-col items-center">
                <h2 className="text-4xl font-extrabold mb-4">{t('messages.welcome_back')}</h2>
                <p className="text-lg text-primary-100 dark:text-primary-200 mb-8 leading-relaxed transition-colors">
                  {t('messages.enter_to_account')}
                </p>
                <Button onClick={toggleView} variant="ghost" className="px-10 dark:hover:bg-white/10">
                  {t('messages.login_here')}
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;