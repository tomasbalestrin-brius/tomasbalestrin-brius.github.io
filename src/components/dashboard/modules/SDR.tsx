import { Phone, RefreshCw, Calendar, Users, Target, Loader2, AlertCircle, BarChart3, CheckCircle, ClipboardList } from 'lucide-react';
import type { Month } from '@/types/dashboard';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { useAquisicao } from '@/hooks/useAquisicao';
import { MONTHS } from '@/hooks/useDashboardData';

interface SDRModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

export function SDRModule({ currentMonth, onMonthSelect }: SDRModuleProps) {
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

  // Calculate SDR metrics from rawData
  const sdrMetrics = {
    totalQualificados: rawData.reduce((sum, product) =>
      sum + product.weeks.reduce((weekSum, w) => weekSum + w.qualificados, 0), 0
    ),
    totalAgendados: rawData.reduce((sum, product) =>
      sum + product.weeks.reduce((weekSum, w) => weekSum + w.agendados, 0), 0
    ),
    totalCalls: rawData.reduce((sum, product) =>
      sum + product.weeks.reduce((weekSum, w) => weekSum + w.callRealizada, 0), 0
    ),
    taxaMediaAgendamento: (() => {
      const totalQualificados = rawData.reduce((sum, product) =>
        sum + product.weeks.reduce((weekSum, w) => weekSum + w.qualificados, 0), 0
      );
      const totalAgendados = rawData.reduce((sum, product) =>
        sum + product.weeks.reduce((weekSum, w) => weekSum + w.agendados, 0), 0
      );
      return totalQualificados > 0 ? (totalAgendados / totalQualificados) * 100 : 0;
    })(),
    taxaMediaComparecimento: (() => {
      const totalAgendados = rawData.reduce((sum, product) =>
        sum + product.weeks.reduce((weekSum, w) => weekSum + w.agendados, 0), 0
      );
      const totalCalls = rawData.reduce((sum, product) =>
        sum + product.weeks.reduce((weekSum, w) => weekSum + w.callRealizada, 0), 0
      );
      return totalAgendados > 0 ? (totalCalls / totalAgendados) * 100 : 0;
    })(),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <Phone className="w-8 h-8 text-green-400" />
            SDR
          </h1>
          <p className="text-slate-400 mt-1">Metricas de qualificacao e agendamento</p>
        </div>

        <div className="flex items-center gap-4">
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
          Ultima sincronizacao: {lastSync}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center gap-3 p-8 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando dados...</span>
        </div>
      )}

      {/* Metrics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Total Qualificados</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {sdrMetrics.totalQualificados.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Total Agendados</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {sdrMetrics.totalAgendados.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">Taxa Agendamento</span>
            </div>
            <div className={`text-2xl font-bold ${sdrMetrics.taxaMediaAgendamento >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
              {sdrMetrics.taxaMediaAgendamento.toFixed(1)}%
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Total Calls</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {sdrMetrics.totalCalls.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-400 text-sm">Taxa Comparecimento</span>
            </div>
            <div className={`text-2xl font-bold ${sdrMetrics.taxaMediaComparecimento >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
              {sdrMetrics.taxaMediaComparecimento.toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* SDR Data Table */}
      {!loading && rawData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              Metricas SDR por Funil ({monthName})
            </h2>
            <span className="text-sm text-slate-400">{rawData.length} funis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Funil</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Qualificados</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Agendados</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Taxa Agend.</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Calls</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Taxa Comp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {rawData.map((product, index) => {
                  const totalQualificados = product.weeks.reduce((sum, w) => sum + w.qualificados, 0);
                  const totalAgendados = product.weeks.reduce((sum, w) => sum + w.agendados, 0);
                  const totalCalls = product.weeks.reduce((sum, w) => sum + w.callRealizada, 0);
                  const taxaAgendamento = totalQualificados > 0 ? (totalAgendados / totalQualificados) * 100 : 0;
                  const taxaComparecimento = totalAgendados > 0 ? (totalCalls / totalAgendados) * 100 : 0;

                  return (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-right text-blue-400">
                        {totalQualificados.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right text-purple-400">
                        {totalAgendados.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${taxaAgendamento >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {taxaAgendamento.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-green-400">
                        {totalCalls.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${taxaComparecimento >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                          {taxaComparecimento.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weekly Breakdown */}
      {!loading && rawData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Detalhamento Semanal
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Funil</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Semana</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Qualif.</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Agend.</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Taxa Ag.</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Calls</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Taxa Comp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {rawData.flatMap((product, productIndex) =>
                  product.weeks.map((week, weekIndex) => {
                    const taxaAgendamento = week.qualificados > 0 ? (week.agendados / week.qualificados) * 100 : 0;
                    const taxaComparecimento = week.agendados > 0 ? (week.callRealizada / week.agendados) * 100 : 0;

                    return (
                      <tr key={`${productIndex}-${weekIndex}`} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          {weekIndex === 0 ? product.name : ''}
                        </td>
                        <td className="px-4 py-3 text-slate-400">{week.periodo || `Semana ${weekIndex + 1}`}</td>
                        <td className="px-4 py-3 text-right text-blue-400">{week.qualificados}</td>
                        <td className="px-4 py-3 text-right text-purple-400">{week.agendados}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${taxaAgendamento >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {taxaAgendamento.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-green-400">{week.callRealizada}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-medium ${taxaComparecimento >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {taxaComparecimento.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && rawData.length === 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <Phone className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-2">Nenhum dado SDR disponivel</p>
          <p className="text-slate-500 text-sm">Clique em "Sincronizar" para importar dados do Google Sheets</p>
        </div>
      )}
    </div>
  );
}
