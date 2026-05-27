import React, { useState } from 'react';
import useUsers from '../../../hooks/useUsers';
import AccordionSection from '../../common/AccordionSection';
import AvatarSettings from './AvatarSettings';
import BannerSettings from './BannerSettings';
import CameraIcon from '../../../assets/icons/CameraIcon';
import PaletteIcon from '../../../assets/icons/PaletteIcon';

const CustomizationSection = () => {
    const { datosPerfil, actualizarDatoPerfil } = useUsers();

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
                title="Foto de Perfil"
                subtitle="Tu avatar principal en la comunidad"
                isOpen={expandedSections.includes('avatar')}
                onToggle={toggleSection}
                icon={<CameraIcon className="w-6 h-6 text-white" />}
            >
                <AvatarSettings />
            </AccordionSection>

            <AccordionSection
                id="banner"
                title="Banner y Color"
                subtitle="Personaliza la cabecera de tu tarjeta"
                isOpen={expandedSections.includes('banner')}
                onToggle={toggleSection}
                icon={<PaletteIcon className="w-6 h-6 text-white" />}
            >
                <BannerSettings />
            </AccordionSection>

        </div>
    );
};

export default CustomizationSection;