import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Visor3D from "../components/Visor3D";
import SelectorColores from "../components/SelectorColores";
import useAPI from "../hooks/useAPI";

const ModelDetail = () => {
    const { id } = useParams();
    const { get, isLoading, error } = useAPI();
    
    const [model, setModel] = useState(null);
    const [view3D, setView3D] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [activeTab, setActiveTab] = useState("detalles");
    const [parts, setParts] = useState([]);
    const [selectedPart, setSelectedPart] = useState(null);
    const [currentColor, setCurrentColor] = useState("#ffffff");

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const data = await get(`http://localhost:3000/models/${id}`);
                setModel(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchModel();
    }, [id]);

    const creatorData = model?.creator || {
        username: "3D-verse",
        avatar: "https://via.placeholder.com/40",
    };

    const stats = {
        downloads: model?.downloads || 0,
        likes: model?.likes || 0,
    };

    const publishDate = model?.created_at ? new Date(model.created_at).toLocaleDateString() : "Desconocida";

    return (
        <div className="min-h-screen bg-surface pb-20">
            {isLoading ? (
                <p className="text-center py-20">Cargando modelo...</p>
            ) : error || !model ? (
                <p className="text-center py-20 text-red-500">Modelo no encontrado</p>
            ) : (
                <>
                    <div className="max-w-7xl mx-auto px-6 py-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                                    {model.title}
                                </h1>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <img
                                        src={creatorData.avatar}
                                        alt={creatorData.username}
                                        className="w-8 h-8 rounded-full bg-gray-100 border"
                                    />
                                    <span>
                                        Diseñado por{" "}
                                        <span className="font-bold text-primary-600 hover:underline cursor-pointer">
                                            {creatorData.username}
                                        </span>
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="bg-primary-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center gap-3"
                            >
                                ⬇️ Descargar
                            </button>
                        </div>
                    </div>

                    <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative aspect-video">
                                {view3D ? (
                                    <Visor3D
                                        modelUrl={model.file_url}
                                        color={currentColor}
                                        selectedPart={selectedPart}
                                        onPartsDetected={setParts}
                                    />
                                ) : (
                                    <img
                                        src={model.main_image_url || model.image_url}
                                        alt={model.title}
                                        className="w-full h-full object-cover block"
                                    />
                                )}
                                <div className="absolute bottom-4 right-4">
                                    <button
                                        type="button"
                                        onClick={() => setView3D(!view3D)}
                                        className="bg-white/90 backdrop-blur text-gray-900 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2 border"
                                    >
                                        {view3D ? "📷 Ver fotos" : "🧊 Ver en 3D"}
                                    </button>
                                </div>
                            </div>
                            {view3D && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
                                            Elige el Color
                                        </p>
                                        <SelectorColores
                                            selectedColor={currentColor}
                                            onSelect={(color) => setCurrentColor(color)}
                                        />
                                    </div>

                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                Selecciona la Pieza
                                            </p>
                                            <span className="bg-primary-50 text-primary-600 text-[10px] font-bold px-2 py-1 rounded-full border border-primary-100">
                                                {parts.length} PARTES
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            <button
                                                onClick={() => setSelectedPart(null)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                                                    selectedPart === null
                                                        ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200"
                                                        : "bg-gray-50 text-gray-600 border-gray-100 hover:border-primary-300"
                                                }`}
                                            >
                                                ✨ Todo el modelo
                                            </button>

                                            {parts.map((part) => (
                                                <button
                                                    key={part.uuid}
                                                    onClick={() => setSelectedPart(part.uuid)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border truncate max-w-[150px] ${
                                                        selectedPart === part.uuid
                                                            ? "bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200"
                                                            : "bg-gray-50 text-gray-600 border-gray-100 hover:border-primary-300"
                                                    }`}
                                                    title={part.name}
                                                >
                                                    {part.name}
                                                </button>
                                            ))}
                                        </div>

                                        {parts.length === 0 && (
                                            <p className="text-gray-400 text-sm italic text-center py-4">
                                                Analizando estructura del modelo...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                <div className="flex gap-8 border-b border-gray-100 mb-6">
                                    <button
                                        onClick={() => setActiveTab("detalles")}
                                        className={`pb-4 font-bold text-lg ${
                                            activeTab === "detalles"
                                                ? "text-primary-600 border-b-2 border-primary-600"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        Detalles
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("comentarios")}
                                        className={`pb-4 font-bold text-lg ${
                                            activeTab === "comentarios"
                                                ? "text-primary-600 border-b-2 border-primary-600"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        Comentarios
                                    </button>
                                </div>

                                {activeTab === "detalles" && (
                                    <p className="text-lg text-gray-600">{model.description}</p>
                                )}
                            </div>
                        </div>

                        <aside className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Descargas</span>
                                        <span className="font-mono font-bold">
                                            {stats.downloads}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Likes</span>
                                        <span className="font-mono font-bold">
                                            {stats.likes + (isLiked ? 1 : 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Publicado</span>
                                        <span className="font-mono font-bold">
                                            {publishDate}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </main>
                </>
            )}
        </div>
    );
};

export default ModelDetail;