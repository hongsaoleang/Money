import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const JomnenhKhPrimaryButton = ({
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
  const baseClasses = `jomnenhkh-btn weshop-btn jomnenhkh-btn weshop-btn-${variant} jomnenhkh-btn weshop-btn-${size} ${className}`;

  const content = (
    <>
      {icon && <span className="jomnenhkh-btn-icon weshop-btn-icon">{icon}</span>}
      <span className="jomnenhkh-btn-label weshop-btn-label">{children}</span>
      {arrow && <ArrowRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} className="jomnenhkh-btn-arrow weshop-btn-arrow" />}
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

export default JomnenhKhPrimaryButton;
