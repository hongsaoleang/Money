import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SUPPORTED_LANGUAGES = [
  { code: 'EN', name: 'English (US)', nativeName: 'English', flag: '🇺🇸' },
  { code: 'KH', name: 'ភាសាខ្មែរ (Khmer)', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'FR', name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ES', name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ZH', name: '中文 (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
];

const LanguageSelector = ({ variant = 'default' }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className={`lang-selector-root ${variant}`} ref={dropdownRef}>
      <button
        type="button"
        className={`lang-selector-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t('nav.selectLanguage', 'Select Language')}
        aria-label="Select website language"
        aria-expanded={isOpen}
      >
        <Globe size={16} className="lang-globe-icon text-indigo-500" />
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{current.code}</span>
        <ChevronDown size={13} className={`lang-chevron transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="lang-dropdown-card">
          <div className="lang-dropdown-header">
            <span>{t('nav.selectLanguage', 'Select Language')}</span>
          </div>
          <ul className="lang-dropdown-list">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                className={`lang-dropdown-item ${lang.code === language ? 'active' : ''}`}
                onClick={() => handleSelect(lang.code)}
              >
                <div className="lang-item-left">
                  <span className="lang-item-flag">{lang.flag}</span>
                  <div className="lang-item-labels">
                    <span className="lang-item-name">{lang.name}</span>
                    <span className="lang-item-native">{lang.nativeName}</span>
                  </div>
                </div>
                {lang.code === language && (
                  <Check size={15} className="lang-check-icon text-indigo-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
