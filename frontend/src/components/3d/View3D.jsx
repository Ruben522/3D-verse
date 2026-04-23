import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Environment } from "@react-three/drei"; 
import Model3D from "./Model3D";

const View3D = ({ currentModelUrl, color, selectedPart, onPartsDetected }) => {
    return (
        <div className="w-full h-full">
            {currentModelUrl ? (
                <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                    <Suspense fallback={null}>
                        <Stage intensity={0.5} environment={null} adjustCamera={1.2}>
                            <Model3D
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

export default View3D;