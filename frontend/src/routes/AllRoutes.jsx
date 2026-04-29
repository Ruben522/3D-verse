import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Models from "../pages/Models";
import ModelDetail from "../pages/ModelDetail";
import Error from "../pages/Error";
import AuthPage from '../pages/AuthPage';
import Profile from "../pages/Profile";
import UploadModel from '../pages/UploadModel';
import Community from '../pages/Community';
import Contact from "../pages/Contact";
import Settings from "../pages/Settings";

const AllRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/models" element={<Models />} />
			<Route path="/models/:id" element={<ModelDetail />} />
			<Route path="/login" element={<AuthPage />} />
			<Route path="/register" element={<AuthPage />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/perfil/:username" element={<Profile />} />
			<Route path="/subir" element={<UploadModel />} />
			<Route path="/comunidad" element={<Community />} />
			<Route path="/contacto" element={<Contact />} />
			<Route path="/settings" element={<Settings />} />

			{/* Ruta para manejar errores en caso de que no se encuentre la página */}
			<Route path="*" element={<Home />} />
		</Routes>
	);
};

export default AllRoutes;
