import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Models from "../pages/Models";
import ModelDetail from "../pages/ModelDetail";
import Error from "../pages/Error";
import AuthPage from '../pages/AuthPage';
import Profile from "../pages/Profile";
import MyProfile from "../pages/MyProfile";
import UploadModel from '../pages/UploadModel';

const AllRoutes = () => {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/models" element={<Models />} />
			<Route path="/models/:id" element={<ModelDetail />} />
			<Route path="/login" element={<AuthPage />} />
			<Route path="/register" element={<AuthPage />} />
			<Route path="/profile" element={<MyProfile />} />
			<Route path="/perfil/:username" element={<Profile />} />
			<Route path="/subir" element={<UploadModel />} />

			{/* Ruta para manejar errores en caso de que no se encuentre la página */}
			<Route path="*" element={<Error />} />
		</Routes>
	);
};

export default AllRoutes;
