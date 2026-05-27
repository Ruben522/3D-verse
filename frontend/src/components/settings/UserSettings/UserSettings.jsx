import React, { useState } from 'react';
import AccordionSection from '../../common/AccordionSection';
import BasicInfoSection from './BasicInfoSection';
import SocialMediaSection from './SocialMediaSection';
import AccountSection from './AccountSection';
import UserIcon from '../../../assets/icons/UserIcon';
import LinkIcon from '../../../assets/icons/LinkIcon';
import SettingIcon from '../../../assets/icons/SettingIcon';

const UserSettings = () => {
    const [expandedSections, setExpandedSections] = useState(['basic', 'social']);

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-6">
            <AccordionSection
                id="basic"
                title="Información Básica"
                subtitle="Nombre, ubicación y biografía"
                isOpen={expandedSections.includes('basic')}
                onToggle={toggleSection}
                icon={<UserIcon className="w-6 h-6 text-white" />}
            >
                <BasicInfoSection />
            </AccordionSection>

            <AccordionSection
                id="social"
                title="Redes Sociales"
                subtitle="Conecta tus cuentas externas"
                isOpen={expandedSections.includes('social')}
                onToggle={toggleSection}
                icon={<LinkIcon className="w-6 h-6 text-white" />}
            >
                <SocialMediaSection />
            </AccordionSection>

            <AccordionSection
                id="account"
                title="Cuenta"
                subtitle="Gestión de seguridad y eliminación"
                isOpen={expandedSections.includes('account')}
                onToggle={toggleSection}
                icon={<SettingIcon className="w-6 h-6 text-white" />}
            >
                <AccountSection />
            </AccordionSection>
        </div>
    );
};

export default UserSettings;