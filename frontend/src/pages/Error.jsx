import React from "react";
import "./Error.css";
import { useNavigate } from "react-router-dom";

// Componente que maneja los errores de la página.
const Error = ({ error }) => {
	const navigate = useNavigate();
	return (
		<div className="mensaje-error">
			<h1>Error</h1>
			<p>{`El error ha sido: ${error}`}</p>
			<button onClick={() => navigate("/")}>Inicio</button>
		</div>
	);
};

export default Error;
