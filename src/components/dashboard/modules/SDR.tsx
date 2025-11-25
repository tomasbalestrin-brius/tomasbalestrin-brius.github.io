import { useState } from 'react';
import { Phone, RefreshCw, Calendar, Users, Target, Loader2, AlertCircle, BarChart3, CheckCircle, ClipboardList, ArrowUp, ArrowDown } from 'lucide-react';
import type { Month } from '@/types/dashboard';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { useAquisicao } from '@/hooks/useAquisicao';
import { MONTHS } from '@/hooks/useDashboardData';

interface SDRModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

type PeriodoFilter = 'total' | 'semana1' | 'semana2' | 'semana3' | 'semana4';
type SortColumn = 'qualificados' | 'agendados' | 'taxaAgendamento' | 'calls' | 'taxaComparecimento' | null;
type SortDirection = 'asc' | 'desc';

const PERIODOS = [
  { id: 'total', name: 'Total do Mês' },
  { id: 'semana1', name: 'Semana 1' },
  { id: 'semana2', name: 'Semana 2' },
  { id: 'semana3', name: 'Semana 3' },
  { id: 'semana4', name: 'Semana 4' },
];

export function SDRModule({ currentMonth, onMonthSelect }: SDRModuleProps) {
  const [periodo, setPeriodo] = useState<PeriodoFilter>('total');
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
      return { qualificados: 0, agendados: 0, calls: 0, taxaAgendamento: 0, taxaComparecimento: 0 };
    }

    if (periodo === 'total') {
      const qualificados = geralProduct.weeks.reduce((sum, w) => sum + w.qualificados, 0);
      const agendados = geralProduct.weeks.reduce((sum, w) => sum + w.agendados, 0);
      const calls = geralProduct.weeks.reduce((sum, w) => sum + w.callRealizada, 0);
      const taxaAgendamento = qualificados > 0 ? (agendados / qualificados) * 100 : 0;
      const taxaComparecimento = agendados > 0 ? (calls / agendados) * 100 : 0;
      return { qualificados, agendados, calls, taxaAgendamento, taxaComparecimento };
    }

    const weekIndex = parseInt(periodo.replace('semana', '')) - 1;
    const week = geralProduct.weeks[weekIndex];

    if (!week) {
      return { qualificados: 0, agendados: 0, calls: 0, taxaAgendamento: 0, taxaComparecimento: 0 };
    }

    const taxaAgendamento = week.qualificados > 0 ? (week.agendados / week.qualificados) * 100 : 0;
    const taxaComparecimento = week.agendados > 0 ? (week.callRealizada / week.agendados) * 100 : 0;

    return {
      qualificados: week.qualificados,
      agendados: week.agendados,
      calls: week.callRealizada,
      taxaAgendamento,
      taxaComparecimento,
    };
  };

  const geralMetrics = getGeralMetrics();

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to descending
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Calcular dados da tabela baseado no período selecionado
  const getProductData = (product: typeof rawData[0]) => {
    if (periodo === 'total') {
      const qualificados = product.weeks.reduce((sum, w) => sum + w.qualificados, 0);
      const agendados = product.weeks.reduce((sum, w) => sum + w.agendados, 0);
      const calls = product.weeks.reduce((sum, w) => sum + w.callRealizada, 0);
      const taxaAgendamento = qualificados > 0 ? (agendados / qualificados) * 100 : 0;
      const taxaComparecimento = agendados > 0 ? (calls / agendados) * 100 : 0;
      return { qualificados, agendados, calls, taxaAgendamento, taxaComparecimento, hasData: true };
    }

    const weekIndex = parseInt(periodo.replace('semana', '')) - 1;
    const week = product.weeks[weekIndex];

    if (!week) {
      return { qualificados: 0, agendados: 0, calls: 0, taxaAgendamento: 0, taxaComparecimento: 0, hasData: false };
    }

    const taxaAgendamento = week.qualificados > 0 ? (week.agendados / week.qualificados) * 100 : 0;
    const taxaComparecimento = week.agendados > 0 ? (week.callRealizada / week.agendados) * 100 : 0;

    return {
      qualificados: week.qualificados,
      agendados: week.agendados,
      calls: week.callRealizada,
      taxaAgendamento,
      taxaComparecimento,
      hasData: true,
    };
  };

  // Prepare and sort table data
  const tableData = rawData
    .map((product) => ({
      product,
      data: getProductData(product),
    }))
    .filter(({ data, product }) => {
      // Filter out rows without data when not showing total
      if (periodo !== 'total' && !data.hasData) return false;
      return true;
    })
    .sort((a, b) => {
      // Keep "Geral" at the top always
      if (a.product.name === 'Geral') return -1;
      if (b.product.name === 'Geral') return 1;

      // If no sort column selected, keep original order
      if (!sortColumn) return 0;

      const aVal = a.data[sortColumn];
      const bVal = b.data[sortColumn];

      if (sortDirection === 'desc') {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });

  const periodoLabel = PERIODOS.find(p => p.id === periodo)?.name || 'Total';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Phone className="w-8 h-8 text-green-400" />
            SDR
          </h1>
          <p className="text-slate-400 mt-1">Métricas de qualificação e agendamento</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <MonthSelector currentMonth={currentMonth} onMonthSelect={onMonthSelect} />

          <button
            onClick={handleSync}
            disabled={syncing || loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
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
                  ? 'bg-green-600 text-white'
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
            <span>📊 Exibindo dados do funil <strong className="text-green-400">Geral</strong> - {periodoLabel}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">Qualificados</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {geralMetrics.qualificados.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Agendados</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {geralMetrics.agendados.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-400 text-sm">Taxa Agendamento</span>
              </div>
              <div className={`text-2xl font-bold ${geralMetrics.taxaAgendamento >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                {geralMetrics.taxaAgendamento.toFixed(1)}%
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Calls</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {geralMetrics.calls.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-slate-400 text-sm">Taxa Comparecimento</span>
              </div>
              <div className={`text-2xl font-bold ${geralMetrics.taxaComparecimento >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                {geralMetrics.taxaComparecimento.toFixed(1)}%
              </div>
            </div>
          </div>
        </>
      )}

      {/* SDR Data Table */}
      {!loading && rawData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Métricas SDR por Funil ({monthName} - {periodoLabel})
            </h2>
            <span className="text-sm text-slate-400">{rawData.length} funis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Funil</th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('qualificados')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Qualificados
                      {sortColumn === 'qualificados' && (
                        sortDirection === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('agendados')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Agendados
                      {sortColumn === 'agendados' && (
                        sortDirection === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('taxaAgendamento')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Taxa Agend.
                      {sortColumn === 'taxaAgendamento' && (
                        sortDirection === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('calls')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Calls
                      {sortColumn === 'calls' && (
                        sortDirection === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-sm font-medium text-slate-400 cursor-pointer hover:text-white transition-colors select-none"
                    onClick={() => handleSort('taxaComparecimento')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Taxa Comp.
                      {sortColumn === 'taxaComparecimento' && (
                        sortDirection === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {tableData.map(({ product, data }, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-slate-700/30 transition-colors ${
                      product.name === 'Geral' ? 'bg-green-900/20' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {product.name}
                      {product.name === 'Geral' && (
                        <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded">Principal</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-400">
                      {data.qualificados.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right text-purple-400">
                      {data.agendados.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${data.taxaAgendamento >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {data.taxaAgendamento.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-green-400">
                      {data.calls.toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${data.taxaComparecimento >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {data.taxaComparecimento.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && rawData.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Phone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">Nenhum dado SDR disponível</p>
          <p className="text-slate-500 text-sm">Clique em "Sincronizar" para importar dados do Google Sheets</p>
        </div>
      )}
    </div>
  );
}
