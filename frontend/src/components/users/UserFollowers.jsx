import React, { useContext, useEffect } from 'react';
import useFollows from "../../hooks/useFollows";
import useUsers from "../../hooks/useUsers";
import ProfileCard from './ProfileCard';
import { useTranslation } from 'react-i18next';
import EmptyState from '../common/EmptyState';
import UserIcon from '../../assets/icons/UserIcon';

const UserFollowers = () => {
    const {
        followers,
        getFollowers,
    } = useFollows();
    const { t } = useTranslation();
    const { activeProfileData } = useUsers();

    useEffect(() => {
        if (activeProfileData?.profile?.id) {
            getFollowers(activeProfileData.profile.id);
        }
    }, [activeProfileData]);

    return (
        (!followers || followers.length === 0) ? (
            <EmptyState
                icon={<UserIcon />}
                title={t('messages.no_followers')}
            />
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

export default UserFollowers;