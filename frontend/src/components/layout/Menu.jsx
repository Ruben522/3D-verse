import React from "react";
import { Link, NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <nav className="bg-primary-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-8">

          {/* 1. Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            {/* Un icono simple de cubo */}
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight select-none">3DVerse</span>
          </Link>

          {/* 2. Barra de Búsqueda (Estilo Thingiverse - Ancha y central) */}
          <div className="hidden md:flex flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="Buscar modelos, usuarios, colecciones..."
              className="w-full bg-primary-800 text-white placeholder-primary-300 border border-primary-700 rounded-full py-2 px-6 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-primary-700 transition-all"
            />
            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 rounded-full hover:bg-primary-500 text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* 3. Navegación y Perfil */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink to="/models" className={({ isActive }) => isActive ? "text-white" : "text-primary-200 hover:text-white transition-colors"}>
                Explorar
              </NavLink>
              <NavLink to="/comunidad" className="text-primary-200 hover:text-white transition-colors">
                Comunidad
              </NavLink>
            </div>

            {/* Botón Subir */}
            <button type="button" className="bg-white text-primary-900 px-4 py-2 rounded-full font-bold text-sm hover:bg-primary-50 transition-colors shadow-lg">
              + Subir Diseño
            </button>

            {/* Avatar Usuario (Login) */}
            <div className="w-9 h-9 rounded-full bg-primary-700 border-2 border-primary-500 cursor-pointer overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
            <NavLink to="/login" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">
              Iniciar Sesión
            </NavLink>
            <NavLink to="/register" className="text-sm font-medium text-primary-200 hover:text-white transition-colors">
              Registrarse
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Menu;