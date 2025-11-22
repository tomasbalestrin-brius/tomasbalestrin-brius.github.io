import { TrendingUp, RefreshCw, Calendar, DollarSign, Users, Target, Loader2, AlertCircle, BarChart3 } from 'lucide-react';
import type { Month } from '@/types/dashboard';
import { MonthSelector } from '@/components/dashboard/MonthSelector';
import { useAquisicao } from '@/hooks/useAquisicao';
import { MONTHS } from '@/hooks/useDashboardData';

interface AquisicaoModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

export function AquisicaoModule({ currentMonth, onMonthSelect }: AquisicaoModuleProps) {
  // Get month name from currentMonth
  const monthName = MONTHS.find(m => m.id === currentMonth.id)?.name || currentMonth.name;

  const {
    funis,
    rawData,
    metrics,
    loading,
    syncing,
    lastSync,
    error,
    syncFromSheets,
  } = useAquisicao(monthName);

  const handleSync = () => {
    syncFromSheets();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            Aquisicao
          </h1>
          <p className="text-slate-400 mt-1">Dados sincronizados do Google Sheets</p>
        </div>

        <div className="flex items-center gap-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-red-400" />
              <span className="text-slate-400 text-sm">Total Investido</span>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {metrics.totalInvestido.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Faturamento Trafego</span>
            </div>
            <div className="text-2xl font-bold text-white">
              R$ {metrics.totalFaturamento.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">ROAS Medio</span>
            </div>
            <div className={`text-2xl font-bold ${metrics.roasMedio >= 1 ? 'text-green-400' : 'text-red-400'}`}>
              {metrics.roasMedio.toFixed(2)}x
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Total Alunos</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {metrics.totalAlunos.toLocaleString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {/* Raw Data Preview (from Google Sheets) */}
      {rawData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Dados do Google Sheets ({monthName})
            </h2>
            <span className="text-sm text-slate-400">{rawData.length} funis</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Funil</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Semanas</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Investido</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Faturamento</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">ROAS</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Alunos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {rawData.map((product, index) => {
                  const totalInvestido = product.weeks.reduce((sum, w) => sum + w.investido, 0);
                  const totalFaturamento = product.weeks.reduce((sum, w) => sum + w.faturamentoTrafego, 0);
                  const totalAlunos = product.weeks.reduce((sum, w) => sum + w.alunos, 0);
                  const roas = totalInvestido > 0 ? totalFaturamento / totalInvestido : 0;

                  return (
                    <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-right text-slate-400">{product.weeks.length}</td>
                      <td className="px-4 py-3 text-right text-red-400">
                        R$ {totalInvestido.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right text-green-400">
                        R$ {totalFaturamento.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${roas >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {roas.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-blue-400">{totalAlunos}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Funis Table (from Supabase) */}
      {!loading && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Funis de Aquisicao (Salvos)</h2>
            <span className="text-sm text-slate-400">{funis.length} registros</span>
          </div>

          {funis.length === 0 ? (
            <div className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Nenhum dado de aquisicao salvo</p>
              <p className="text-slate-500 text-sm">Clique em "Sincronizar" para importar dados do Google Sheets</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Funil</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Investido</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Faturamento</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">ROAS</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Alunos</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Periodo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {funis.map((funil) => (
                    <tr key={funil.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{funil.nome_funil}</td>
                      <td className="px-4 py-3 text-right text-red-400">
                        R$ {funil.investido.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right text-green-400">
                        R$ {funil.faturamento_trafego.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${funil.roas_trafego >= 1 ? 'text-green-400' : 'text-red-400'}`}>
                          {funil.roas_trafego.toFixed(2)}x
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-blue-400">{funil.numero_alunos}</td>
                      <td className="px-4 py-3 text-slate-400">{funil.periodo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
