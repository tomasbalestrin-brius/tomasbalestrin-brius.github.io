import { useState, useEffect } from 'react';
import { MONTHS, ALL_PRODUCTS } from '@/hooks/useDashboardData';
import { fetchSheetData } from '@/lib/sheets-api';
import type { AllData, Month } from '@/types/dashboard';
import { calculateTotals } from '@/utils/dataParser';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown, Calendar, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompararMesesModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

interface MonthlyMetrics {
  month: string;
  monthId: string;
  faturamento: number;
  investido: number;
  lucro: number;
  roi: number;
  roas: number;
  vendas: number;
  alunos: number;
  taxaConversao: number;
}

export function CompararMesesModule({ currentMonth, onMonthSelect }: CompararMesesModuleProps) {
  const [mes1, setMes1] = useState(MONTHS[0].id);
  const [mes2, setMes2] = useState(MONTHS[MONTHS.length - 1].id);
  const [produto, setProduto] = useState('Geral');
  const [dataMes1, setDataMes1] = useState<AllData | null>(null);
  const [dataMes2, setDataMes2] = useState<AllData | null>(null);
  const [loading, setLoading] = useState(false);
  const [allMonthsData, setAllMonthsData] = useState<MonthlyMetrics[]>([]);
  const [viewMode, setViewMode] = useState<'comparison' | 'evolution'>('comparison');

  // Carregar dados dos meses selecionados
  const loadMonthData = async (monthId: string): Promise<AllData> => {
    const month = MONTHS.find(m => m.id === monthId);
    if (!month) return {};

    const cacheKey = `dashboard_cache_${monthId}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { data: cachedData, timestamp } = JSON.parse(cached);
        const cacheAge = Date.now() - timestamp;
        const CACHE_DURATION = 5 * 60 * 1000;

        if (cacheAge < CACHE_DURATION) {
          const newData: AllData = {};
          cachedData.forEach((product: any) => {
            newData[product.name] = {
              semanas: product.weeks,
              tendencia: product.tendencia
            };
          });
          return newData;
        }
      } catch (e) {
        // Cache inválido
      }
    }

    const productsData = await fetchSheetData(month.name);

    localStorage.setItem(cacheKey, JSON.stringify({
      data: productsData,
      timestamp: Date.now()
    }));

    const newData: AllData = {};
    productsData.forEach(product => {
      newData[product.name] = {
        semanas: product.weeks,
        tendencia: product.tendencia
      };
    });

    return newData;
  };

  // Carregar dados quando os meses mudam
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [data1, data2] = await Promise.all([
          loadMonthData(mes1),
          loadMonthData(mes2)
        ]);
        setDataMes1(data1);
        setDataMes2(data2);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
      setLoading(false);
    };

    loadData();
  }, [mes1, mes2]);

  // Carregar dados de todos os meses para evolução
  useEffect(() => {
    const loadAllMonths = async () => {
      const metricsPromises = MONTHS.map(async (month) => {
        try {
          const data = await loadMonthData(month.id);
          const productData = data[produto];

          if (!productData) {
            return {
              month: month.name,
              monthId: month.id,
              faturamento: 0,
              investido: 0,
              lucro: 0,
              roi: 0,
              roas: 0,
              vendas: 0,
              alunos: 0,
              taxaConversao: 0,
            };
          }

          const totals = calculateTotals(productData.semanas);

          return {
            month: month.name,
            monthId: month.id,
            faturamento: totals.faturado,
            investido: totals.investido,
            lucro: totals.lucroFunil,
            roi: totals.investido > 0 ? ((totals.lucroFunil / totals.investido) * 100) : 0,
            roas: totals.investido > 0 ? (totals.faturado / totals.investido) : 0,
            vendas: totals.vendas,
            alunos: totals.alunos,
            taxaConversao: totals.taxaConversao,
          };
        } catch {
          return {
            month: month.name,
            monthId: month.id,
            faturamento: 0,
            investido: 0,
            lucro: 0,
            roi: 0,
            roas: 0,
            vendas: 0,
            alunos: 0,
            taxaConversao: 0,
          };
        }
      });

      const results = await Promise.all(metricsPromises);
      setAllMonthsData(results);
    };

    loadAllMonths();
  }, [produto]);

  // Calcular métricas dos meses selecionados
  const getMonthMetrics = (data: AllData | null, monthId: string): MonthlyMetrics | null => {
    if (!data || !data[produto]) return null;

    const month = MONTHS.find(m => m.id === monthId);
    const productData = data[produto];
    const totals = calculateTotals(productData.semanas);

    return {
      month: month?.name || monthId,
      monthId,
      faturamento: totals.faturado,
      investido: totals.investido,
      lucro: totals.lucroFunil,
      roi: totals.investido > 0 ? ((totals.lucroFunil / totals.investido) * 100) : 0,
      roas: totals.investido > 0 ? (totals.faturado / totals.investido) : 0,
      vendas: totals.vendas,
      alunos: totals.alunos,
      taxaConversao: totals.taxaConversao,
    };
  };

  const metrics1 = getMonthMetrics(dataMes1, mes1);
  const metrics2 = getMonthMetrics(dataMes2, mes2);

  // Calcular variação percentual
  const getVariation = (val1: number, val2: number) => {
    if (val1 === 0) return val2 > 0 ? 100 : 0;
    return ((val2 - val1) / val1) * 100;
  };

  // Determinar vencedor
  const winner = metrics1 && metrics2 ? (metrics2.faturamento > metrics1.faturamento ? 2 : 1) : null;

  // Efeito de confetti quando tiver vencedor
  useEffect(() => {
    if (winner && !loading) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#a855f7', '#ec4899']
      });
    }
  }, [winner, loading, mes1, mes2, produto]);

  const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const formatPercent = (value: number) =>
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  // Dados para o gráfico de radar
  const radarData = metrics1 && metrics2 ? [
    { subject: 'Faturamento', A: metrics1.faturamento / 1000, B: metrics2.faturamento / 1000, fullMark: Math.max(metrics1.faturamento, metrics2.faturamento) / 1000 },
    { subject: 'Vendas', A: metrics1.vendas, B: metrics2.vendas, fullMark: Math.max(metrics1.vendas, metrics2.vendas) },
    { subject: 'ROI', A: metrics1.roi, B: metrics2.roi, fullMark: Math.max(metrics1.roi, metrics2.roi) },
    { subject: 'ROAS', A: metrics1.roas, B: metrics2.roas, fullMark: Math.max(metrics1.roas, metrics2.roas) },
    { subject: 'Alunos', A: metrics1.alunos / 100, B: metrics2.alunos / 100, fullMark: Math.max(metrics1.alunos, metrics2.alunos) / 100 },
  ] : [];

  const comparisons = metrics1 && metrics2 ? [
    {
      label: 'Faturamento',
      val1: metrics1.faturamento,
      val2: metrics2.faturamento,
      format: formatCurrency,
      icon: '💰',
      variation: getVariation(metrics1.faturamento, metrics2.faturamento)
    },
    {
      label: 'Investimento',
      val1: metrics1.investido,
      val2: metrics2.investido,
      format: formatCurrency,
      icon: '💸',
      variation: getVariation(metrics1.investido, metrics2.investido)
    },
    {
      label: 'Lucro',
      val1: metrics1.lucro,
      val2: metrics2.lucro,
      format: formatCurrency,
      icon: '📈',
      variation: getVariation(metrics1.lucro, metrics2.lucro)
    },
    {
      label: 'ROI',
      val1: metrics1.roi,
      val2: metrics2.roi,
      format: (v: number) => `${v.toFixed(1)}%`,
      icon: '📊',
      variation: getVariation(metrics1.roi, metrics2.roi)
    },
    {
      label: 'ROAS',
      val1: metrics1.roas,
      val2: metrics2.roas,
      format: (v: number) => `${v.toFixed(2)}x`,
      icon: '🎯',
      variation: getVariation(metrics1.roas, metrics2.roas)
    },
    {
      label: 'Vendas',
      val1: metrics1.vendas,
      val2: metrics2.vendas,
      format: (v: number) => v.toString(),
      icon: '🛒',
      variation: getVariation(metrics1.vendas, metrics2.vendas)
    },
    {
      label: 'Alunos',
      val1: metrics1.alunos,
      val2: metrics2.alunos,
      format: (v: number) => v.toString(),
      icon: '👥',
      variation: getVariation(metrics1.alunos, metrics2.alunos)
    },
    {
      label: 'Taxa Conversão',
      val1: metrics1.taxaConversao,
      val2: metrics2.taxaConversao,
      format: (v: number) => `${v.toFixed(2)}%`,
      icon: '✨',
      variation: getVariation(metrics1.taxaConversao, metrics2.taxaConversao)
    },
  ] : [];

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-10 p-5">
        <h1 className="text-[3.5rem] bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent mb-[15px] font-extrabold max-md:text-[1.8rem]">
          📅 COMPARAR MESES
        </h1>
        <p className="text-xl text-[hsl(var(--text-secondary))] mb-2.5 max-md:text-sm">
          Análise de Evolução e Comparativo Mensal de Performance
        </p>
      </div>

      {/* Tabs de Visualização */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setViewMode('comparison')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            viewMode === 'comparison'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] hover:text-white'
          }`}
        >
          ⚔️ Comparação Direta
        </button>
        <button
          onClick={() => setViewMode('evolution')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            viewMode === 'evolution'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] hover:text-white'
          }`}
        >
          📈 Evolução Temporal
        </button>
      </div>

      {/* Seletores */}
      <div className="flex justify-center items-center gap-[30px] mb-10 p-[30px] bg-[hsl(var(--bg-secondary))] rounded-2xl border-2 border-[hsl(var(--border-color))] max-md:flex-col max-md:p-5 max-md:gap-[15px]">
        {/* Seletor de Produto */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-[hsl(var(--text-secondary))] text-[1.1rem] font-bold uppercase tracking-wider">
            📦 Produto:
          </span>
          <select
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="py-[15px] px-[25px] rounded-[10px] border-2 border-[hsl(var(--border-color))] bg-[hsl(var(--bg-primary))] text-[hsl(var(--text-primary))] text-[1.1rem] font-semibold cursor-pointer transition-all duration-300 min-w-[200px] hover:border-[hsl(var(--accent-primary))] hover:scale-105 focus:outline-none focus:border-[hsl(var(--accent-primary))]"
          >
            {ALL_PRODUCTS.map(p => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </div>

        {viewMode === 'comparison' && (
          <>
            {/* Seletor Mês 1 */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[hsl(var(--text-secondary))] text-[1.1rem] font-bold uppercase tracking-wider">
                <Calendar className="inline w-5 h-5 mr-1" /> Mês 1:
              </span>
              <select
                value={mes1}
                onChange={(e) => setMes1(e.target.value)}
                className="py-[15px] px-[25px] rounded-[10px] border-2 border-blue-500/50 bg-blue-500/10 text-[hsl(var(--text-primary))] text-[1.1rem] font-semibold cursor-pointer transition-all duration-300 min-w-[180px] hover:border-blue-400 hover:scale-105 focus:outline-none"
              >
                {MONTHS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="text-[2rem] font-black text-[hsl(var(--warning))] px-5 animate-pulse max-md:transform max-md:rotate-90 max-md:text-2xl">
              VS
            </div>

            {/* Seletor Mês 2 */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-[hsl(var(--text-secondary))] text-[1.1rem] font-bold uppercase tracking-wider">
                <Calendar className="inline w-5 h-5 mr-1" /> Mês 2:
              </span>
              <select
                value={mes2}
                onChange={(e) => setMes2(e.target.value)}
                className="py-[15px] px-[25px] rounded-[10px] border-2 border-pink-500/50 bg-pink-500/10 text-[hsl(var(--text-primary))] text-[1.1rem] font-semibold cursor-pointer transition-all duration-300 min-w-[180px] hover:border-pink-400 hover:scale-105 focus:outline-none"
              >
                {MONTHS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-500" />
          <p className="text-xl text-[hsl(var(--text-secondary))]">Carregando dados...</p>
        </div>
      )}

      {/* Modo Comparação */}
      {!loading && viewMode === 'comparison' && metrics1 && metrics2 && (
        <>
          {/* Cards Comparativos */}
          <div className="grid grid-cols-2 gap-5 mb-8 max-md:grid-cols-1">
            {/* Card Mês 1 */}
            <div className={`relative bg-[hsl(var(--bg-secondary))] rounded-2xl p-6 border-4 transition-all ${
              winner === 1 ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'border-blue-500/30'
            }`}>
              {winner === 1 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg animate-bounce-gentle">
                    <span className="text-xl mr-2">🏆</span>
                    <span className="text-sm font-black text-white uppercase">Vencedor</span>
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-bold text-center mb-6 text-blue-400">
                📅 {MONTHS.find(m => m.id === mes1)?.name}
              </h3>
              <div className="text-4xl font-bold text-center text-white mb-2">
                {formatCurrency(metrics1.faturamento)}
              </div>
              <p className="text-center text-[hsl(var(--text-secondary))]">Faturamento Total</p>
            </div>

            {/* Card Mês 2 */}
            <div className={`relative bg-[hsl(var(--bg-secondary))] rounded-2xl p-6 border-4 transition-all ${
              winner === 2 ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'border-pink-500/30'
            }`}>
              {winner === 2 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg animate-bounce-gentle">
                    <span className="text-xl mr-2">🏆</span>
                    <span className="text-sm font-black text-white uppercase">Vencedor</span>
                  </div>
                </div>
              )}
              <h3 className="text-2xl font-bold text-center mb-6 text-pink-400">
                📅 {MONTHS.find(m => m.id === mes2)?.name}
              </h3>
              <div className="text-4xl font-bold text-center text-white mb-2">
                {formatCurrency(metrics2.faturamento)}
              </div>
              <p className="text-center text-[hsl(var(--text-secondary))]">Faturamento Total</p>
            </div>
          </div>

          {/* Tabela Comparativa */}
          <div className="bg-[hsl(var(--bg-secondary))] rounded-2xl p-6 border-2 border-[hsl(var(--border-color))] mb-8">
            <h3 className="text-xl font-bold text-center mb-6 text-[hsl(var(--text-primary))]">
              📊 Comparativo Detalhado
            </h3>
            <div className="space-y-3">
              {comparisons.map((comp, idx) => (
                <div
                  key={comp.label}
                  className="grid grid-cols-4 gap-4 items-center p-4 bg-[hsl(var(--bg-primary))] rounded-xl hover:scale-[1.01] transition-transform"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="text-center">
                    <span className={`text-lg font-bold ${
                      comp.val1 > comp.val2 ? 'text-green-400' : comp.val1 < comp.val2 ? 'text-[hsl(var(--text-secondary))]' : 'text-yellow-400'
                    }`}>
                      {comp.format(comp.val1)}
                    </span>
                  </div>
                  <div className="text-center col-span-2">
                    <span className="text-2xl mr-2">{comp.icon}</span>
                    <span className="font-semibold text-[hsl(var(--text-primary))]">{comp.label}</span>
                    <div className={`text-sm mt-1 flex items-center justify-center gap-1 ${
                      comp.variation > 0 ? 'text-green-400' : comp.variation < 0 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {comp.variation > 0 ? <TrendingUp className="w-4 h-4" /> :
                       comp.variation < 0 ? <TrendingDown className="w-4 h-4" /> :
                       <Minus className="w-4 h-4" />}
                      {formatPercent(comp.variation)}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`text-lg font-bold ${
                      comp.val2 > comp.val1 ? 'text-green-400' : comp.val2 < comp.val1 ? 'text-[hsl(var(--text-secondary))]' : 'text-yellow-400'
                    }`}>
                      {comp.format(comp.val2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico Radar */}
          <div className="bg-[hsl(var(--bg-secondary))] rounded-2xl p-6 border-2 border-[hsl(var(--border-color))] mb-8">
            <h3 className="text-xl font-bold text-center mb-6 text-[hsl(var(--text-primary))]">
              🎯 Comparativo Visual (Radar)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border-color))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--text-secondary))' }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: 'hsl(var(--text-secondary))' }} />
                <Radar
                  name={MONTHS.find(m => m.id === mes1)?.name || 'Mês 1'}
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Radar
                  name={MONTHS.find(m => m.id === mes2)?.name || 'Mês 2'}
                  dataKey="B"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--bg-secondary))',
                    border: '1px solid hsl(var(--border-color))',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Análise Textual */}
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border-2 border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--text-primary))]">
              💡 Análise Comparativa
            </h3>
            <div className="space-y-3 text-[hsl(var(--text-secondary))]">
              <p>
                <strong className="text-white">{MONTHS.find(m => m.id === mes2)?.name}</strong> apresentou um
                {getVariation(metrics1.faturamento, metrics2.faturamento) >= 0 ? ' crescimento' : ' declínio'} de{' '}
                <strong className={getVariation(metrics1.faturamento, metrics2.faturamento) >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {Math.abs(getVariation(metrics1.faturamento, metrics2.faturamento)).toFixed(1)}%
                </strong>{' '}
                no faturamento em relação a {MONTHS.find(m => m.id === mes1)?.name}.
              </p>
              <p>
                O número de vendas {getVariation(metrics1.vendas, metrics2.vendas) >= 0 ? 'aumentou' : 'diminuiu'} em{' '}
                <strong className={getVariation(metrics1.vendas, metrics2.vendas) >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {Math.abs(metrics2.vendas - metrics1.vendas)}
                </strong>{' '}
                unidades ({formatPercent(getVariation(metrics1.vendas, metrics2.vendas))}).
              </p>
              <p>
                O ROI {getVariation(metrics1.roi, metrics2.roi) >= 0 ? 'melhorou' : 'piorou'} de{' '}
                <strong className="text-blue-400">{metrics1.roi.toFixed(1)}%</strong> para{' '}
                <strong className="text-pink-400">{metrics2.roi.toFixed(1)}%</strong>.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Modo Evolução */}
      {!loading && viewMode === 'evolution' && allMonthsData.length > 0 && (
        <>
          {/* Gráfico de Linha - Faturamento */}
          <div className="bg-[hsl(var(--bg-secondary))] rounded-2xl p-6 border-2 border-[hsl(var(--border-color))] mb-8">
            <h3 className="text-xl font-bold text-center mb-6 text-[hsl(var(--text-primary))]">
              💰 Evolução do Faturamento
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={allMonthsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-color))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--text-secondary))' }} />
                <YAxis
                  tickFormatter={(val) => `R$ ${(val / 1000).toFixed(0)}k`}
                  tick={{ fill: 'hsl(var(--text-secondary))' }}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--bg-secondary))',
                    border: '1px solid hsl(var(--border-color))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="faturamento"
                  name="Faturamento"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ fill: '#a855f7', r: 6 }}
                  activeDot={{ r: 8, fill: '#ec4899' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Barras - Comparativo Geral */}
          <div className="bg-[hsl(var(--bg-secondary))] rounded-2xl p-6 border-2 border-[hsl(var(--border-color))] mb-8">
            <h3 className="text-xl font-bold text-center mb-6 text-[hsl(var(--text-primary))]">
              📊 Comparativo de Métricas por Mês
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={allMonthsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-color))" />
                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--text-secondary))' }} />
                <YAxis tick={{ fill: 'hsl(var(--text-secondary))' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--bg-secondary))',
                    border: '1px solid hsl(var(--border-color))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="vendas" name="Vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="alunos" name="Alunos (÷10)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="roas" name="ROAS" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
            {allMonthsData.map((month, idx) => (
              <div
                key={month.monthId}
                className="bg-[hsl(var(--bg-secondary))] rounded-xl p-4 border-2 border-[hsl(var(--border-color))] hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <h4 className="font-bold text-[hsl(var(--text-primary))] mb-2">{month.month}</h4>
                <p className="text-sm text-green-400 font-semibold">{formatCurrency(month.faturamento)}</p>
                <p className="text-xs text-[hsl(var(--text-secondary))]">{month.vendas} vendas</p>
                <p className="text-xs text-[hsl(var(--text-secondary))]">ROI: {month.roi.toFixed(1)}%</p>
                {idx > 0 && (
                  <div className={`mt-2 text-xs flex items-center gap-1 ${
                    month.faturamento > allMonthsData[idx - 1].faturamento ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {month.faturamento > allMonthsData[idx - 1].faturamento ?
                      <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {formatPercent(getVariation(allMonthsData[idx - 1].faturamento, month.faturamento))} vs anterior
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Mensagem se não houver dados */}
      {!loading && (!metrics1 || !metrics2) && viewMode === 'comparison' && (
        <div className="text-center py-20 bg-[hsl(var(--bg-secondary))] rounded-2xl">
          <div className="text-5xl mb-4">📊</div>
          <p className="text-xl text-[hsl(var(--text-secondary))]">
            Selecione dois meses e um produto para comparar
          </p>
        </div>
      )}
    </div>
  );
}
