import React, { useContext } from "react";
import { ModelsContext } from "../context/ModelsContext";
import ModelCard from "../components/ModelCard"; // Asumiendo que tienes este componente

const Home = () => {
	const { models } = useContext(ModelsContext);

	return (
		<div className="min-h-screen bg-surface">
			{/* --- HERO SECTION --- */}
			<section className="relative overflow-hidden bg-white pt-16 pb-24 lg:pt-32 lg:pb-40 border-b border-gray-100">
				<div className="max-w-7xl mx-auto px-6 relative z-10">
					<div className="text-center max-w-3xl mx-auto">
						<span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-primary-600 uppercase bg-primary-50 rounded-full">
							Comunidad 3D de Nueva Generación
						</span>
						<h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
							Tus ideas merecen{" "}
							<span className="text-primary-600">dimensión.</span>
						</h1>
						<p className="text-xl text-gray-500 mb-10 leading-relaxed">
							Descubre miles de modelos listos para imprimir y personalízalos
							directamente en tu navegador con nuestro visor avanzado.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<button className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all">
								🚀 Explorar Galería
							</button>
							<button className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
								📤 Subir Modelo
							</button>
						</div>
					</div>
				</div>

				{/* Decoración abstracta de fondo */}
				<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-50" />
			</section>

			{/* --- TRENDING SECTION --- */}
			<section className="max-w-7xl mx-auto px-6 py-20">
				<div className="flex items-end justify-between mb-12">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							Tendencias de la semana
						</h2>
						<p className="text-gray-500">
							Los diseños más populares de nuestra comunidad.
						</p>
					</div>
					<button className="text-primary-600 font-bold hover:underline">
						Ver todos →
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
					{models.slice(0, 8).map((modelo) => (
						<ModelCard key={modelo.id} modelo={modelo} />
					))}
				</div>
			</section>

			{/* --- FEATURES SECTION --- */}
			<section className="bg-gray-900 py-20 text-white overflow-hidden">
				<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
					<div>
						<h2 className="text-4xl font-bold mb-6">
							Personalización sin límites
						</h2>
						<ul className="space-y-6">
							<li className="flex gap-4">
								<div className="bg-primary-600 p-2 rounded-lg h-fit text-xl">
									🧊
								</div>
								<div>
									<h4 className="font-bold text-lg text-white">
										Visor 3D Interactivo
									</h4>
									<p className="text-gray-400">
										Inspecciona cada detalle antes de descargar.
									</p>
								</div>
							</li>
							<li className="flex gap-4">
								<div className="bg-primary-600 p-2 rounded-lg h-fit text-xl">
									🎨
								</div>
								<div>
									<h4 className="font-bold text-lg text-white">
										Pintura por Capas
									</h4>
									<p className="text-gray-400">
										Cambia colores de piezas individuales como hemos hecho hoy.
									</p>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
