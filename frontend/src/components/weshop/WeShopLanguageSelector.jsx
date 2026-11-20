import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'EN', name: 'English (US)', flag: '🇺🇸' },
  { code: 'KH', name: 'ភាសាខ្មែរ (Khmer)', flag: '🇰🇭' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
  { code: 'ZH', name: '中文 (Simplified)', flag: '🇨🇳' },
];

const WeShopLanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
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

  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="weshop-lang-selector-container" ref={dropdownRef}>
      <button
        type="button"
        className={`weshop-lang-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe size={15} className="weshop-lang-globe" />
        <span className="weshop-lang-code">{current.code}</span>
        <ChevronDown size={13} className={`weshop-lang-chevron ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="weshop-lang-dropdown">
          <div className="weshop-lang-dropdown-header">
            {language === 'KH' ? 'ជ្រើសរើសភាសា' : 'Select Language'}
          </div>
          <ul className="weshop-lang-list">
            {LANGUAGES.map((lang) => (
              <li
                key={lang.code}
                className={`weshop-lang-item ${lang.code === language ? 'selected' : ''}`}
                onClick={() => handleSelect(lang.code)}
              >
                <span className="weshop-lang-flag">{lang.flag}</span>
                <span className="weshop-lang-item-name">{lang.name}</span>
                {lang.code === language && (
                  <Check size={14} className="weshop-lang-check text-indigo-600 dark:text-cyan-400" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeShopLanguageSelector;
