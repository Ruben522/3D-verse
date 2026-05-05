import React, { useEffect } from "react";
import useUsers from "../hooks/useUsers.js";
import InnputForm from "../components/common/InnputForm.jsx";
import { useTranslation } from "react-i18next";

const Login = ({ onToggleView }) => {

  const {
    datosSesion,
    actualizarDato,
    iniciarSesion,
    errorAuth,
    isAuthLoading,
    limpiarFormulario,
  } = useUsers();

  const { t } = useTranslation();

  useEffect(() => {
    limpiarFormulario();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 sm:p-14 transition-colors duration-300">
      <div className="w-full max-w-md">

        {/* CABECERA */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors">
            {t('messages.login_here')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            {t('messages.login_desc')}
          </p>
        </div>

        <form onSubmit={(e) => iniciarSesion(e)} className="space-y-5">

          {/* MENSAJE DE ERROR */}
          {errorAuth ? (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium text-center border border-red-200 dark:border-red-800 animate-fade-in transition-colors">
              {errorAuth}
            </div>
          ) : null}

          {/* CAMPO: EMAIL */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t('messages.email')}
            </label>
            <input
              type="email"
              name="email"
              required
              value={datosSesion.email}
              onChange={(e) => actualizarDato(e)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-gray-900 dark:focus:ring-primary-500 focus:border-gray-900 dark:focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* CAMPO: CONTRASEÑA */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 transition-colors">
                {t('messages.password')}
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              >
                {t('messages.forgot_password')}
              </a>
            </div>
            <input
              type="password"
              name="password"
              required
              value={datosSesion.password}
              onChange={(e) => actualizarDato(e)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-gray-900 dark:focus:ring-primary-500 focus:border-gray-900 dark:focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* BOTÓN DE LOGIN */}
          <InnputForm
            isInput={true}
            value={isAuthLoading ? t('messages.loading') : t('messages.login_here')}
            onClick={(e) => iniciarSesion(e)}
            disabled={isAuthLoading}
            className="w-full mt-6"
          />
        </form>

        {/* ENLACE PARA REGISTRARSE (MÓVIL) */}
        <p className="md:hidden text-center text-sm text-gray-500 dark:text-gray-400 mt-8 transition-colors">
          {t('messages.no_account')}
          <button
            type="button"
            onClick={onToggleView}
            className="font-bold ml-1 text-gray-900 dark:text-white hover:underline transition-colors"
          >
            {t('messages.register_here')}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;