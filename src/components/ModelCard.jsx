import React from "react";
import { useNavigate } from "react-router-dom";

const ModelCard = ({ modelo }) => {
  const navigate = useNavigate();

  const likes = Math.floor(Math.random() * 500) + 10;
  const creator = modelo.creator || "MakerPro";
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${modelo.id}`;

  return (
    <div
      onClick={() => navigate(`/modelo/${modelo.id}`)}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
    >
      {/* IMAGEN */}
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={modelo.image_url}
          alt={modelo.title}
          className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* INFO */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {modelo.description}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <img src={avatarUrl} alt={creator} className="w-6 h-6 rounded-full" />
          <span className="truncate">by {creator}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-gray-400 text-sm">
          <div className="flex items-center gap-4">
            <span>❤️ {likes}</span>
          </div>

          {/* BOTÓN DESCARGA */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Descargar", modelo.id);
            }}
            className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-md transition-colors"
            title="Descargar"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelCard;
