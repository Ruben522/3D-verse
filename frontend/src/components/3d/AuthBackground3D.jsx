import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Edges, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const NestedLogoCubes = () => {
    const groupRef = useRef();
    const outerCubeRef = useRef();
    const innerCubeRef = useRef();

    useFrame((state, delta) => {

        // Rotación automática
        if (outerCubeRef.current && innerCubeRef.current) {

            outerCubeRef.current.rotation.y += delta * 0.2;
            outerCubeRef.current.rotation.x += delta * 0.1;

            innerCubeRef.current.rotation.y -= delta * 0.3;
            innerCubeRef.current.rotation.z -= delta * 0.2;

            // Escala fija e idéntica
            const outerScale = 2.1;
            const innerScale = 1.4;

            outerCubeRef.current.scale.x = THREE.MathUtils.lerp(
                outerCubeRef.current.scale.x,
                outerScale,
                0.08
            );

            outerCubeRef.current.scale.y = THREE.MathUtils.lerp(
                outerCubeRef.current.scale.y,
                outerScale,
                0.08
            );

            outerCubeRef.current.scale.z = THREE.MathUtils.lerp(
                outerCubeRef.current.scale.z,
                outerScale,
                0.08
            );

            innerCubeRef.current.scale.x = THREE.MathUtils.lerp(
                innerCubeRef.current.scale.x,
                innerScale,
                0.08
            );

            innerCubeRef.current.scale.y = THREE.MathUtils.lerp(
                innerCubeRef.current.scale.y,
                innerScale,
                0.08
            );

            innerCubeRef.current.scale.z = THREE.MathUtils.lerp(
                innerCubeRef.current.scale.z,
                innerScale,
                0.08
            );
        }

        // Interacción con ratón
        if (groupRef.current) {

            const targetX = (state.pointer.x * Math.PI) / 8;
            const targetY = (state.pointer.y * Math.PI) / 8;

            groupRef.current.rotation.x = THREE.MathUtils.lerp(
                groupRef.current.rotation.x,
                -targetY,
                0.05
            );

            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetX,
                0.05
            );
        }
    });

    return (
        <group ref={groupRef}>
            <Float
                speed={2.5}
                rotationIntensity={0.2}
                floatIntensity={1}
            >

                {/* Cubo interior */}
                <mesh ref={innerCubeRef} scale={1.4}>
                    <boxGeometry args={[1, 1, 1]} />

                    <meshStandardMaterial
                        color="#9ca3af"
                        roughness={0.3}
                        metalness={0.7}
                    />
                </mesh>

                {/* Cubo exterior */}
                <mesh ref={outerCubeRef} scale={2.1}>

                    <boxGeometry args={[1.5, 1.5, 1.5]} />

                    <meshBasicMaterial
                        transparent
                        opacity={0}
                        colorWrite={false}
                    />

                    <Edges
                        linewidth={4.5}
                        scale={1.01}
                        threshold={15}
                        color="#ffffff"
                    />

                </mesh>

            </Float>
        </group>
    );
};

const AuthBackground3D = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none">

            <Canvas
                camera={{ position: [0, 0, 8], fov: 40 }}
                eventSource={document.body}
                dpr={[1, 2]}
            >

                {/* Luces */}
                <ambientLight intensity={0.5} />

                <directionalLight
                    position={[5, 10, 5]}
                    intensity={1.5}
                    color="#ffffff"
                />

                <pointLight
                    position={[-5, -5, 5]}
                    intensity={2}
                    color="#8b5cf6"
                />

                {/* Partículas */}
                <Sparkles
                    count={80}
                    scale={10}
                    size={1.5}
                    speed={0.3}
                    opacity={0.4}
                    color="#d1d5db"
                />

                <Sparkles
                    count={40}
                    scale={8}
                    size={2.5}
                    speed={0.5}
                    opacity={0.6}
                    color="#8b5cf6"
                />

                <NestedLogoCubes />

                <Environment preset="studio" />

            </Canvas>
        </div>
    );
};

export default AuthBackground3D;