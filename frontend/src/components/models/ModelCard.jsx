import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../common/FavoriteButton";
import LikeButton from "../common/LikeButton";
import tagStyles from "../../utils/tagStyles";

const ModelCard = ({ model }) => {
  const navigate = useNavigate();

  const visibleTags = model.tags?.slice(0, 3) || [];
  const visibleCategory = model.categories?.[0] || null;

  return model ? (
    <div
      onClick={() => navigate(`/models/${model.id}`)}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-3 right-3 z-20">
        <FavoriteButton modelId={model.id} />
      </div>

      <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />

        {model.imageUrl ? (
          <img
            src={model.imageUrl}
            alt={model.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 grayscale transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100">
            🧊
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-3 left-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{model.views || 0}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight mb-3">
          {model.title}
        </h3>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
            <img
              src={model.avatarUrl || "/default-avatar.png"}
              alt={model.username}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors truncate">
            @{model.username}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {visibleCategory && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-gray-900 text-white shadow-sm">
              {visibleCategory}
            </span>
          )}

          {visibleTags.length > 0 && visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border transition-colors ${tagStyles[idx % tagStyles.length]}`}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100/50">

          <div className="transform transition-transform active:scale-95">
            <LikeButton modelId={model.id} initialLikesCount={model.likes} />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 transition-all hover:bg-blue-100 shadow-sm shadow-blue-50/50">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-[11px] font-black">{model.downloads || 0}</span>
          </div>

        </div>
      </div>
    </div>
  ) : null;
};

export default ModelCard;