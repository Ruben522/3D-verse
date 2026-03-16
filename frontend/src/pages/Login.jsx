import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";

const Login = () => {
  const { 
    datosSesion, 
    actualizarDato, 
    iniciarSesion, 
    errorAuth, 
    limpiarFormulario 
  } = useUsers();

  useEffect(() => {
    limpiarFormulario();
  }, []);

  return (
    <div className="min-h-screen flex bg-surface flex-row-reverse">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-bl from-gray-800 to-black opacity-90"></div>
        <div className="relative z-10 text-center px-10 text-white">
          <span className="text-6xl mb-6 block">🧊</span>
          <h1 className="text-4xl font-extrabold mb-4">Bienvenido de nuevo</h1>
          <p className="text-lg text-gray-400">Tus modelos favoritos te están esperando.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2">Accede a tu cuenta de 3D-Verse</p>
          </div>

          <form onSubmit={iniciarSesion} className="space-y-5">
            {errorAuth ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200">
                {errorAuth}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" name="email" required value={datosSesion.email} onChange={(e) => actualizarDato(e)} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                <a href="#" className="text-xs font-semibold text-gray-500 hover:text-gray-900">¿Olvidaste tu contraseña?</a>
              </div>
              <input type="password" name="password" required value={datosSesion.password} onChange={(e) => actualizarDato(e)} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

              <input type="button" value="Login" onClick={(e) => iniciarSesion(e)} className="w-full py-4 rounded-xl font-bold text-white transition-all shadow-md mt-6 bg-primary-600 hover:bg-primary-700 hover:shadow-lg" />
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            ¿No tienes cuenta aún? <Link to="/register" className="font-bold text-gray-900 hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;