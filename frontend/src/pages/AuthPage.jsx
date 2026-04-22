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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-8">
      <div className="relative w-full max-w-5xl h-[750px] md:h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full z-10 transition-all duration-700 ease-in-out ${isLoginView ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 md:opacity-100 pointer-events-none -translate-x-full md:translate-x-0'}`}>
          <Login onToggleView={toggleView} />
        </div>

        <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full z-10 transition-all duration-700 ease-in-out ${!isLoginView ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 md:opacity-100 pointer-events-none translate-x-full md:translate-x-0'}`}>
          <Register onToggleView={toggleView} />
        </div>

        <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-primary-600 z-20 transition-transform duration-700 ease-in-out items-center justify-center text-center shadow-[0_0_40px_rgba(0,0,0,0.2)] ${isLoginView ? 'translate-x-full' : 'translate-x-0'}`}>

          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-500 opacity-90"></div>
          <span className="absolute top-10 right-10 text-7xl opacity-10 transform rotate-12">🧊</span>
          <span className="absolute bottom-10 left-10 text-7xl opacity-10 transform -rotate-12">🚀</span>

          <div className="relative z-30 text-white px-12">
            {isLoginView ? (
              <div className="animate-fade-in flex flex-col items-center">
                <h2 className="text-4xl font-extrabold mb-4">{t('messages.new_user')}</h2>
                <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                  {t('messages.create_account')}
                </p>
                <Button onClick={toggleView} variant="ghost" className="px-10">
                  {t('messages.create_account_tittle')}
                </Button>
              </div>
            ) : (
              <div className="animate-fade-in flex flex-col items-center">
                <h2 className="text-4xl font-extrabold mb-4">{t('messages.welcome_back')}</h2>
                <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                  {t('messages.enter_to_account')}
                </p>
                <Button onClick={toggleView} variant="ghost" className="px-10">
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