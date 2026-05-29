import React from "react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../common/FavoriteButton";
import LikeButton from "../common/LikeButton";
import tagStyles from "../../utils/tagStyles";
import useUsers from "../../hooks/useUsers";
import EditIcon from "../../assets/icons/EditIcon";
import CubeIcon from "../../assets/icons/CubeIcon";
import ViewIcon from "../../assets/icons/ViewIcon";
import DownloadIcon from "../../assets/icons/DownloadIcon";
import { useTranslation } from "react-i18next";
import useModels from "../../hooks/useModels";

const ModelCard = ({ model }) => {
  const navigate = useNavigate();
  const { checkIsOwnModel, isAdmin } = useUsers();
  const { t } = useTranslation();
  const { visibleTagsModel, visibleCategoryModel } = useModels();

  const isOwner = checkIsOwnModel(model);

  return model ? (
    <div
      onClick={() => navigate(`/models/${model.id}`)}
      className="
        group relative flex flex-col
        bg-white dark:bg-gray-800
        rounded-2xl
        border border-gray-100 dark:border-gray-700
        shadow-sm dark:shadow-black/20
        hover:shadow-xl dark:hover:shadow-black/40
        hover:-translate-y-1.5
        transition-all duration-300
        cursor-pointer overflow-hidden
      "
    >
      {(isOwner || isAdmin) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit/${model.id}`);
          }}
          className="
            absolute top-3 left-3 z-20
            w-9 h-9 flex items-center justify-center shrink-0
            bg-white/90 dark:bg-gray-900/90 backdrop-blur-md
            border border-purple-100 dark:border-purple-900/30
            hover:border-purple-500 dark:hover:border-purple-500
            rounded-full shadow-sm hover:shadow-md hover:scale-105
            transition-all duration-300
          "
          title={!isOwner && isAdmin ? "Moderar modelo (Admin)" : "Editar modelo"}
        >
          <EditIcon
            colorClass={!isOwner && isAdmin ? "text-purple-600 dark:text-purple-400" : "text-purple-500"}
          />
        </button>
      )}

      <div className="absolute top-3 right-3 z-20 flex items-center justify-center w-9 h-9">
        <FavoriteButton modelId={model.id} />
      </div>

      <div className="relative w-full aspect-[4/3] bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900" />
        {model.imageUrl ? (
          <img
            src={model.imageUrl}
            alt={model.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <CubeIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 group-hover:text-purple-200 dark:group-hover:text-purple-900 transition-colors duration-500" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl border border-white/10 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            <ViewIcon className="w-3.5 h-3.5" />
            <span>{model.views || 0}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight mb-3">
          {model.title}
        </h3>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
            <img src={model.avatarUrl} alt={model.username} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold truncate text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
            @{model.username}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {visibleCategoryModel(model.id) && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-purple-600 dark:bg-purple-700 text-white shadow-sm">
              {t(`categories.${visibleCategoryModel(model.id)}`)}
            </span>
          )}
          {visibleTagsModel(model.id)?.map((tag, idx) => (
            <span key={idx} className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold border transition-colors ${tagStyles[idx % tagStyles.length]}`}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="transform transition-transform active:scale-95">
            <LikeButton modelId={model.id} likesCount={model.likes} />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20 hover:bg-purple-100 transition-all shadow-sm">
            <DownloadIcon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black">{model.downloads || 0}</span>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default ModelCard;