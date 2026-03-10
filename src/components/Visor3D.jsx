import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Environment } from "@react-three/drei"; 
import Modelo3D from "./Modelo3D";

// CAMBIO 1: Recibimos currentModelUrl en lugar de modelUrl
const Visor3D = ({ currentModelUrl, color, selectedPart, onPartsDetected }) => {
    return (
        <div className="w-full h-full">
            {/* CAMBIO 2: Comprobamos la variable correcta */}
            {currentModelUrl ? (
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                        <Stage intensity={0.5} environment={null} adjustCamera={1.2}>
                            <Modelo3D
                                // CAMBIO 3: Le pasamos la URL correcta a Modelo3D
                                modelPath={currentModelUrl} 
                                currentColor={color}
                                selectedPart={selectedPart}
                                onPartsDetected={onPartsDetected}
                            />
                        </Stage>

                        <Environment files="/textures/potsdamer_platz_1k.hdr" />
                        <OrbitControls makeDefault />
                    </Suspense>
                </Canvas>
            ) : null}
        </div>
    );
};

export default Visor3D;