import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Visor3D from "../components/Visor3D";
import SelectorColores from "../components/SelectorColores";
import useModels from "../hooks/useModels";

const ModelDetail = () => {
  const { id } = useParams();
  const { getModelById, isLoading, error, currentModel } = useModels();

  // Pestañas
  const [activeMediaTab, setActiveMediaTab] = useState("imagenes");
  const [activeInfoTab, setActiveInfoTab] = useState("detalles");
  
  // Estados para Multimedia y 3D
  const [mainImage, setMainImage] = useState(null);
  const [active3DUrl, setActive3DUrl] = useState(null); // Qué archivo 3D estamos viendo ahora
  const [isInteractive, setIsInteractive] = useState(false); // Controla si el 3D se puede girar
  
  // Estados para el visor interno (colores y sub-piezas del gltf)
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [currentColor, setCurrentColor] = useState("#ffffff");

  // Cargar modelo al entrar
  useEffect(() => {
    if (id) getModelById(id);
  }, [id]);

  // Sincronizar datos iniciales cuando currentModel carga
  useEffect(() => {
    if (currentModel) {
      if (currentModel.imageUrl) setMainImage(currentModel.imageUrl);
      if (currentModel.fileUrl) setActive3DUrl(currentModel.fileUrl);
    }
  }, [currentModel]);

  // Si cambiamos de modelo en el carrusel o cambiamos de pestaña, bloqueamos la interacción
  useEffect(() => {
    setIsInteractive(false);
  }, [activeMediaTab, active3DUrl]);

  // Variable de seguridad por si usaste "parts" o "partsData" en el mapeo
  const modelPartsList = currentModel?.parts || currentModel?.partsData || [];

  return (
    <div className="min-h-screen bg-surface pb-20">
      {isLoading || !currentModel ? (
        <p className="text-center py-20 text-gray-500 font-medium">Cargando modelo...</p>
      ) : error || !currentModel ? (
        <p className="text-center py-20 text-red-500 font-medium">Modelo no encontrado</p>
      ) : (
        <>
          {/* ENCABEZADO */}
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                  {currentModel.title}
                </h1>
                <div className="flex items-center gap-3 text-gray-500">
                  <img
                    src={currentModel.avatarUrl || "https://via.placeholder.com/40"}
                    alt={currentModel.username}
                    className="w-8 h-8 rounded-full bg-gray-100 border object-cover"
                  />
                  <span className="font-bold text-primary-600 hover:underline cursor-pointer">
                    {currentModel.username}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="bg-primary-600 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-primary-700 hover:-translate-y-0.5 transition-all flex items-center gap-3"
              >
                ⬇️ Descargar todo
              </button>
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ==================================================== */}
            {/* COLUMNA IZQUIERDA (CONTENIDO PRINCIPAL)              */}
            {/* ==================================================== */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                
                {/* PESTAÑAS MULTIMEDIA */}
                <div className="flex gap-8 border-b border-gray-100 mb-6">
                  <button
                    onClick={() => setActiveMediaTab("imagenes")}
                    className={`pb-4 font-bold text-lg transition-colors ${
                      activeMediaTab === "imagenes"
                        ? "text-primary-600 border-b-2 border-primary-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    🖼️ Imágenes
                  </button>
                  <button
                    onClick={() => setActiveMediaTab("modelos")}
                    className={`pb-4 font-bold text-lg transition-colors ${
                      activeMediaTab === "modelos"
                        ? "text-primary-600 border-b-2 border-primary-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    🧊 Modelos 3D
                  </button>
                </div>

                {/* ZONA DE VISUALIZACIÓN */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                  
                  {/* Vista Imágenes */}
                  {activeMediaTab === "imagenes" && (
                    <img
                      src={mainImage || currentModel.imageUrl}
                      alt={currentModel.title}
                      className="w-full h-full object-cover block"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x450?text=Sin+Imagen'; }}
                    />
                  )}

                  {/* Vista Modelos 3D */}
                  {activeMediaTab === "modelos" && active3DUrl && (
                    <div className="w-full h-full relative">
                      {/* El modelo siempre carga y se renderiza */}
                      <Visor3D
                        currentModelUrl={active3DUrl}
                        color={currentColor}
                        selectedPart={selectedPart}
                        onPartsDetected={setParts}
                      />
                      
                      {/* CAPA DE BLOQUEO: Finge que es estático hasta que se clica */}
                      {!isInteractive && (
                        <div 
                          className="absolute inset-0 z-10 flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors cursor-pointer"
                          onClick={() => setIsInteractive(true)}
                        >
                          <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 transform transition-transform hover:scale-105">
                            <span className="text-3xl">👆</span>
                            <span className="font-extrabold text-gray-800">Clica para interactuar</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ==================================================== */}
                {/* CARRUSELES (Debajo del visor)                        */}
                {/* ==================================================== */}
                
                {/* Carrusel de Imágenes */}
                {activeMediaTab === "imagenes" && currentModel.gallery?.length > 0 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto py-2 custom-scrollbar">
                    <img 
                      src={currentModel.imageUrl} 
                      onClick={() => setMainImage(currentModel.imageUrl)}
                      alt="Portada" 
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${mainImage === currentModel.imageUrl ? 'border-primary-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
                    />
                    {currentModel.gallery.map((imgUrl, index) => (
                      <img 
                        key={index} 
                        src={imgUrl} 
                        onClick={() => setMainImage(imgUrl)}
                        alt={`Miniatura ${index + 1}`} 
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${mainImage === imgUrl ? 'border-primary-600 scale-105' : 'border-transparent hover:border-gray-300'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Carrusel de Modelos 3D (Modelo principal + Partes) */}
                {activeMediaTab === "modelos" && (
                  <div className="flex gap-3 mt-4 overflow-x-auto py-2 custom-scrollbar">
                    
                    {/* Botón para el modelo principal */}
                    <button
                      onClick={() => setActive3DUrl(currentModel.fileUrl)}
                      className={`px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-2 border-2 transition-all ${
                        active3DUrl === currentModel.fileUrl
                          ? "border-primary-600 bg-primary-50 text-primary-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"
                      }`}
                    >
                      🧊 Modelo Principal
                    </button>

                    {/* Botones para cada parte del modelo */}
                    {modelPartsList.map((part) => (
                      <button
                        key={part.id}
                        onClick={() => setActive3DUrl(part.fileUrl)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm flex-shrink-0 flex items-center gap-2 border-2 transition-all ${
                          active3DUrl === part.fileUrl
                            ? "border-primary-600 bg-primary-50 text-primary-700"
                            : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:bg-gray-50"
                        }`}
                      >
                        🧩 {part.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* ==================================================== */}
                {/* CONTROLES DE COLOR Y PIEZAS (Solo si el 3D interactúa) */}
                {/* ==================================================== */}
                {activeMediaTab === "modelos" && isInteractive && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Color de la pieza</p>
                      <SelectorColores selectedColor={currentColor} onSelect={setCurrentColor} />
                    </div>
                    {/* Solo mostramos selector interno si hay partes detectadas (ej: archivos GLTF) */}
                    {parts.length > 1 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Partes Internas</p>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                          <button
                            onClick={() => setSelectedPart(null)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedPart === null ? "bg-primary-600 text-white" : "bg-gray-50 text-gray-600"}`}
                          >
                            Todas
                          </button>
                          {parts.map((p) => (
                            <button
                              key={p.uuid}
                              onClick={() => setSelectedPart(p.uuid)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedPart === p.uuid ? "bg-primary-600 text-white" : "bg-gray-50 text-gray-600"}`}
                            >
                              {p.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BLOQUE: Detalles y Comentarios */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="flex gap-8 border-b border-gray-100 mb-6">
                  <button
                    onClick={() => setActiveInfoTab("detalles")}
                    className={`pb-4 font-bold text-lg transition-colors ${
                      activeInfoTab === "detalles" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Detalles
                  </button>
                  <button
                    onClick={() => setActiveInfoTab("comentarios")}
                    className={`pb-4 font-bold text-lg transition-colors ${
                      activeInfoTab === "comentarios" ? "text-primary-600 border-b-2 border-primary-600" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    Comentarios
                  </button>
                </div>

                {activeInfoTab === "detalles" && (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {currentModel.description || "El autor no ha proporcionado una descripción para este modelo."}
                    </p>
                  </div>
                )}
                {activeInfoTab === "comentarios" && (
                   <div className="text-center py-10 text-gray-500 italic">
                     Los comentarios estarán disponibles próximamente.
                   </div>
                )}
              </div>

              {/* BLOQUE: Descarga individual de archivos */}
              {modelPartsList.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📦 Archivos individuales ({modelPartsList.length})
                  </h3>
                  <div className="space-y-3">
                    {modelPartsList.map((part) => (
                      <div key={part.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{part.name}</span>
                          <span className="text-xs text-gray-500 mt-1 font-mono">
                            {part.size ? `${(part.size / 1024 / 1024).toFixed(2)} MB` : "Tamaño desconocido"}
                          </span>
                        </div>
                        <a 
                          href={part.fileUrl} 
                          download 
                          className="text-primary-600 bg-white border border-primary-200 hover:bg-primary-600 hover:text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
                        >
                          Descargar
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================== */}
            {/* COLUMNA DERECHA (ASIDE Fijo, sin scroll sticky)      */}
            {/* ==================================================== */}
            <aside className="space-y-6">
              
              {/* 1. Estadísticas */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Estadísticas</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2">📥 Descargas</span>
                    <span className="font-mono font-bold text-gray-900">{currentModel.downloads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2">❤️ Likes</span>
                    <span className="font-mono font-bold text-gray-900">{currentModel.likes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-2">👁️ Vistas</span>
                    <span className="font-mono font-bold text-gray-900">{currentModel.views}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-gray-500">Publicado</span>
                    <span className="font-mono font-bold text-gray-900">{currentModel.createdDate}</span>
                  </div>
                  {currentModel.license && (
                    <div className="flex flex-col gap-1 pt-4 border-t border-gray-100">
                      <span className="text-gray-500 text-xs uppercase tracking-wider">Licencia</span>
                      <span className="font-semibold text-gray-800 text-xs">{currentModel.license}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Categorías y Tags */}
              {(currentModel.categories?.length > 0 || currentModel.tags?.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Clasificación</h3>
                  
                  {currentModel.categories?.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Categorías</span>
                      <div className="flex flex-wrap gap-2">
                        {currentModel.categories.map((category, index) => (
                          <span key={`cat-${index}`} className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100">
                            📂 {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentModel.tags?.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Etiquetas</span>
                      <div className="flex flex-wrap gap-2">
                        {currentModel.tags.map((tag, index) => (
                          <span key={`tag-${index}`} className="bg-gray-50 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </aside>
            
          </main>
        </>
      )}
    </div>
  );
};

export default ModelDetail;