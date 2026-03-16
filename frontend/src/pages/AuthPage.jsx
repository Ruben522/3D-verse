import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUsers from "../hooks/useUsers.js";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    datosSesion, 
    actualizarDato, 
    iniciarSesion, 
    registrarse, 
    isAuthLoading, 
    errorAuth, 
    limpiarFormulario 
  } = useUsers();

  // El estado que controla de qué lado está el panel
  const [isLoginView, setIsLoginView] = useState(location.pathname === "/login");

  // Si el usuario cambia la URL a mano, sincronizamos el panel
  useEffect(() => {
    limpiarFormulario();
    setIsLoginView(location.pathname === "/login");
  }, [location.pathname]);

  // Función para alternar la vista con animación
  const toggleView = () => {
    limpiarFormulario();
    const nextIsLogin = !isLoginView;
    setIsLoginView(nextIsLogin);
    // Cambiamos la URL sin recargar la página
    navigate(nextIsLogin ? "/login" : "/register", { replace: true });
  };

  // ÚNICO RETURN (Uso de ternarias y clases condicionales)
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-8">
      
      {/* Contenedor Principal (Tarjeta grande) */}
      <div className="relative w-full max-w-5xl h-[750px] md:h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* ==========================================
            FORMULARIO DE LOGIN (Lado Izquierdo)
            ========================================== */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-center px-8 sm:px-14 z-10 transition-all duration-700 ease-in-out ${isLoginView ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 md:opacity-100 pointer-events-none -translate-x-full md:translate-x-0'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-2">Accede a tu cuenta de 3D-Verse</p>
          </div>

          <form onSubmit={iniciarSesion} className="space-y-5">
            {errorAuth && isLoginView ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200 animate-fade-in">{errorAuth}</div>
            ) : null}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" name="email" required value={datosSesion.email} onChange={actualizarDato} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-gray-700">Contraseña</label>
                <a href="#" className="text-xs font-semibold text-gray-500 hover:text-primary-600">¿Olvidaste tu contraseña?</a>
              </div>
              <input type="password" name="password" required value={datosSesion.password} onChange={actualizarDato} placeholder="••••••••" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <button type="submit" disabled={isAuthLoading} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md mt-6 ${isAuthLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:shadow-lg'}`}>
              {isAuthLoading ? "⏳ Accediendo..." : "Entrar a mi cuenta"}
            </button>
          </form>

          {/* Enlace alternativo solo visible en móvil */}
          <p className="md:hidden text-center text-sm text-gray-500 mt-8">
            ¿No tienes cuenta? <button onClick={toggleView} type="button" className="font-bold text-primary-600 underline">Regístrate</button>
          </p>
        </div>

        {/* ==========================================
            FORMULARIO DE REGISTRO (Lado Derecho)
            ========================================== */}
        <div className={`absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col justify-center px-8 sm:px-14 z-10 transition-all duration-700 ease-in-out ${!isLoginView ? 'opacity-100 pointer-events-auto translate-x-0' : 'opacity-0 md:opacity-100 pointer-events-none translate-x-full md:translate-x-0'}`}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Crear Cuenta</h2>
            <p className="text-gray-500 mt-2">Únete a nuestra comunidad 3D</p>
          </div>

          <form onSubmit={registrarse} className="space-y-4">
            {errorAuth && !isLoginView ? (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium text-center border border-red-200 animate-fade-in">{errorAuth}</div>
            ) : null}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" name="name" required value={datosSesion.name} onChange={actualizarDato} placeholder="Ej: Rubén" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de Usuario</label>
              <input type="text" name="username" required value={datosSesion.username} onChange={actualizarDato} placeholder="Ej: ruben3d" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" name="email" required value={datosSesion.email} onChange={actualizarDato} placeholder="tu@email.com" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
              <input type="password" name="password" required value={datosSesion.password} onChange={actualizarDato} placeholder="••••••••" minLength="6" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-gray-50 focus:bg-white" />
            </div>

            <button type="submit" disabled={isAuthLoading} className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md mt-4 ${isAuthLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 hover:shadow-lg'}`}>
              {isAuthLoading ? "⏳ Creando cuenta..." : "Registrarse"}
            </button>
          </form>

          {/* Enlace alternativo solo visible en móvil */}
          <p className="md:hidden text-center text-sm text-gray-500 mt-8">
            ¿Ya tienes cuenta? <button onClick={toggleView} type="button" className="font-bold text-primary-600 underline">Inicia Sesión</button>
          </p>
        </div>

        {/* ==========================================
            PANEL DESLIZANTE DE COLOR (Magia Visual)
            Solo visible en escritorio (md:flex)
            ========================================== */}
        <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full bg-primary-600 z-20 transition-transform duration-700 ease-in-out items-center justify-center text-center shadow-[0_0_40px_rgba(0,0,0,0.2)] ${isLoginView ? 'translate-x-full' : 'translate-x-0'}`}>
          
          {/* Fondo estético del panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-500 opacity-90"></div>
          <span className="absolute top-10 right-10 text-7xl opacity-10 transform rotate-12">🧊</span>
          <span className="absolute bottom-10 left-10 text-7xl opacity-10 transform -rotate-12">🚀</span>

          {/* Contenido dinámico del panel */}
          <div className="relative z-30 text-white px-12">
            {isLoginView ? (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-extrabold mb-4">¿Nuevo aquí?</h2>
                <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                  Regístrate gratis y descubre un universo de modelos 3D listos para descargar o imprime tus propias ideas.
                </p>
                <button onClick={toggleView} type="button" className="border-2 border-white text-white font-bold py-3 px-10 rounded-xl hover:bg-white hover:text-primary-600 transition-colors shadow-lg">
                  Crear Cuenta
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <h2 className="text-4xl font-extrabold mb-4">¡Hola de nuevo!</h2>
                <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                  Si ya formas parte de nuestra comunidad, inicia sesión para continuar donde lo dejaste.
                </p>
                <button onClick={toggleView} type="button" className="border-2 border-white text-white font-bold py-3 px-10 rounded-xl hover:bg-white hover:text-primary-600 transition-colors shadow-lg">
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;