import { Link } from 'react-router-dom';
import { logoConfig, LogoConfig } from '@/config/logo';

interface LogoProps {
  config?: LogoConfig;
  linkTo?: string;
}

const Logo = ({ config = logoConfig, linkTo = '/' }: LogoProps) => {
  const renderLogoContent = () => {
    switch (config.type) {
      case 'image':
        return (
          <img
            src={config.imageUrl}
            alt={config.imageAlt}
            style={{
              width: config.width,
              height: config.height,
            }}
            className="logo-image object-contain"
            loading="eager"
          />
        );

      case 'text-only':
        return (
          <span className={config.textClassName}>
            {config.text}
          </span>
        );

      case 'icon-text':
      default:
        const IconComponent = config.icon;
        return (
          <>
            {IconComponent && (
              <div className={config.containerClassName}>
                <IconComponent className={config.iconClassName} />
              </div>
            )}
            {config.text && (
              <span className={config.textClassName}>
                {config.text}
              </span>
            )}
          </>
        );
    }
  };

  return (
    <Link to={linkTo} className={`logo-container ${config.linkClassName}`}>
      {renderLogoContent()}
    </Link>
  );
};

export default Logo;


