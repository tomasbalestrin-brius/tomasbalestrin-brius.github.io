import { useEffect, useCallback, useState } from 'react';
import { useToast } from './use-toast';

interface UseAutoRefreshOptions {
  onRefresh: () => Promise<void>;
  intervalMinutes?: number;
  enabled?: boolean;
}

export const useAutoRefresh = ({
  onRefresh,
  intervalMinutes = 5,
  enabled = true
}: UseAutoRefreshOptions) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(intervalMinutes * 60);
  const { toast } = useToast();

  // Manual refresh
  const refresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefresh(new Date());
      setTimeUntilRefresh(intervalMinutes * 60);

      toast({
        title: "✅ Dados atualizados!",
        description: "Os dados foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "❌ Erro ao atualizar",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, intervalMinutes, isRefreshing, toast]);

  // Auto refresh timer
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          refresh();
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [enabled, intervalMinutes, refresh]);

  // Format time until refresh
  const formatTimeUntilRefresh = useCallback(() => {
    const minutes = Math.floor(timeUntilRefresh / 60);
    const seconds = timeUntilRefresh % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeUntilRefresh]);

  // Format last refresh time
  const formatLastRefresh = useCallback(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastRefresh.getTime()) / 1000);

    if (diff < 60) return `há ${diff}s`;
    if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
    return lastRefresh.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [lastRefresh]);

  return {
    refresh,
    isRefreshing,
    lastRefresh,
    timeUntilRefresh,
    formatTimeUntilRefresh,
    formatLastRefresh,
  };
};
