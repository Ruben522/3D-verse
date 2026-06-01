import React from 'react';
import useUsers from '../../hooks/useUsers';
import SocialLink from '../common/SocialLink';

const ProfileBio = ({ profile }) => {
    const { getActiveSocials } = useUsers();
    const activeSocials = getActiveSocials(profile);

    return (
        <div className="mb-6 flex flex-col items-center md:items-start text-center md:text-left w-full overflow-hidden">

            {profile.location && (
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors mb-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location}
                </div>
            )}

            {profile.bio && (
                <p className="text-base font-medium text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed whitespace-pre-wrap break-words transition-colors w-full">
                    {profile.bio}
                </p>
            )}
            {activeSocials.length > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                    {activeSocials.map((social) => (
                        <SocialLink key={social.type} type={social.type} url={social.url} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default ProfileBio;