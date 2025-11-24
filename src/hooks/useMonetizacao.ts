import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Closer, Funil, Venda } from '@/types/dashboard';

// LocalStorage keys
const STORAGE_KEYS = {
  closers: 'monetizacao_closers',
  funis: 'monetizacao_funis',
  vendas: 'monetizacao_vendas',
};

// Event system for syncing hooks
type EventCallback = () => void;
const eventListeners: { [key: string]: EventCallback[] } = {
  closersUpdated: [],
  funisUpdated: [],
  vendasUpdated: [],
};

function emitEvent(eventName: string) {
  eventListeners[eventName]?.forEach(callback => callback());
}

function addEventListener(eventName: string, callback: EventCallback) {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(callback);

  // Return cleanup function
  return () => {
    eventListeners[eventName] = eventListeners[eventName].filter(cb => cb !== callback);
  };
}

// Helper functions for localStorage
function getFromStorage<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Erro ao salvar no localStorage:', err);
  }
}

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Hook para Closers
export function useClosers() {
  const [closers, setClosers] = useState<Closer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useLocal, setUseLocal] = useState(false);

  const fetchClosers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try Supabase first
      const { data, error: fetchError } = await supabase
        .from('closers')
        .select('*')
        .order('valor_total_vendas', { ascending: false });

      if (fetchError) {
        // Fallback to localStorage
        console.log('Supabase closers não disponível, usando localStorage');
        setUseLocal(true);
        const localData = getFromStorage<Closer>(STORAGE_KEYS.closers);
        setClosers(localData.sort((a, b) => b.valor_total_vendas - a.valor_total_vendas));
      } else {
        setClosers((data as Closer[]) || []);
      }
    } catch (err) {
      // Fallback to localStorage on any error
      console.log('Erro no Supabase, usando localStorage para closers');
      setUseLocal(true);
      const localData = getFromStorage<Closer>(STORAGE_KEYS.closers);
      setClosers(localData.sort((a, b) => b.valor_total_vendas - a.valor_total_vendas));
    } finally {
      setLoading(false);
    }
  }, []);

  const createCloser = async (closer: Omit<Closer, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLocal) {
        // Create locally
        const newCloser: Closer = {
          ...closer,
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Closer;

        const updated = [...closers, newCloser];
        setClosers(updated.sort((a, b) => b.valor_total_vendas - a.valor_total_vendas));
        saveToStorage(STORAGE_KEYS.closers, updated);
        emitEvent('closersUpdated');
        return { success: true, data: newCloser };
      }

      const { data, error } = await supabase
        .from('closers')
        .insert([closer])
        .select()
        .single();

      if (error) throw error;
      setClosers(prev => [...prev, data as Closer]);
      return { success: true, data };
    } catch (err) {
      // If Supabase fails, switch to local and retry
      if (!useLocal) {
        setUseLocal(true);
        return createCloser(closer);
      }
      console.error('Erro ao criar closer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar closer' };
    }
  };

  const updateCloser = async (id: string, updates: Partial<Closer>) => {
    try {
      if (useLocal) {
        const updated = closers.map(c =>
          c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
        );
        setClosers(updated.sort((a, b) => b.valor_total_vendas - a.valor_total_vendas));
        saveToStorage(STORAGE_KEYS.closers, updated);
        emitEvent('closersUpdated');
        return { success: true, data: updated.find(c => c.id === id) };
      }

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
      if (!useLocal) {
        setUseLocal(true);
        return updateCloser(id, updates);
      }
      console.error('Erro ao atualizar closer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar closer' };
    }
  };

  const deleteCloser = async (id: string) => {
    try {
      if (useLocal) {
        const updated = closers.filter(c => c.id !== id);
        setClosers(updated);
        saveToStorage(STORAGE_KEYS.closers, updated);
        emitEvent('closersUpdated');
        return { success: true };
      }

      const { error } = await supabase
        .from('closers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClosers(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err) {
      if (!useLocal) {
        setUseLocal(true);
        return deleteCloser(id);
      }
      console.error('Erro ao deletar closer:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar closer' };
    }
  };

  useEffect(() => {
    fetchClosers();

    // Listen for updates from other hooks (e.g., when vendas update closer stats)
    const cleanup = addEventListener('closersUpdated', fetchClosers);
    return cleanup;
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
  const [useLocal, setUseLocal] = useState(false);

  const fetchFunis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('funis')
        .select('*')
        .order('total_vendas', { ascending: false });

      if (fetchError) {
        console.log('Supabase funis não disponível, usando localStorage');
        setUseLocal(true);
        const localData = getFromStorage<Funil>(STORAGE_KEYS.funis);
        setFunis(localData.sort((a, b) => b.total_vendas - a.total_vendas));
      } else {
        setFunis((data as Funil[]) || []);
      }
    } catch (err) {
      console.log('Erro no Supabase, usando localStorage para funis');
      setUseLocal(true);
      const localData = getFromStorage<Funil>(STORAGE_KEYS.funis);
      setFunis(localData.sort((a, b) => b.total_vendas - a.total_vendas));
    } finally {
      setLoading(false);
    }
  }, []);

  const createFunil = async (funil: Omit<Funil, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLocal) {
        const newFunil: Funil = {
          ...funil,
          id: generateId(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Funil;

        const updated = [...funis, newFunil];
        setFunis(updated.sort((a, b) => b.total_vendas - a.total_vendas));
        saveToStorage(STORAGE_KEYS.funis, updated);
        emitEvent('funisUpdated');
        return { success: true, data: newFunil };
      }

      const { data, error } = await supabase
        .from('funis')
        .insert([funil])
        .select()
        .single();

      if (error) throw error;
      setFunis(prev => [...prev, data as Funil]);
      return { success: true, data };
    } catch (err) {
      if (!useLocal) {
        setUseLocal(true);
        return createFunil(funil);
      }
      console.error('Erro ao criar funil:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar funil' };
    }
  };

  const updateFunil = async (id: string, updates: Partial<Funil>) => {
    try {
      if (useLocal) {
        const updated = funis.map(f =>
          f.id === id ? { ...f, ...updates, updated_at: new Date().toISOString() } : f
        );
        setFunis(updated.sort((a, b) => b.total_vendas - a.total_vendas));
        saveToStorage(STORAGE_KEYS.funis, updated);
        emitEvent('funisUpdated');
        return { success: true, data: updated.find(f => f.id === id) };
      }

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
      if (!useLocal) {
        setUseLocal(true);
        return updateFunil(id, updates);
      }
      console.error('Erro ao atualizar funil:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar funil' };
    }
  };

  const deleteFunil = async (id: string) => {
    try {
      if (useLocal) {
        const updated = funis.filter(f => f.id !== id);
        setFunis(updated);
        saveToStorage(STORAGE_KEYS.funis, updated);
        emitEvent('funisUpdated');
        return { success: true };
      }

      const { error } = await supabase
        .from('funis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setFunis(prev => prev.filter(f => f.id !== id));
      return { success: true };
    } catch (err) {
      if (!useLocal) {
        setUseLocal(true);
        return deleteFunil(id);
      }
      console.error('Erro ao deletar funil:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar funil' };
    }
  };

  useEffect(() => {
    fetchFunis();

    // Listen for updates from other hooks (e.g., when vendas update funil stats)
    const cleanup = addEventListener('funisUpdated', fetchFunis);
    return cleanup;
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
  const [useLocal, setUseLocal] = useState(false);

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

      if (fetchError) {
        console.log('Supabase vendas não disponível, usando localStorage');
        setUseLocal(true);
        const localData = getFromStorage<Venda>(STORAGE_KEYS.vendas);
        const closersData = getFromStorage<Closer>(STORAGE_KEYS.closers);
        const funisData = getFromStorage<Funil>(STORAGE_KEYS.funis);
        // Join with closers and funis from localStorage
        const joinedData = localData.map(v => ({
          ...v,
          closer: closersData.find(c => c.id === v.closer_id),
          funil: funisData.find(f => f.id === v.funil_id),
        }));
        setVendas(joinedData.sort((a, b) =>
          new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime()
        ));
      } else {
        setVendas((data as Venda[]) || []);
      }
    } catch (err) {
      console.log('Erro no Supabase, usando localStorage para vendas');
      setUseLocal(true);
      const localData = getFromStorage<Venda>(STORAGE_KEYS.vendas);
      const closersData = getFromStorage<Closer>(STORAGE_KEYS.closers);
      const funisData = getFromStorage<Funil>(STORAGE_KEYS.funis);
      const joinedData = localData.map(v => ({
        ...v,
        closer: closersData.find(c => c.id === v.closer_id),
        funil: funisData.find(f => f.id === v.funil_id),
      }));
      setVendas(joinedData.sort((a, b) =>
        new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime()
      ));
    } finally {
      setLoading(false);
    }
  }, []);

  const createVenda = async (venda: Omit<Venda, 'id' | 'created_at' | 'closer' | 'funil'>) => {
    try {
      if (useLocal) {
        // Get fresh data from localStorage
        const currentClosers = getFromStorage<Closer>(STORAGE_KEYS.closers);
        const currentFunis = getFromStorage<Funil>(STORAGE_KEYS.funis);

        const newVenda: Venda = {
          ...venda,
          id: generateId(),
          created_at: new Date().toISOString(),
          closer: currentClosers.find(c => c.id === venda.closer_id),
          funil: currentFunis.find(f => f.id === venda.funil_id),
        } as Venda;

        const currentVendas = getFromStorage<Venda>(STORAGE_KEYS.vendas);
        const updated = [newVenda, ...currentVendas];
        saveToStorage(STORAGE_KEYS.vendas, updated);

        // Update closer stats
        if (venda.closer_id) {
          const closerIndex = currentClosers.findIndex(c => c.id === venda.closer_id);
          if (closerIndex !== -1) {
            currentClosers[closerIndex] = {
              ...currentClosers[closerIndex],
              numero_vendas: (currentClosers[closerIndex].numero_vendas || 0) + 1,
              valor_total_vendas: (currentClosers[closerIndex].valor_total_vendas || 0) + (venda.valor_venda || 0),
              valor_total_entradas: (currentClosers[closerIndex].valor_total_entradas || 0) + (venda.valor_entrada || 0),
            };
            saveToStorage(STORAGE_KEYS.closers, currentClosers);
            // Notify other hooks that closers have been updated
            emitEvent('closersUpdated');
          }
        }

        // Update funil stats
        if (venda.funil_id) {
          const funilIndex = currentFunis.findIndex(f => f.id === venda.funil_id);
          if (funilIndex !== -1) {
            currentFunis[funilIndex] = {
              ...currentFunis[funilIndex],
              total_vendas: (currentFunis[funilIndex].total_vendas || 0) + 1,
              valor_total_gerado: (currentFunis[funilIndex].valor_total_gerado || 0) + (venda.valor_venda || 0),
            };
            saveToStorage(STORAGE_KEYS.funis, currentFunis);
            // Notify other hooks that funis have been updated
            emitEvent('funisUpdated');
          }
        }

        setVendas(prev => [newVenda, ...prev]);
        emitEvent('vendasUpdated');
        return { success: true, data: newVenda };
      }

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
      if (!useLocal) {
        setUseLocal(true);
        return createVenda(venda);
      }
      console.error('Erro ao criar venda:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao criar venda' };
    }
  };

  const updateVenda = async (id: string, updates: Partial<Venda>) => {
    try {
      if (useLocal) {
        const currentVendas = getFromStorage<Venda>(STORAGE_KEYS.vendas);
        const currentClosers = getFromStorage<Closer>(STORAGE_KEYS.closers);
        const currentFunis = getFromStorage<Funil>(STORAGE_KEYS.funis);

        const updated = currentVendas.map(v =>
          v.id === id ? {
            ...v,
            ...updates,
            closer: currentClosers.find(c => c.id === (updates.closer_id || v.closer_id)),
            funil: currentFunis.find(f => f.id === (updates.funil_id || v.funil_id)),
          } : v
        );
        saveToStorage(STORAGE_KEYS.vendas, updated);
        setVendas(updated.sort((a, b) =>
          new Date(b.data_venda).getTime() - new Date(a.data_venda).getTime()
        ));
        return { success: true, data: updated.find(v => v.id === id) };
      }

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
      if (!useLocal) {
        setUseLocal(true);
        return updateVenda(id, updates);
      }
      console.error('Erro ao atualizar venda:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar venda' };
    }
  };

  const deleteVenda = async (id: string) => {
    try {
      if (useLocal) {
        const currentVendas = getFromStorage<Venda>(STORAGE_KEYS.vendas);
        const vendaToDelete = currentVendas.find(v => v.id === id);

        if (vendaToDelete) {
          // Update closer stats (decrement)
          if (vendaToDelete.closer_id) {
            const currentClosers = getFromStorage<Closer>(STORAGE_KEYS.closers);
            const closerIndex = currentClosers.findIndex(c => c.id === vendaToDelete.closer_id);
            if (closerIndex !== -1) {
              currentClosers[closerIndex] = {
                ...currentClosers[closerIndex],
                numero_vendas: Math.max(0, (currentClosers[closerIndex].numero_vendas || 0) - 1),
                valor_total_vendas: Math.max(0, (currentClosers[closerIndex].valor_total_vendas || 0) - (vendaToDelete.valor_venda || 0)),
                valor_total_entradas: Math.max(0, (currentClosers[closerIndex].valor_total_entradas || 0) - (vendaToDelete.valor_entrada || 0)),
              };
              saveToStorage(STORAGE_KEYS.closers, currentClosers);
              emitEvent('closersUpdated');
            }
          }

          // Update funil stats (decrement)
          if (vendaToDelete.funil_id) {
            const currentFunis = getFromStorage<Funil>(STORAGE_KEYS.funis);
            const funilIndex = currentFunis.findIndex(f => f.id === vendaToDelete.funil_id);
            if (funilIndex !== -1) {
              currentFunis[funilIndex] = {
                ...currentFunis[funilIndex],
                total_vendas: Math.max(0, (currentFunis[funilIndex].total_vendas || 0) - 1),
                valor_total_gerado: Math.max(0, (currentFunis[funilIndex].valor_total_gerado || 0) - (vendaToDelete.valor_venda || 0)),
              };
              saveToStorage(STORAGE_KEYS.funis, currentFunis);
              emitEvent('funisUpdated');
            }
          }
        }

        const updated = currentVendas.filter(v => v.id !== id);
        saveToStorage(STORAGE_KEYS.vendas, updated);
        setVendas(prev => prev.filter(v => v.id !== id));
        emitEvent('vendasUpdated');
        return { success: true };
      }

      const { error } = await supabase
        .from('vendas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setVendas(prev => prev.filter(v => v.id !== id));
      return { success: true };
    } catch (err) {
      if (!useLocal) {
        setUseLocal(true);
        return deleteVenda(id);
      }
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
