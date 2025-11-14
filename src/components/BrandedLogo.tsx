import { BRANDING_CONFIG } from '@/lib/branding-config';
import { cn } from '@/lib/utils';

interface BrandedLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  theme?: 'dark' | 'light';
}

export const BrandedLogo = ({
  variant = 'full',
  size = 'md',
  className,
  theme = 'dark'
}: BrandedLogoProps) => {
  const { company, logo, settings } = BRANDING_CONFIG;

  // Dimensões baseadas no tamanho
  const sizes = {
    sm: { width: 120, height: 30 },
    md: { width: logo.width, height: logo.height },
    lg: { width: 240, height: 60 },
  };

  const dimensions = sizes[size];

  // Escolher logo baseado no tema
  const logoPath = theme === 'dark'
    ? (logo.pathDark || logo.path)
    : (logo.pathLight || logo.path);

  // Variante: apenas ícone
  if (variant === 'icon') {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600",
          size === 'sm' && 'w-8 h-8',
          size === 'md' && 'w-10 h-10',
          size === 'lg' && 'w-12 h-12',
          className
        )}
      >
        <span className="text-white font-bold text-lg">
          {company.shortName.substring(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  // Variante: apenas texto
  if (variant === 'text') {
    return (
      <div className={cn("flex flex-col", className)}>
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-2xl',
            size === 'lg' && 'text-3xl'
          )}
        >
          {company.name}
        </span>
        {size !== 'sm' && (
          <span className="text-xs text-slate-400">
            {company.tagline}
          </span>
        )}
      </div>
    );
  }

  // Variante: logo completo (imagem + texto opcional)
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {settings.showLogo && (
        <img
          src={logoPath}
          alt={logo.alt}
          width={dimensions.width}
          height={dimensions.height}
          className="h-auto"
          onError={(e) => {
            // Fallback: se logo não carregar, mostra ícone
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) {
              fallback.classList.remove('hidden');
            }
          }}
        />
      )}

      {/* Fallback: Ícone com iniciais */}
      <div
        className={cn(
          "hidden items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600",
          size === 'sm' && 'w-8 h-8',
          size === 'md' && 'w-10 h-10',
          size === 'lg' && 'w-12 h-12'
        )}
      >
        <span className="text-white font-bold text-lg">
          {company.shortName.substring(0, 2).toUpperCase()}
        </span>
      </div>

      {settings.showCompanyName && variant === 'full' && (
        <span
          className={cn(
            "font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent",
            size === 'sm' && 'text-base',
            size === 'md' && 'text-xl',
            size === 'lg' && 'text-2xl',
            'hidden sm:block' // Esconde em telas pequenas
          )}
        >
          {company.name}
        </span>
      )}
    </div>
  );
};
