import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Environment } from "@react-three/drei"; // Importamos Environment
import Modelo3D from "./Modelo3D";

const Visor3D = ({ modelUrl, color, selectedPart, onPartsDetected }) => {
	return (
		<div className="w-full h-full">
			{modelUrl ? (
				<Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
					<Suspense fallback={null}>
						<Stage intensity={0.5} environment={null} adjustCamera={1.2}>
							<Modelo3D
								modelPath={modelUrl}
								currentColor={color}
								selectedPart={selectedPart}
								onPartsDetected={onPartsDetected}
							/>
						</Stage>

						{/*Añadimos nuestro archivo local. Es más eficiente
              que ir constantemente a pedirlo.
              */}
						<Environment files="/textures/potsdamer_platz_1k.hdr" />

						<OrbitControls makeDefault />
					</Suspense>
				</Canvas>
			) : null}
		</div>
	);
};

export default Visor3D;
