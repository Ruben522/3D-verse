import React, { useState } from 'react';
import AccordionSection from '../../common/AccordionSection';
import BasicInfoSection from './BasicInfoSection';
import SocialMediaSection from './SocialMediaSection';
import AccountSection from './AccountSection';
import UserIcon from '../../../assets/icons/UserIcon';
import LinkIcon from '../../../assets/icons/LinkIcon';
import SettingIcon from '../../../assets/icons/SettingIcon';
import { useTranslation } from 'react-i18next';

const UserSettings = () => {
    const [expandedSections, setExpandedSections] = useState(['basic', 'social']);
    const { t } = useTranslation();

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <AccordionSection
                id="basic"
                title={t('user_settings.basic_info.title')}
                subtitle={t('user_settings.basic_info.subtitle')}
                isOpen={expandedSections.includes('basic')}
                onToggle={toggleSection}
                icon={<UserIcon className="w-6 h-6 text-white" />}
            >
                <BasicInfoSection />
            </AccordionSection>

            <AccordionSection
                id="social"
                title={t('user_settings.social_links.title')}
                subtitle={t('user_settings.social_links.subtitle')}
                isOpen={expandedSections.includes('social') ? false : true}
                onToggle={toggleSection}
                icon={<LinkIcon className="w-6 h-6 text-white" />}
            >
                <SocialMediaSection />
            </AccordionSection>
        </div>
    );
};

export default UserSettings;