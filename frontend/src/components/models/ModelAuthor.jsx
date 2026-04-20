import React from "react";
import { useNavigate } from "react-router-dom";
import useModels from "../../hooks/useModels";

const ModelAuthor = () => {
    const navigate = useNavigate();
    const { currentModel } = useModels();

    return (
        <div
            onClick={() => navigate(`/perfil/${currentModel.username}`)}

            className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
        >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                {currentModel.avatarUrl ? (
                    <img
                        src={currentModel.avatarUrl}
                        alt={currentModel.username}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-xl">
                        {currentModel.username.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            {/* Información del autor */}
            <div className="flex flex-col">
                <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {currentModel.username}
                </span>
                <span className="text-sm text-gray-500">Creador</span>
            </div>
        </div>
    );
};

export default ModelAuthor;