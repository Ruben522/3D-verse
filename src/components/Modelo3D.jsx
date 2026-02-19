import React, { useMemo, useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Modelo3D = ({ modelPath, currentColor, selectedPart, onPartsDetected }) => {
  const gltf = useLoader(GLTFLoader, modelPath);
  
  // Usamos un ref para enviar las partes solo una vez por modelo cargado
  const lastModelPath = useRef(null);

  const scene = useMemo(() => {
    const clone = gltf.scene.clone();
    
    // Opcional: Si quieres que los colores sean independientes PERO empiecen igual,
    // debemos asegurarnos de que cada malla tenga su propio material único.
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
      }
    });
    
    return clone;
  }, [gltf]);

  useEffect(() => {
    // Solo disparamos la detección si el modelo ha cambiado realmente
    if (onPartsDetected && lastModelPath.current !== modelPath) {
      const parts = [];
      scene.traverse((child) => {
        if (child.isMesh) {
          parts.push({
            name: child.name || `Pieza ${child.uuid.substring(0, 5)}`,
            uuid: child.uuid,
          });
        }
      });
      onPartsDetected(parts);
      lastModelPath.current = modelPath;
    }
    
  }, [scene, modelPath, onPartsDetected]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      if (selectedPart) {
        if (child.uuid === selectedPart) {
          child.material.color.set(currentColor);
        }
      } else {
        child.material.color.set(currentColor);
      }
    });
    
  }, [scene, currentColor, selectedPart]);

  return <primitive object={scene} />;
};

export default Modelo3D;