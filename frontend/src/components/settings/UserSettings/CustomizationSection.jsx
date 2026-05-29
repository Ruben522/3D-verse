import React, { useState } from 'react';
import useUsers from '../../../hooks/useUsers';
import AccordionSection from '../../common/AccordionSection';
import AvatarSettings from './AvatarSettings';
import BannerSettings from './BannerSettings';
import CameraIcon from '../../../assets/icons/CameraIcon';
import PaletteIcon from '../../../assets/icons/PaletteIcon';
import { useTranslation } from 'react-i18next';

const CustomizationSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();
    const { t } = useTranslation();

    const [expandedSections, setExpandedSections] = useState(['avatar', 'banner']);

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">

            <AccordionSection
                id="avatar"
                title={t('user_settings.customization.avatar')}
                subtitle={t('user_settings.customization.avatar_subtitle')}
                isOpen={expandedSections.includes('avatar')}
                onToggle={toggleSection}
                icon={<CameraIcon className="w-6 h-6 text-white" />}
            >
                <AvatarSettings />
            </AccordionSection>

            <AccordionSection
                id="banner"
                title={t('user_settings.customization.banner')}
                subtitle={t('user_settings.customization.banner_subtitle')}
                isOpen={expandedSections.includes('banner') ? false : true}
                onToggle={toggleSection}
                icon={<PaletteIcon className="w-6 h-6 text-white" />}
            >
                <BannerSettings />
            </AccordionSection>

        </div>
    );
};

export default CustomizationSection;