import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Edges } from '@react-three/drei';
import * as THREE from 'three';

const MovingGrid = () => {
    const gridRef = useRef();

    useFrame((state, delta) => {
        if (gridRef.current) {
            gridRef.current.position.z =
                (gridRef.current.position.z + delta * 1.5) % 1;
        }
    });

    return (
        <group>
            <mesh
                ref={gridRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -2.5, -5]}
            >
                <planeGeometry args={[30, 30, 30, 30]} />

                <meshStandardMaterial
                    color="#4c1d95"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>
        </group>
    );
};

const LogoCube = () => {
    const groupRef = useRef();
    const cubeRef = useRef();

    useFrame((state, delta) => {

        if (cubeRef.current) {
            cubeRef.current.rotation.y += delta * 0.4;
            cubeRef.current.rotation.x += delta * 0.2;
        }

        if (groupRef.current) {
            const targetX = (state.pointer.x * Math.PI) / 6;
            const targetY = (state.pointer.y * Math.PI) / 6;
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
                speed={2}
                rotationIntensity={0.5}
                floatIntensity={1.5}
            >

                <mesh ref={cubeRef} scale={1.9} position={[0, 0.5, 0]}>

                    <boxGeometry args={[1.5, 1.5, 1.5]} />

                    <meshPhysicalMaterial
                        color="#374151"
                        metalness={0.8}
                        roughness={0.2}
                        transparent
                        opacity={0.4}
                        transmission={0.5}
                    />

                    <Edges
                        linewidth={2}
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
                camera={{ position: [0, 0, 8], fov: 45 }}
                eventSource={document.body}
                dpr={[1, 2]}
            >

                <ambientLight intensity={0.2} />

                <directionalLight
                    position={[0, 5, 5]}
                    intensity={1}
                    color="#ffffff"
                />

                <pointLight
                    position={[0, -2, 2]}
                    intensity={2}
                    color="#8b5cf6"
                />

                <MovingGrid />

                <LogoCube />

                <Environment preset="city" />

                <fog
                    attach="fog"
                    args={['#2e1065', 5, 15]}
                />

            </Canvas>
        </div>
    );
};

export default AuthBackground3D;