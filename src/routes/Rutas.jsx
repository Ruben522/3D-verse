import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Modelos from "../pages/Modelos";
import ModeloDetalle from "../pages/ModeloDetalle";
import Error from "../pages/Error";

// Componente de rutas de la aplicación.
const Rutas = () => {
	return (
		<Routes>
			<Route path="/" element={<Inicio />} />
			<Route path="/modelos" element={<Modelos />} />
			<Route path="/modelo/:id" element={<ModeloDetalle />} />
			{/* Ruta para manejar errores en caso de que no se encuentre la página */}
			<Route path="*" element={<Error />} />
		</Routes>
	);
};

export default Rutas;
