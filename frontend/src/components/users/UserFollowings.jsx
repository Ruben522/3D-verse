import React, { useContext, useEffect } from 'react';
import useFollows from "../../hooks/useFollows";
import useUsers from "../../hooks/useUsers";
import ProfileCard from './ProfileCard';
import { useTranslation } from 'react-i18next';
import EmptyState from '../common/EmptyState';
import UserIcon from '../../assets/icons/UserIcon';

const UserFollowings = () => {
    const {
        following,
        getFollowing,
    } = useFollows();
    const { t } = useTranslation();
    const { activeProfileData } = useUsers();

    useEffect(() => {
        if (activeProfileData?.profile?.id) {
            getFollowing(activeProfileData.profile.id);
        }
    }, [activeProfileData]);

    return (

        (!following || following.length === 0) ? (
            <EmptyState
                icon={<UserIcon />}
                title={t('messages.no_following')}
            />
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                {following.map((userItem) => (
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