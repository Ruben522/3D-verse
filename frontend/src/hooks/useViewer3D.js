import React, { useContext } from "react";
import { viewer3d } from "../contexts/Viewer3DContext.jsx";

const useViewer3D = () => {
    const context = useContext(viewer3d);

    if (context === undefined) {
        return { activeMediaTab: null, isInteractive: false };
    }

    return context;
};

export default useViewer3D;
