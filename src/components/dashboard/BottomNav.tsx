import type { ModuleName } from '@/types/dashboard';

interface BottomNavProps {
  currentModule: ModuleName;
  onModuleChange: (module: ModuleName) => void;
}

export function BottomNav({ currentModule, onModuleChange }: BottomNavProps) {
  const modules: Array<{ id: ModuleName; icon: string; label: string }> = [
    { id: 'dashboard', icon: '🏠', label: 'Home' },
    { id: 'aquisicao', icon: '📈', label: 'Aquisição' },
    { id: 'sdr', icon: '📞', label: 'SDR' },
    { id: 'monetizacao', icon: '💰', label: 'Monetização' },
    { id: 'comparar', icon: '📅', label: 'Comparar' },
    { id: 'relatorio', icon: '📋', label: 'Relatório' },
  ];

  return (
    <div className="hidden max-md:flex fixed bottom-0 left-0 right-0 h-[60px] bg-[hsl(var(--bg-secondary))]/95 backdrop-blur-lg border-t border-[hsl(var(--border-color))] z-[1000] flex-row justify-around items-center px-1 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] max-[480px]:h-[55px]">
      {modules.map(module => (
        <button
          key={module.id}
          onClick={() => onModuleChange(module.id)}
          className={`
            flex flex-col items-center justify-center gap-0.5 py-1.5 px-1.5 bg-transparent border-none text-[hsl(var(--text-secondary))] text-[0.6rem] cursor-pointer rounded-lg transition-all duration-200 min-w-[48px] active:scale-95
            ${currentModule === module.id
              ? 'text-[hsl(var(--accent-primary))] bg-[rgba(59,130,246,0.15)]'
              : 'hover:bg-[hsl(var(--bg-tertiary))]'
            }
            max-[360px]:min-w-[42px] max-[360px]:px-1 max-[360px]:text-[0.55rem]
          `}
        >
          <span className={`text-lg transition-transform ${currentModule === module.id ? 'scale-110' : ''} max-[360px]:text-base`}>
            {module.icon}
          </span>
          <span className="truncate max-w-full">{module.label}</span>
        </button>
      ))}
    </div>
  );
}
