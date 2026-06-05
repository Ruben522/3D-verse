import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';

const RocketModel = () => {
    const flameRef = useRef();
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (flameRef.current) {
            flameRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 15) * 0.15;
            flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.1;
            flameRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.1;
        }

        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.4;
        }
    });

    const primaryColor = "#8b5cf6";

    return (
        <group ref={groupRef} rotation={[0.2, 0, 0.1]}>
            <Float speed={3} rotationIntensity={0.2} floatIntensity={1.5}>

                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.1} />
                </mesh>

                <mesh position={[0, 1.1, 0]}>
                    <coneGeometry args={[0.5, 0.7, 32]} />
                    <meshStandardMaterial color={primaryColor} roughness={0.3} metalness={0.5} />
                </mesh>

                <mesh position={[0, 0.2, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.15, 32]} />
                    <meshStandardMaterial color="#3b82f6" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
                </mesh>

                <mesh position={[0, 0.2, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.2, 0.04, 32, 32]} />
                    <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.7} />
                </mesh>

                {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, index) => (
                    <mesh key={index} position={[Math.sin(angle) * 0.45, -0.4, Math.cos(angle) * 0.45]} rotation={[0, angle, 0]}>
                        <boxGeometry args={[0.1, 0.6, 0.6]} />
                        <meshStandardMaterial color={primaryColor} roughness={0.3} metalness={0.5} />
                    </mesh>
                ))}

                <mesh position={[0, -0.85, 0]}>
                    <cylinderGeometry args={[0.3, 0.4, 0.2, 32]} />
                    <meshStandardMaterial color="#475569" roughness={0.7} metalness={0.8} />
                </mesh>

                <mesh ref={flameRef} position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
                    <coneGeometry args={[0.25, 0.8, 16]} />
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={2} toneMapped={false} />
                </mesh>

            </Float>
        </group>
    );
};

const ThreeDHomeIcon = () => {
    return (
        <div className="w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
                <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#8b5cf6" />
                <RocketModel />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
};

export default ThreeDHomeIcon;