import { useState, useEffect } from 'react';
import { TrendingUp, RefreshCw, Calendar, DollarSign, Users, Target } from 'lucide-react';
import type { Month, FunilAquisicao } from '@/types/dashboard';
import { MonthSelector } from '@/components/dashboard/MonthSelector';

interface AquisicaoModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

export function AquisicaoModule({ currentMonth, onMonthSelect }: AquisicaoModuleProps) {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [funis, setFunis] = useState<FunilAquisicao[]>([]);

  // Placeholder data
  const placeholderMetrics = {
    totalInvestido: 0,
    totalFaturamento: 0,
    roasMedio: 0,
    totalAlunos: 0,
  };

  const handleSync = async () => {
    setLoading(true);
    // TODO: Implementar sync com Google Sheets
    setTimeout(() => {
      setLoading(false);
      setLastSync(new Date().toLocaleString('pt-BR'));
    }, 2000);
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
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Sincronizando...' : 'Sincronizar'}
          </button>
        </div>
      </div>

      {/* Last Sync Info */}
      {lastSync && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-4 h-4" />
          Ultima sincronizacao: {lastSync}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-red-400" />
            <span className="text-slate-400 text-sm">Total Investido</span>
          </div>
          <div className="text-2xl font-bold text-white">
            R$ {placeholderMetrics.totalInvestido.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="text-slate-400 text-sm">Faturamento Trafego</span>
          </div>
          <div className="text-2xl font-bold text-white">
            R$ {placeholderMetrics.totalFaturamento.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-slate-400 text-sm">ROAS Medio</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {placeholderMetrics.roasMedio.toFixed(2)}x
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-slate-400 text-sm">Total Alunos</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {placeholderMetrics.totalAlunos.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Funis Table */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Funis de Aquisicao</h2>
        </div>

        {funis.length === 0 ? (
          <div className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-2">Nenhum dado de aquisicao ainda</p>
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
    </div>
  );
}
