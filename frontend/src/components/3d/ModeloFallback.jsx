import React from "react";

const ModeloFallback = () => {
    return (
        <mesh>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="red" wireframe />
        </mesh>
    );
};

export default ModeloFallback;