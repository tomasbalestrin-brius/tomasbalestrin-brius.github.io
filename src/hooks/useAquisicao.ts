import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fetchSheetData, ProductData } from '@/lib/sheets-api';
import type { FunilAquisicao, SyncLog } from '@/types/dashboard';

export function useAquisicao(month: string) {
  const [funis, setFunis] = useState<FunilAquisicao[]>([]);
  const [rawData, setRawData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch from Supabase
  const fetchFromSupabase = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('funis_aquisicao')
        .select('*')
        .order('created_at', { ascending: false });

      // Handle table not found gracefully
      if (fetchError) {
        if (fetchError.code === '42P01' || fetchError.message?.includes('not found') || fetchError.code === 'PGRST116') {
          console.warn('Tabela funis_aquisicao ainda nao existe. Use o Supabase para criar.');
          setFunis([]);
          return;
        }
        throw fetchError;
      }
      setFunis((data as FunilAquisicao[]) || []);

      // Get last sync log (also handle if table doesn't exist)
      try {
        const { data: syncLogs } = await supabase
          .from('sync_logs')
          .select('*')
          .eq('tipo', 'aquisicao')
          .order('created_at', { ascending: false })
          .limit(1);

        if (syncLogs && syncLogs.length > 0) {
          setLastSync(new Date(syncLogs[0].created_at).toLocaleString('pt-BR'));
        }
      } catch (syncError) {
        console.warn('Tabela sync_logs ainda nao existe');
      }
    } catch (err) {
      console.error('Erro ao buscar dados de aquisicao:', err);
      // Don't show error for missing tables
      if (err instanceof Error && !err.message?.includes('not found')) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync from Google Sheets
  const syncFromSheets = useCallback(async () => {
    try {
      setSyncing(true);
      setError(null);

      console.log('Sincronizando dados do Google Sheets para mes:', month);

      // Fetch data from Google Sheets
      const sheetData = await fetchSheetData(month);
      setRawData(sheetData);

      console.log('Dados recebidos:', sheetData.length, 'produtos');

      // Transform to FunilAquisicao format
      const transformedData: Omit<FunilAquisicao, 'id' | 'created_at' | 'updated_at'>[] = sheetData.map(product => {
        // Calculate totals from weeks
        const totalInvestido = product.weeks.reduce((sum, w) => sum + w.investido, 0);
        const totalFaturamento = product.weeks.reduce((sum, w) => sum + w.faturamentoTrafego, 0);
        const totalAlunos = product.weeks.reduce((sum, w) => sum + w.alunos, 0);
        const roasMedio = totalInvestido > 0 ? totalFaturamento / totalInvestido : 0;

        return {
          nome_funil: product.name,
          investido: totalInvestido,
          faturamento_trafego: totalFaturamento,
          roas_trafego: roasMedio,
          numero_alunos: totalAlunos,
          periodo: month,
          sheet_id: product.name,
        };
      });

      // Try to upsert to Supabase (will fail gracefully if tables don't exist)
      let savedToDb = false;
      try {
        for (const funil of transformedData) {
          const { error: upsertError } = await supabase
            .from('funis_aquisicao')
            .upsert(
              { ...funil },
              { onConflict: 'nome_funil,periodo' }
            );

          if (upsertError) {
            // If table doesn't exist, skip saving to DB
            if (upsertError.code === '42P01' || upsertError.message?.includes('not found')) {
              console.warn('Tabela funis_aquisicao nao existe. Mostrando apenas dados da planilha.');
              break;
            }
            console.error('Erro ao salvar funil:', funil.nome_funil, upsertError);
          } else {
            savedToDb = true;
          }
        }

        // Log sync only if we could save to DB
        if (savedToDb) {
          await supabase.from('sync_logs').insert({
            tipo: 'aquisicao',
            status: 'success',
            mensagem: `Sincronizado ${transformedData.length} funis de ${month}`,
            registros_sincronizados: transformedData.length,
          });

          // Refresh data from Supabase
          await fetchFromSupabase();
        }
      } catch (dbErr) {
        console.warn('Nao foi possivel salvar no Supabase:', dbErr);
      }

      setLastSync(new Date().toLocaleString('pt-BR'));
      console.log('Sincronizacao concluida com sucesso!');

    } catch (err) {
      console.error('Erro ao sincronizar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao sincronizar');

      // Try to log sync error (may fail if table doesn't exist)
      try {
        await supabase.from('sync_logs').insert({
          tipo: 'aquisicao',
          status: 'error',
          mensagem: err instanceof Error ? err.message : 'Erro desconhecido',
          registros_sincronizados: 0,
        });
      } catch (logErr) {
        console.warn('Nao foi possivel logar erro no Supabase');
      }
    } finally {
      setSyncing(false);
    }
  }, [month, fetchFromSupabase]);

  // Calculate metrics
  const metrics = {
    totalInvestido: funis.reduce((sum, f) => sum + (f.investido || 0), 0),
    totalFaturamento: funis.reduce((sum, f) => sum + (f.faturamento_trafego || 0), 0),
    roasMedio: funis.length > 0
      ? funis.reduce((sum, f) => sum + (f.roas_trafego || 0), 0) / funis.length
      : 0,
    totalAlunos: funis.reduce((sum, f) => sum + (f.numero_alunos || 0), 0),
    totalFunis: funis.length,
  };

  // Initial fetch
  useEffect(() => {
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  return {
    funis,
    rawData,
    metrics,
    loading,
    syncing,
    lastSync,
    error,
    syncFromSheets,
    refetch: fetchFromSupabase,
  };
}
