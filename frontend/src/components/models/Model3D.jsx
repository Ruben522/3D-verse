import React, { useMemo, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ==========================================
// 1. COMPONENTE PARA ARCHIVOS .STL
// ==========================================
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

// ==========================================
// 2. COMPONENTE PARA ARCHIVOS .GLTF / .GLB
// ==========================================
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
      const parts = [];
      scene.traverse((child) => {
        if (child.isMesh) {
          parts.push({ name: child.name || `Pieza ${child.uuid.substring(0, 5)}`, uuid: child.uuid });
        }
      });
      onPartsDetected(parts);
    }
  }, [scene, modelPath, onPartsDetected]);

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

// ==========================================
// 3. ENRUTADOR PRINCIPAL (El que exportamos)
// ==========================================
const Model3D = (props) => {
  // Extraemos la extensión del archivo (ej: "stl", "gltf", "glb")
  const extension = props.modelPath.split('.').pop().toLowerCase();

  if (extension === 'stl') {
    return <ModeloSTL {...props} />;
  } 
  
  if (extension === 'gltf' || extension === 'glb') {
    return <ModeloGLTF {...props} />;
  }

  // Fallback visual por si suben un archivo no soportado
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" wireframe />
    </mesh>
  );
};

export default Model3D;