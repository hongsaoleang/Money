import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const WeShopPrimaryButton = ({
  children,
  onClick,
  to,
  asLink = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  arrow = false,
  className = '',
  disabled = false,
  type = 'button',
  title,
}) => {
  const baseClasses = `weshop-btn weshop-btn-${variant} weshop-btn-${size} ${className}`;

  const content = (
    <>
      {icon && <span className="weshop-btn-icon">{icon}</span>}
      <span className="weshop-btn-label">{children}</span>
      {arrow && <ArrowRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="weshop-btn-arrow" />}
    </>
  );

  if (asLink && to) {
    return (
      <Link to={to} className={baseClasses} title={title}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      title={title}
    >
      {content}
    </button>
  );
};

export default WeShopPrimaryButton;
