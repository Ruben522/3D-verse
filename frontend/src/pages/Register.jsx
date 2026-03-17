import React, { useEffect } from "react";
import useUsers from "../hooks/useUsers.js";
import InnputForm from "../components/common/InnputForm.jsx";

const Register = ({ onToggleView }) => {
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
    <div className="w-full h-full flex items-center justify-center p-8 sm:p-14">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="text-gray-500 mt-2">Empieza a compartir tus creaciones hoy mismo.</p>
        </div>

        <form onSubmit={(e) => registrarse(e)} className="space-y-4">
          {errorAuth ? (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200 animate-fade-in">
              {errorAuth}
            </div>
          ) : null}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
            <input type="text" name="name" required value={datosSesion.name} onChange={(e) => actualizarDato(e)} placeholder="Ej: Rubén" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de Usuario</label>
            <input type="text" name="username" required value={datosSesion.username} onChange={(e) => actualizarDato(e)} placeholder="Ej: ruben3d" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <input type="email" name="email" required value={datosSesion.email} onChange={(e) => actualizarDato(e)} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input type="password" name="password" required value={datosSesion.password} onChange={(e) => actualizarDato(e)} placeholder="••••••••" minLength="6" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>

          {/* AQUÍ USAMOS TU COMPONENTE BUTTON */}
          <InnputForm
            isInput={true}
            value={isAuthLoading ? "⏳ Cargando..." : "Crear Cuenta"}
            onClick={(e) => registrarse(e)}
            disabled={isAuthLoading}
            className="w-full mt-6"
          />
        </form>

        <p className="md:hidden text-center text-sm text-gray-500 mt-8">
          ¿Ya tienes una cuenta? <button type="button" onClick={onToggleView} className="font-bold text-primary-600 hover:underline">Inicia sesión aquí</button>
        </p>
      </div>
    </div>
  );
};

export default Register;