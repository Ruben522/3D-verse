import React, { useContext, useEffect } from 'react';
import useFollows from "../../hooks/useFollows";
import useUsers from "../../hooks/useUsers";
import ProfileCard from './ProfileCard';

const UserFollowings = () => {
    const {
        followers,
        getFollowers,
    } = useFollows();

    const { activeProfileData } = useUsers();

    useEffect(() => {
        if (activeProfileData?.profile?.id) {
            getFollowers(activeProfileData.profile.id);
        }
    }, [activeProfileData]);

    return (
        (!followers || followers.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed transition-colors duration-300 animate-fade-in">
                <span className="text-6xl mb-4 block">🌍</span>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Este usuario aún no tiene seguidores
                </h3>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {followers.map((userItem) => (
                    <ProfileCard
                        key={userItem.id}
                        user={userItem}
                    />
                ))}
            </div>
        )
    );
};

export default UserFollowings;