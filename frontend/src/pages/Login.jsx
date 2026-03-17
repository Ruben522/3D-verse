import React, { useEffect } from "react";
import useUsers from "../hooks/useUsers.js";
import InnputForm from "../components/common/InnputForm.jsx";

const Login = ({ onToggleView }) => {
  const {
    datosSesion,
    actualizarDato,
    iniciarSesion,
    errorAuth,
    isAuthLoading,
    limpiarFormulario,
  } = useUsers();

  useEffect(() => {
    limpiarFormulario();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center p-8 sm:p-14">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="text-gray-500 mt-2">Accede a tu cuenta de 3D-Verse</p>
        </div>

        <form onSubmit={(e) => iniciarSesion(e)} className="space-y-5">
          {errorAuth ? (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200 animate-fade-in">
              {errorAuth}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              required
              value={datosSesion.email}
              onChange={(e) => actualizarDato(e)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-bold text-gray-700">
                Contraseña
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-gray-500 hover:text-gray-900"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              name="password"
              required
              value={datosSesion.password}
              onChange={(e) => actualizarDato(e)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* AQUÍ USAMOS TU COMPONENTE BUTTON */}
          <InnputForm
            isInput={true}
            value={isAuthLoading ? "⏳ Cargando..." : "Iniciar Sesión"}
            onClick={(e) => iniciarSesion(e)}
            disabled={isAuthLoading}
            className="w-full mt-6"
          />
        </form>

        <p className="md:hidden text-center text-sm text-gray-500 mt-8">
          ¿No tienes cuenta aún?{" "}
          <button
            type="button"
            onClick={onToggleView}
            className="font-bold text-gray-900 hover:underline"
          >
            Regístrate gratis
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
