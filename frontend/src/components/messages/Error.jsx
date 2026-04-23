import React from "react";
import { useTranslation } from "react-i18next";

const Error = (error) => {
	const { t } = useTranslation();

	return <div className="text-red-500">{t('messages.error')}: {error.message}</div>;
};

export default Error;
