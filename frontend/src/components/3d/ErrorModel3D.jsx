import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ErrorModel3D = () => {
    return (
        <div className="w-full h-full relative flex items-center justify-center bg-gray-100 dark:bg-gray-800/50 rounded-2xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 4] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <mesh>
                    <boxGeometry args={[1.5, 1.5, 1.5]} />
                    <meshStandardMaterial color="#ef4444" roughness={0.3} metalness={0.4} />
                </mesh>

                <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} />
            </Canvas>
            <div className="absolute bottom-6 bg-red-500/90 text-white px-4 py-2 rounded-xl backdrop-blur-sm text-sm font-bold shadow-lg pointer-events-none">
                Error en el modelo
            </div>
        </div>
    );
};

export default ErrorModel3D;