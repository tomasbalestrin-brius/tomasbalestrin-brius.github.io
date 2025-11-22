import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Closer, Funil, Venda } from '@/types/dashboard';

// Hook para Closers
export function useClosers() {
  const [closers, setClosers] = useState<Closer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClosers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('closers')
        .select('*')
        .order('valor_total_vendas', { ascending: false });

      if (fetchError) throw fetchError;
      setClosers((data as Closer[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar closers');
      console.error('Erro ao buscar closers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCloser = async (closer: Omit<Closer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('closers')
        .insert([closer])
        .select()
        .single();

      if (error) throw error;
      setClosers(prev => [...prev, data as Closer]);
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao criar closer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar closer' };
    }
  };

  const updateCloser = async (id: string, updates: Partial<Closer>) => {
    try {
      const { data, error } = await supabase
        .from('closers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClosers(prev => prev.map(c => c.id === id ? (data as Closer) : c));
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao atualizar closer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar closer' };
    }
  };

  const deleteCloser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('closers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClosers(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar closer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar closer' };
    }
  };

  useEffect(() => {
    fetchClosers();
  }, [fetchClosers]);

  return {
    closers,
    loading,
    error,
    refetch: fetchClosers,
    createCloser,
    updateCloser,
    deleteCloser,
  };
}

// Hook para Funis
export function useFunis() {
  const [funis, setFunis] = useState<Funil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFunis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('funis')
        .select('*')
        .order('total_vendas', { ascending: false });

      if (fetchError) throw fetchError;
      setFunis((data as Funil[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar funis');
      console.error('Erro ao buscar funis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFunil = async (funil: Omit<Funil, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('funis')
        .insert([funil])
        .select()
        .single();

      if (error) throw error;
      setFunis(prev => [...prev, data as Funil]);
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao criar funil:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar funil' };
    }
  };

  const updateFunil = async (id: string, updates: Partial<Funil>) => {
    try {
      const { data, error } = await supabase
        .from('funis')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setFunis(prev => prev.map(f => f.id === id ? (data as Funil) : f));
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao atualizar funil:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar funil' };
    }
  };

  const deleteFunil = async (id: string) => {
    try {
      const { error } = await supabase
        .from('funis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFunis(prev => prev.filter(f => f.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar funil:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar funil' };
    }
  };

  useEffect(() => {
    fetchFunis();
  }, [fetchFunis]);

  return {
    funis,
    loading,
    error,
    refetch: fetchFunis,
    createFunil,
    updateFunil,
    deleteFunil,
  };
}

// Hook para Vendas
export function useVendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vendas')
        .select(`
          *,
          closer:closers(*),
          funil:funis(*)
        `)
        .order('data_venda', { ascending: false });

      if (fetchError) throw fetchError;
      setVendas((data as Venda[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
      console.error('Erro ao buscar vendas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVenda = async (venda: Omit<Venda, 'id' | 'created_at' | 'closer' | 'funil'>) => {
    try {
      const { data, error } = await supabase
        .from('vendas')
        .insert([venda])
        .select(`
          *,
          closer:closers(*),
          funil:funis(*)
        `)
        .single();

      if (error) throw error;
      setVendas(prev => [data as Venda, ...prev]);
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao criar venda:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar venda' };
    }
  };

  const updateVenda = async (id: string, updates: Partial<Venda>) => {
    try {
      const { data, error } = await supabase
        .from('vendas')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          closer:closers(*),
          funil:funis(*)
        `)
        .single();

      if (error) throw error;
      setVendas(prev => prev.map(v => v.id === id ? (data as Venda) : v));
      return { success: true, data };
    } catch (err) {
      console.error('Erro ao atualizar venda:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar venda' };
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVendas(prev => prev.filter(v => v.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar venda:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar venda' };
    }
  };

  useEffect(() => {
    fetchVendas();
  }, [fetchVendas]);

  return {
    vendas,
    loading,
    error,
    refetch: fetchVendas,
    createVenda,
    updateVenda,
    deleteVenda,
  };
}

// Hook combinado para métricas de monetização
export function useMonetizacaoMetrics() {
  const { closers, loading: loadingClosers } = useClosers();
  const { funis, loading: loadingFunis } = useFunis();
  const { vendas, loading: loadingVendas } = useVendas();

  const loading = loadingClosers || loadingFunis || loadingVendas;

  const metrics = {
    totalVendas: vendas.length,
    valorTotalVendas: vendas.reduce((acc, v) => acc + (v.valor_venda || 0), 0),
    valorTotalEntradas: vendas.reduce((acc, v) => acc + (v.valor_entrada || 0), 0),
    ticketMedio: vendas.length > 0
      ? vendas.reduce((acc, v) => acc + (v.valor_venda || 0), 0) / vendas.length
      : 0,
    totalClosers: closers.filter(c => c.ativo).length,
    totalFunis: funis.filter(f => f.ativo).length,
  };

  const top3Closers = closers
    .filter(c => c.ativo)
    .sort((a, b) => b.valor_total_vendas - a.valor_total_vendas)
    .slice(0, 3);

  const top3Funis = funis
    .filter(f => f.ativo)
    .sort((a, b) => b.valor_total_gerado - a.valor_total_gerado)
    .slice(0, 3);

  return {
    metrics,
    top3Closers,
    top3Funis,
    loading,
  };
}
