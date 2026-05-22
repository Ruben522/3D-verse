import React, { useState } from 'react';
import AccordionSection from '../../common/AccordionSection';
import BasicInfoSection from './BasicInfoSection';
import SocialMediaSection from './SocialMediaSection';
import AccountSection from './AccountSection';

const UserSettings = () => {
    // Controlamos qué acordeones están abiertos por defecto
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
                icon={<span className="text-xl">👤</span>}
            >
                <BasicInfoSection />
            </AccordionSection>

            <AccordionSection
                id="social"
                title="Redes Sociales"
                subtitle="Conecta tus cuentas externas"
                isOpen={expandedSections.includes('social')}
                onToggle={toggleSection}
                icon={<span className="text-xl">🔗</span>}
            >
                <SocialMediaSection />
            </AccordionSection>

            {/* 👇 NUEVA SECCIÓN DE CUENTA 👇 */}
            <AccordionSection
                id="account"
                title="Cuenta"
                subtitle="Gestión de seguridad y eliminación"
                isOpen={expandedSections.includes('account')}
                onToggle={toggleSection}
                icon={<span className="text-xl">⚙️</span>}
            >
                <AccountSection />
            </AccordionSection>
        </div>
    );
};

export default UserSettings;