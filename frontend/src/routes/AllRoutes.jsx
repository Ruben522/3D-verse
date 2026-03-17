import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Models from "../pages/Models";
import ModelDetail from "../pages/ModelDetail";
import Error from "../pages/Error";
import AuthPage from '../pages/AuthPage';

// Componente de rutas de la aplicación.
const AllRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/models" element={<Models />} />
			<Route path="/models/:id" element={<ModelDetail />} />
			<Route path="/login" element={<AuthPage />} />
			<Route path="/register" element={<AuthPage />} />
			{/* Ruta para manejar errores en caso de que no se encuentre la página */}
			<Route path="*" element={<Error />} />
		</Routes>
	);
};

export default AllRoutes;
