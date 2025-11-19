import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RefreshIndicatorProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  formatLastRefresh: () => string;
  formatTimeUntilRefresh: () => string;
  className?: string;
}

export const RefreshIndicator = ({
  onRefresh,
  isRefreshing,
  formatLastRefresh,
  formatTimeUntilRefresh,
  className,
}: RefreshIndicatorProps) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Last Refresh Time */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Última atualização: {formatLastRefresh()}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Próxima atualização em {formatTimeUntilRefresh()}</p>
          </TooltipContent>
        </Tooltip>

        {/* Refresh Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
              className={cn(
                "gap-2 border-slate-700 hover:bg-slate-800 hover:border-purple-500/50 transition-all",
                isRefreshing && "opacity-50 cursor-not-allowed"
              )}
            >
              <RefreshCw
                className={cn(
                  "w-4 h-4",
                  isRefreshing && "animate-spin"
                )}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Atualizando..." : "Atualizar"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isRefreshing
                ? "Buscando dados atualizados..."
                : "Atualizar dados do Google Sheets"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Mobile: Only time until next refresh */}
        <div className="sm:hidden flex items-center gap-1 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{formatTimeUntilRefresh()}</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
