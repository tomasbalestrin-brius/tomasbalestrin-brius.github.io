import { useState } from 'react';
import { TrendingUp, RefreshCw, Calendar, DollarSign, Users, Target, Loader2, AlertCircle, BarChart3 } from 'lucide-react';
import type { Month } from '@/types/dashboard';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { useAquisicao } from '@/hooks/useAquisicao';
import { MONTHS } from '@/hooks/useDashboardData';

interface AquisicaoModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

type PeriodoFilter = 'total' | 'semana1' | 'semana2' | 'semana3' | 'semana4';

const PERIODOS = [
  { id: 'total', name: 'Total do Mês' },
  { id: 'semana1', name: 'Semana 1' },
  { id: 'semana2', name: 'Semana 2' },
  { id: 'semana3', name: 'Semana 3' },
  { id: 'semana4', name: 'Semana 4' },
];

export function AquisicaoModule({ currentMonth, onMonthSelect }: AquisicaoModuleProps) {
  const [periodo, setPeriodo] = useState<PeriodoFilter>('total');

  // Get month name from currentMonth
  const monthName = MONTHS.find(m => m.id === currentMonth.id)?.name || currentMonth.name;

  const {
    rawData,
    loading,
    syncing,
    lastSync,
    error,
    syncFromSheets,
  } = useAquisicao(monthName);

  const handleSync = () => {
    syncFromSheets();
  };

  // Encontrar o produto "Geral" para os cards principais
  const geralProduct = rawData.find(p => p.name === 'Geral');

  // Calcular métricas do Geral baseado no período selecionado
  const getGeralMetrics = () => {
    if (!geralProduct) {
      return { investido: 0, faturamento: 0, roas: 0, alunos: 0 };
    }

    if (periodo === 'total') {
      // Total de todas as semanas
      const investido = geralProduct.weeks.reduce((sum, w) => sum + w.investido, 0);
      const faturamento = geralProduct.weeks.reduce((sum, w) => sum + w.faturamentoTrafego, 0);
      const alunos = geralProduct.weeks.reduce((sum, w) => sum + w.alunos, 0);
      const roas = investido > 0 ? faturamento / investido : 0;
      return { investido, faturamento, roas, alunos };
    }

    // Semana específica (semana1, semana2, etc)
    const weekIndex = parseInt(periodo.replace('semana', '')) - 1;
    const week = geralProduct.weeks[weekIndex];

    if (!week) {
      return { investido: 0, faturamento: 0, roas: 0, alunos: 0 };
    }

    const roas = week.investido > 0 ? week.faturamentoTrafego / week.investido : 0;
    return {
      investido: week.investido,
      faturamento: week.faturamentoTrafego,
      roas,
      alunos: week.alunos,
    };
  };

  const geralMetrics = getGeralMetrics();

  // Calcular dados da tabela baseado no período selecionado
  const getProductData = (product: typeof rawData[0]) => {
    if (periodo === 'total') {
      const investido = product.weeks.reduce((sum, w) => sum + w.investido, 0);
      const faturamento = product.weeks.reduce((sum, w) => sum + w.faturamentoTrafego, 0);
      const alunos = product.weeks.reduce((sum, w) => sum + w.alunos, 0);
      const roas = investido > 0 ? faturamento / investido : 0;
      return { investido, faturamento, roas, alunos, semanas: product.weeks.length };
    }

    const weekIndex = parseInt(periodo.replace('semana', '')) - 1;
    const week = product.weeks[weekIndex];

    if (!week) {
      return { investido: 0, faturamento: 0, roas: 0, alunos: 0, semanas: 0 };
    }

    const roas = week.investido > 0 ? week.faturamentoTrafego / week.investido : 0;
    return {
      investido: week.investido,
      faturamento: week.faturamentoTrafego,
      roas,
      alunos: week.alunos,
      semanas: 1,
    };
  };

  const periodoLabel = PERIODOS.find(p => p.id === periodo)?.name || 'Total';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            Aquisição
          </h1>
          <p className="text-slate-400 mt-1">Dados sincronizados do Google Sheets</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <MonthSelector currentMonth={currentMonth} onMonthSelect={onMonthSelect} />

          <button
            onClick={handleSync}
            disabled={syncing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Last Sync Info */}
      {lastSync && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          Última sincronização: {lastSync}
        </div>
      )}

      {/* Period Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-400 text-sm font-medium">Período:</span>
        <div className="flex gap-2 flex-wrap">
          {PERIODOS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodo(p.id as PeriodoFilter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                periodo === p.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center gap-3 p-8 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando dados...</span>
        </div>
      )}

      {/* Metrics Cards - Dados do GERAL */}
      {!loading && (
        <>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>📊 Exibindo dados do funil <strong className="text-blue-400">Geral</strong> - {periodoLabel}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-red-400" />
                <span className="text-slate-400 text-sm">Total Investido</span>
              </div>
              <div className="text-2xl font-bold text-white">
                R$ {geralMetrics.investido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Faturamento Tráfego</span>
              </div>
              <div className="text-2xl font-bold text-white">
                R$ {geralMetrics.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">ROAS Médio</span>
              </div>
              <div className={`text-2xl font-bold ${geralMetrics.roas >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                {geralMetrics.roas.toFixed(2)}x
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">Total Alunos</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {geralMetrics.alunos.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Raw Data Preview (from Google Sheets) */}
      {rawData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Dados por Funil ({monthName} - {periodoLabel})
            </h2>
            <span className="text-sm text-slate-400">{rawData.length} funis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Funil</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Investido</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Faturamento</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">ROAS</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Alunos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {rawData.map((product, index) => {
                  const data = getProductData(product);

                  // Pular se não tem dados para o período selecionado
                  if (periodo !== 'total' && data.semanas === 0) return null;

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-slate-700/30 transition-colors ${
                        product.name === 'Geral' ? 'bg-blue-900/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {product.name}
                        {product.name === 'Geral' && (
                          <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Principal</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-red-400">
                        R$ {data.investido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-green-400">
                        R$ {data.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${data.roas >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {data.roas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-blue-400">
                        {data.alunos.toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
