import React, { useEffect } from "react";
import useUsers from "../hooks/useUsers.js";
import InnputForm from "../components/common/InnputForm.jsx";
import { useTranslation } from "react-i18next";

const Register = ({ onToggleView }) => {
  const {
    datosSesion,
    actualizarDato,
    registrarse,
    isAuthLoading,
    errorAuth,
    limpiarFormulario
  } = useUsers();

  const { t } = useTranslation();

  useEffect(() => {
    limpiarFormulario();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 sm:p-14 transition-colors duration-300">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white transition-colors">
            {t('messages.create_account_tittle')}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            {t('messages.create_account_desc')}
          </p>
        </div>

        <form onSubmit={(e) => registrarse(e)} className="space-y-4">

          {errorAuth ? (
            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium text-center border border-red-200 dark:border-red-800 animate-fade-in transition-colors">
              {errorAuth}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t('messages.name')}
            </label>
            <input
              type="text"
              name="name"
              required
              value={datosSesion.name}
              onChange={(e) => actualizarDato(e)}
              placeholder={t('messages.name_placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t('messages.username')}
            </label>
            <input
              type="text"
              name="username"
              required
              value={datosSesion.username}
              onChange={(e) => actualizarDato(e)}
              placeholder={t('messages.username_placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

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
              placeholder={t('messages.email_placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              {t('messages.password')}
            </label>
            <input
              type="password"
              name="password"
              required
              value={datosSesion.password}
              onChange={(e) => actualizarDato(e)}
              placeholder={t('messages.password_placeholder')}
              minLength="6"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-500 focus:border-primary-500 dark:focus:border-primary-500 outline-none transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <InnputForm
            isInput={true}
            value={isAuthLoading ? {} : t('messages.register_here')}
            onClick={(e) => registrarse(e)}
            disabled={isAuthLoading}
            className="w-full mt-6"
          />
        </form>

        <p className="md:hidden text-center text-sm text-gray-500 dark:text-gray-400 mt-8 transition-colors">
          {t('messages.account_already')}
          <button
            type="button"
            onClick={onToggleView}
            className="font-bold ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline transition-colors"
          >
            {t('messages.login_here')}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Register;