import React from 'react';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUsers from '../../hooks/useUsers';

const ProfileHeader = ({ profile, stats, isOwnProfile, cerrarSesion }) => {
  const { t } = useTranslation();
  const { getProfileStyles } = useUsers();
  const styles = getProfileStyles(profile);

  const bgColor = styles.cardBg?.backgroundColor || '';
  const hasCustomBg = bgColor && bgColor.toLowerCase() !== '#ffffff' && bgColor.toLowerCase() !== '#fff';
  const dynamicCardStyle = hasCustomBg ? { backgroundColor: bgColor } : {};

  return (
    <div
      style={dynamicCardStyle}
      className={`rounded-3xl shadow-sm border overflow-hidden mb-8 transition-colors duration-300
        ${!hasCustomBg ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'border-transparent'}
      `}
    >
      <div style={styles.bannerBg} className="h-48 md:h-64 w-full relative">
      </div>

      <div className="px-6 sm:px-10 pb-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6 relative z-10">

          <div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-6xl font-black flex-shrink-0 transition-colors duration-300"
          >
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover bg-white dark:bg-gray-800" />
            ) : (
              profile?.inicial || profile?.username?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
            {isOwnProfile ? (
              <>
                <Button variant="outline" className="flex-1 md:flex-none !px-6 !py-2.5 !text-sm whitespace-nowrap">
                  <Link to="/settings" className="w-full h-full flex items-center justify-center">
                    ⚙️ {t("user.settings")}
                  </Link>
                </Button>
                <Button onClick={cerrarSesion} className="flex-1 md:flex-none !px-6 !py-2.5 !text-sm !bg-red-50 dark:!bg-red-900/20 !text-red-600 dark:!text-red-400 border border-red-200 dark:border-red-800 hover:!bg-red-100 dark:hover:!bg-red-900/40 shadow-none whitespace-nowrap transition-colors">
                  🚪 {t("user.logout")}
                </Button>
              </>
            ) : (
              <Button style={styles.primaryBg} className="flex-1 md:flex-none !px-10 !py-2.5 !text-sm text-white shadow-md hover:shadow-lg border-none">
                + {t("user.follow")}
              </Button>
            )}
          </div>
        </div>
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
            {profile?.name} {profile?.lastname}
          </h1>
          <p className="text-lg font-bold mt-1 text-primary-600 dark:text-primary-400 transition-colors">
            @{profile?.username}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium transition-colors">
            {t("user.member_since")} {profile?.fechaRegistro}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-14 py-6 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats?.total_models || 0}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 transition-colors">{t("user.models")}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats?.total_followers || 0}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 transition-colors">{t("user.followers")}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats?.total_following || 0}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 transition-colors">{t("user.total_following")}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats?.total_favorites_given || 0}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 transition-colors">{t("user.total_favorites_given")}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileHeader;