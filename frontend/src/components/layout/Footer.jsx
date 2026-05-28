import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { useTranslation } from "react-i18next";
import XIcon from '../../assets/icons/XIcon';
import InstagramIcon from '../../assets/icons/InstagramIcon';
import GithubIcon from '../../assets/icons/GithubIcon';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="flex flex-col text-white sm:flex-row items-center gap-4 sm:gap-6">
          <div className="scale-90 origin-center sm:origin-left">
            <Logo />
          </div>
          <p className="text-sm text-slate-500 font-medium text-center sm:text-left">
            {t('footer.caracter')} {currentYear} {t('footer.all_rights')}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-slate-400">
          <Link to="/contacto" className="hover:text-white transition-colors">
            {t('footer.contact')}
          </Link>
          <Link to="/terminos" className="hover:text-white transition-colors">
            {t('footer.terms')}
          </Link>
          <Link to="/privacidad" className="hover:text-white transition-colors">
            {t('footer.privacy')}
          </Link>
        </div>

        <div className="flex items-center gap-5 text-slate-500">
          <a href="#" className="hover:text-white hover:-translate-y-1 transition-all" title="X">
            <XIcon />
          </a>
          <a href="#" className="hover:text-white hover:-translate-y-1 transition-all" title="Instagram">
            <InstagramIcon />
          </a>
          <a href="#" className="hover:text-white hover:-translate-y-1 transition-all" title="GitHub">
            <GithubIcon />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;