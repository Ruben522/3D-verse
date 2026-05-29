import React from 'react';
import XIcon from '../../assets/icons/XIcon';
import YoutubeIcon from '../../assets/icons/YoutubeIcon';
import LinkedinIcon from '../../assets/icons/LinkedinIcon';
import GithubIcon from '../../assets/icons/GithubIcon';

const SocialLink = ({ type, url }) => {
    const baseClass = "w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all hover:scale-110 hover:shadow-md";

    if (type === 'youtube') return <a href={url} target="_blank" rel="noreferrer" className={`${baseClass} hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-500`}><YoutubeIcon className="w-5 h-5" /></a>;
    if (type === 'twitter') return <a href={url} target="_blank" rel="noreferrer" className={`${baseClass} hover:bg-gray-200 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white`}><XIcon className="w-5 h-5" /></a>;
    if (type === 'linkedin') return <a href={url} target="_blank" rel="noreferrer" className={`${baseClass} hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-500`}><LinkedinIcon className="w-5 h-5" /></a>;
    if (type === 'github') return <a href={url} target="_blank" rel="noreferrer" className={`${baseClass} hover:bg-gray-300 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white`}><GithubIcon className="w-5 h-5" /></a>;

    return null;
};

export default SocialLink;