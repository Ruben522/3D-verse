import React, { useState } from 'react';
import AccordionSection from '../../common/AccordionSection';
import DeleteAccount from './DeleteAccount';
import SettingIcon from '../../../assets/icons/SettingIcon';
import { useTranslation } from 'react-i18next';

const AccountSection = () => {
    const [expandedSections, setExpandedSections] = useState(['danger']);
    const { t } = useTranslation();

    const toggleSection = (id) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(sec => sec !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col gap-6">

            <AccordionSection
                id="danger"
                title={t('user_settings.account.danger_zone')}
                subtitle={t('user_settings.account.danger_desc')}
                isOpen={expandedSections.includes('danger')}
                onToggle={toggleSection}
                icon={<SettingIcon className="w-6 h-6 text-white" />}
            >
                <DeleteAccount />
            </AccordionSection>

        </div>
    );
};

export default AccountSection;