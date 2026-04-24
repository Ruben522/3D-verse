import React, { useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ModeloGLTF = ({ modelPath, currentColor, selectedPart, onPartsDetected }) => {
    const gltf = useLoader(GLTFLoader, modelPath);

    const scene = useMemo(() => {
        const clone = gltf.scene.clone();
        clone.traverse((child) => {
            if (child.isMesh) child.material = child.material.clone();
        });
        return clone;
    }, [gltf]);

    useEffect(() => {
        if (onPartsDetected) {
            let parts = [];
            scene.traverse((child) => {
                if (child.isMesh) {
                    parts = [...parts, { name: child.name || `Pieza ${child.uuid.substring(0, 5)}`, uuid: child.uuid }];
                }
            });
            onPartsDetected(parts);
        }
    }, [scene, onPartsDetected]);

    useEffect(() => {
        scene.traverse((child) => {
            if (!child.isMesh || !child.material) return;

            if (selectedPart) {
                if (child.uuid === selectedPart) child.material.color.set(currentColor);
            } else {
                child.material.color.set(currentColor);
            }
        });
    }, [scene, currentColor, selectedPart]);

    return <primitive object={scene} />;
};

export default ModeloGLTF;