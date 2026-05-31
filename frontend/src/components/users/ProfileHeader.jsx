import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useUsers from '../../hooks/useUsers';
import SettingIcon from '../../assets/icons/SettingIcon';
import ExitAccountIcon from '../../assets/icons/ExitAccountIcon';
import FollowButton from '../common/FollowButton';
import ProfileBio from './ProfileBio';
import UserAvatarIcon from '../../assets/icons/UserAvatarIcon';

const ProfileHeader = ({ profile, stats, isOwnProfile, cerrarSesion }) => {
  const { t } = useTranslation();
  const { getProfileStyles } = useUsers();
  const styles = getProfileStyles(profile);

  return (
    <div className="rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden mb-8 transition-colors duration-300">
      <div style={styles.bannerBg} className="h-48 md:h-64 w-full relative"></div>

      <div className="px-6 sm:px-10 pb-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6 relative z-10">

          {profile?.avatarUrl ? (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden shrink-0 transition-colors duration-300">
              <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover bg-white dark:bg-gray-800" />
            </div>
          ) : (
            <UserAvatarIcon
              username={profile?.username}
              className="w-32 h-32 md:w-40 md:h-40 border-4 border-white dark:border-gray-800 shadow-lg text-6xl"
            />
          )}

          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
            {isOwnProfile ? (
              <>
                <Link
                  to="/settings"
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  <SettingIcon />
                  {t("user.settings")}
                </Link>

                <button
                  onClick={cerrarSesion}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors whitespace-nowrap"
                >
                  <ExitAccountIcon />
                  {t("user.logout")}
                </button>
              </>
            ) : (
              <FollowButton targetUserId={profile?.id} />
            )}
          </div>
        </div>

        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
            {profile?.name} {profile?.lastname}
          </h1>
          <p className="text-lg font-bold mt-1 text-primary-600 dark:text-primary-400 transition-colors">
            @{profile?.username}
          </p>
          <p className="flex items-center justify-center md:justify-start gap-1.5 text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {t("user.member_since")} {profile?.fechaRegistro}
          </p>
        </div>

        <ProfileBio profile={profile} />

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
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 transition-colors">{t("user.following")}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-3xl font-black text-gray-900 dark:text-white transition-colors">{stats?.total_favorites_given || 0}</span>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1 transition-colors">{t("user.favorites")}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileHeader;