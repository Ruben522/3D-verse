import React from 'react';
import BasicInfoSection from './BasicInfoSection';
import SocialMediaSection from './SocialMediaSection';

const UserSettings = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <BasicInfoSection />
            <SocialMediaSection />
        </div>
    );
};

export default UserSettings;