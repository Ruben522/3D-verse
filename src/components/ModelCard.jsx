import React from "react";
import { useNavigate } from "react-router-dom";

const ModelCard = ({ model }) => {
  const navigate = useNavigate();

  return model ? (
    <div
      onClick={() => navigate(`/model/${model.id}`)}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
    >
      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={model.displayImage}
          alt={model.displayTitle}
          className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {model.displayTitle}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <img src={model.avatarUrl} alt={model.creatorName} className="w-6 h-6 rounded-full" />
          <span className="truncate">by {model.creatorName}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-gray-400 text-sm">
          <div className="flex items-center gap-4">
            <span>❤️ {model.likes}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="text-primary-600 hover:bg-primary-50 p-1.5 rounded-md transition-colors"
            title="Download"
          >
            ⬇️
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ModelCard;