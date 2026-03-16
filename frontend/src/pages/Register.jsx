import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";

const Register = () => {
  const { 
    datosSesion, 
    actualizarDato, 
    registrarse, 
    isAuthLoading, 
    errorAuth, 
    limpiarFormulario 
  } = useUsers();

  useEffect(() => {
    limpiarFormulario();
  }, []);

  return (
    <div className="min-h-screen flex bg-surface">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-500 opacity-90"></div>
        <div className="relative z-10 text-center px-10 text-white">
          <h1 className="text-5xl font-extrabold mb-4">Únete a 3D-Verse</h1>
          <p className="text-lg text-primary-100">La comunidad más grande de creadores y modelos 3D.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
            <p className="text-gray-500 mt-2">Empieza a compartir tus creaciones hoy mismo.</p>
          </div>

          <form onSubmit={registrarse} className="space-y-5">
            {errorAuth ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200">
                {errorAuth}
              </div>
            ) : null}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" name="name" required value={datosSesion.name} onChange={actualizarDato} placeholder="Ej: Rubén" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de Usuario</label>
              <input type="text" name="username" required value={datosSesion.username} onChange={actualizarDato} placeholder="Ej: ruben3d" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" name="email" required value={datosSesion.email} onChange={actualizarDato} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
              <input type="password" name="password" required value={datosSesion.password} onChange={actualizarDato} placeholder="••••••••" minLength="6" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <button type="submit" disabled={isAuthLoading} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md mt-6 ${isAuthLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'}`}>
              {isAuthLoading ? "⏳ Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            ¿Ya tienes una cuenta? <Link to="/login" className="font-bold text-primary-600 hover:text-primary-800 hover:underline">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;