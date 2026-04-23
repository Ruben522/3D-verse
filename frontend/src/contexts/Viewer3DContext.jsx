import React, { createContext, useState, useCallback } from "react";

const viewer3d = createContext();

const Viewer3DContext = ({ children }) => {
    const [activeUploadTab, setActiveUploadTab] = useState("todo");
    const [activeMediaTab, setActiveMediaTab] = useState("imagenes");
    const [mainImage, setMainImage] = useState(null);
    const [active3DUrl, setActive3DUrl] = useState(null);
    const [isInteractive, setIsInteractive] = useState(false);
    const [detectedParts, setDetectedParts] = useState([]);
    const [selectedPart, setSelectedPart] = useState(null);
    const [currentColor, setCurrentColor] = useState("#3b82f6");


    const handlePartsDetected = useCallback((newParts) => {
        setDetectedParts((prevParts) => {
            if (prevParts.length !== newParts.length) return newParts;
            const sonIguales = prevParts.every((part, index) => part.uuid === newParts[index].uuid);
            return sonIguales ? prevParts : newParts;
        });
    }, []);

    const resetViewer = useCallback((model) => {
        setActiveMediaTab("imagenes");
        setMainImage(model?.imageUrl || null);
        setActive3DUrl(model?.fileUrl || null);
        setIsInteractive(false);
        setDetectedParts([]);
        setSelectedPart(null);
        setCurrentColor("#3b82f6");
        setActiveUploadTab("todo");
    }, []);

    const exportData = {
        activeUploadTab, setActiveUploadTab,
        activeMediaTab, setActiveMediaTab,
        mainImage, setMainImage,
        active3DUrl, setActive3DUrl,
        isInteractive, setIsInteractive,
        detectedParts, handlePartsDetected,
        selectedPart, setSelectedPart,
        currentColor, setCurrentColor,
        resetViewer
    };

    return <viewer3d.Provider value={exportData}>{children}</viewer3d.Provider>;
};

export { viewer3d };
export default Viewer3DContext;