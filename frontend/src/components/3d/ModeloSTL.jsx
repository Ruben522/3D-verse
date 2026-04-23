import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const ModeloSTL = ({ modelPath, currentColor, onPartsDetected }) => {
    const geometry = useLoader(STLLoader, modelPath);

    useEffect(() => {
        if (onPartsDetected) {
            onPartsDetected([{ name: "Modelo Completo (STL)", uuid: "stl-main-part" }]);
        }
    }, [modelPath, onPartsDetected]);

    return (
        <mesh geometry={geometry}>
            <meshStandardMaterial color={currentColor} roughness={0.5} metalness={0.1} />
        </mesh>
    );
};

export default ModeloSTL;