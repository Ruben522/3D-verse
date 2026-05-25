import React from 'react';
import { useNavigate } from 'react-router-dom';
import PlanetError from '../assets/icons/PlanetError';

const Error = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center transition-colors duration-300">
			<div className="relative mb-8 group">
				<div className="absolute inset-0 bg-purple-200 dark:bg-purple-900/30 blur-2xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
				<PlanetError />
			</div>

			<h1 className="text-7xl md:text-9xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
				404
			</h1>

			<h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				¡Ups! Te has salido del lienzo
			</h2>

			<p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
				Parece que te has perdido en el espacio 3D. La página o el modelo que buscas no existe, ha sido movido o ha sido eliminado por la administración.
			</p>

			<button
				onClick={() => navigate('/')}
				className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 flex items-center gap-2"
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
				</svg>
				Volver al inicio
			</button>
		</div>
	);
};

export default Error;