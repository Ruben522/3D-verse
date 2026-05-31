import React from 'react';

const UserAvatarIcon = ({ username, className = "w-full h-full text-base" }) => {
    const displayLetter = username ? username.charAt(0).toUpperCase() : '?';

    return (
        <div className={`flex items-center justify-center rounded-full shrink-0 font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 transition-colors duration-300 ${className}`}>
            {displayLetter}
        </div>
    );
};

export default UserAvatarIcon;