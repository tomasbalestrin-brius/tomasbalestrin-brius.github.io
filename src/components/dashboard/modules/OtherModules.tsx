import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AllData } from '@/types/dashboard';

interface ComparacaoModuleProps {
  allData: AllData;
  currentMonth: string;
  onMonthSelect: (month: string) => void;
}

export function ComparacaoModule({ allData, currentMonth, onMonthSelect }: ComparacaoModuleProps) {
  const availableMonths = Object.keys(allData).filter(key => key !== 'Todos');
  const [monthToCompare, setMonthToCompare] = useState<string>(
    availableMonths.find(m => m !== currentMonth) || availableMonths[0] || ''
  );

  // Calcular totais para cada mês
  const calculateMonthTotals = (monthKey: string) => {
    const monthData = allData[monthKey];
    if (!monthData || !monthData.semanas || monthData.semanas.length === 0) {
      return null;
    }

    const totals = {
      investido: 0,
      faturamentoFunil: 0,
      lucro: 0,
      roasFunil: 0,
      alunos: 0,
      formularios: 0,
      qualificados: 0,
      agendados: 0,
      callRealizada: 0,
      vendas: 0,
      taxaPreenchimento: 0,
      taxaAgendamento: 0,
      taxaComparecimento: 0,
      taxaConversao: 0,
    };

    monthData.semanas.forEach(semana => {
      totals.investido += semana.investido;
      totals.faturamentoFunil += semana.faturamentoFunil;
      totals.lucro += semana.lucroFunil;
      totals.alunos += semana.alunos;
      totals.formularios += semana.formularios;
      totals.qualificados += semana.qualificados;
      totals.agendados += semana.agendados;
      totals.callRealizada += semana.callRealizada;
      totals.vendas += semana.numeroVenda;
      totals.roasFunil += semana.roasFunil;
      totals.taxaPreenchimento += semana.taxaPreenchimento;
      totals.taxaAgendamento += semana.taxaAgendamento;
      totals.taxaComparecimento += semana.taxaComparecimento;
      totals.taxaConversao += semana.taxaConversao;
    });

    // Calcular médias
    const numSemanas = monthData.semanas.length;
    totals.roasFunil = totals.roasFunil / numSemanas;
    totals.taxaPreenchimento = (totals.taxaPreenchimento / numSemanas) * 100;
    totals.taxaAgendamento = (totals.taxaAgendamento / numSemanas) * 100;
    totals.taxaComparecimento = (totals.taxaComparecimento / numSemanas) * 100;
    totals.taxaConversao = (totals.taxaConversao / numSemanas) * 100;

    return totals;
  };

  const currentMonthData = calculateMonthTotals(currentMonth);
  const compareMonthData = calculateMonthTotals(monthToCompare);

  // Calcular variações percentuais
  const calculateVariation = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  // Dados para gráfico comparativo
  const comparisonData = useMemo(() => {
    if (!currentMonthData || !compareMonthData) return [];

    return [
      {
        metrica: 'Investido',
        [currentMonth]: currentMonthData.investido,
        [monthToCompare]: compareMonthData.investido,
      },
      {
        metrica: 'Faturamento',
        [currentMonth]: currentMonthData.faturamentoFunil,
        [monthToCompare]: compareMonthData.faturamentoFunil,
      },
      {
        metrica: 'Lucro',
        [currentMonth]: currentMonthData.lucro,
        [monthToCompare]: compareMonthData.lucro,
      },
      {
        metrica: 'ROAS',
        [currentMonth]: currentMonthData.roasFunil,
        [monthToCompare]: compareMonthData.roasFunil,
      },
      {
        metrica: 'Alunos',
        [currentMonth]: currentMonthData.alunos,
        [monthToCompare]: compareMonthData.alunos,
      },
      {
        metrica: 'Vendas',
        [currentMonth]: currentMonthData.vendas,
        [monthToCompare]: compareMonthData.vendas,
      },
    ];
  }, [currentMonthData, compareMonthData, currentMonth, monthToCompare]);

  // Dados de evolução mês a mês
  const evolutionData = useMemo(() => {
    return availableMonths.map(month => {
      const monthData = calculateMonthTotals(month);
      return {
        mes: month,
        Faturamento: monthData?.faturamentoFunil || 0,
        Lucro: monthData?.lucro || 0,
        ROAS: monthData?.roasFunil || 0,
        Vendas: monthData?.vendas || 0,
      };
    });
  }, [availableMonths]);

  if (!currentMonthData || !compareMonthData) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-[hsl(var(--text-secondary))]">
          Dados insuficientes para comparação entre meses
        </p>
      </div>
    );
  }

  const variations = {
    investido: calculateVariation(currentMonthData.investido, compareMonthData.investido),
    faturamento: calculateVariation(currentMonthData.faturamentoFunil, compareMonthData.faturamentoFunil),
    lucro: calculateVariation(currentMonthData.lucro, compareMonthData.lucro),
    roas: calculateVariation(currentMonthData.roasFunil, compareMonthData.roasFunil),
    alunos: calculateVariation(currentMonthData.alunos, compareMonthData.alunos),
    vendas: calculateVariation(currentMonthData.vendas, compareMonthData.vendas),
  };

  const getVariationColor = (variation: number) => {
    if (variation > 0) return 'text-green-500';
    if (variation < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getVariationIcon = (variation: number) => {
    if (variation > 0) return '📈';
    if (variation < 0) return '📉';
    return '➡️';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-10 p-5">
        <h1 className="text-[3.5rem] bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent mb-[15px] font-extrabold max-md:text-[1.8rem]">
          📅 COMPARAÇÃO ENTRE MESES
        </h1>
        <p className="text-xl text-[hsl(var(--text-secondary))] mb-2.5 max-md:text-sm">
          Análise Comparativa de Performance Entre Períodos
        </p>
      </div>

      {/* Seletor de Meses */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">
              Mês Base:
            </label>
            <select
              value={currentMonth}
              onChange={(e) => onMonthSelect(e.target.value)}
              className="w-full p-3 rounded-lg bg-[hsl(var(--bg-primary))] border-2 border-[hsl(var(--border-color))] text-[hsl(var(--text-primary))] font-semibold"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[hsl(var(--text-primary))] mb-2">
              Comparar com:
            </label>
            <select
              value={monthToCompare}
              onChange={(e) => setMonthToCompare(e.target.value)}
              className="w-full p-3 rounded-lg bg-[hsl(var(--bg-primary))] border-2 border-[hsl(var(--border-color))] text-[hsl(var(--text-primary))] font-semibold"
            >
              {availableMonths.filter(m => m !== currentMonth).map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards de Variação */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Investido', value: variations.investido, current: currentMonthData.investido },
          { label: 'Faturamento', value: variations.faturamento, current: currentMonthData.faturamentoFunil },
          { label: 'Lucro', value: variations.lucro, current: currentMonthData.lucro },
          { label: 'ROAS', value: variations.roas, current: currentMonthData.roasFunil },
          { label: 'Alunos', value: variations.alunos, current: currentMonthData.alunos },
          { label: 'Vendas', value: variations.vendas, current: currentMonthData.vendas },
        ].map((item, index) => (
          <div key={index} className="p-4 rounded-xl bg-[hsl(var(--bg-secondary))] border-2 border-[hsl(var(--border-color))]">
            <div className="text-sm text-[hsl(var(--text-secondary))] mb-1">{item.label}</div>
            <div className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-2">
              {item.label === 'ROAS' ? item.current.toFixed(2) + 'x' :
               item.label === 'Investido' || item.label === 'Faturamento' || item.label === 'Lucro' ?
               'R$ ' + item.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) :
               item.current.toLocaleString('pt-BR')}
            </div>
            <div className={`text-sm font-semibold flex items-center gap-1 ${getVariationColor(item.value)}`}>
              <span>{getVariationIcon(item.value)}</span>
              <span>{item.value > 0 ? '+' : ''}{item.value.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico de Barras Comparativo */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          📊 Comparação Lado a Lado
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="metrica" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <Legend />
            <Bar dataKey={currentMonth} fill="#3b82f6" radius={[8, 8, 0, 0]} />
            <Bar dataKey={monthToCompare} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Evolução */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          📈 Evolução ao Longo dos Meses
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={evolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="Faturamento" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Lucro" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="ROAS" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="Vendas" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          💡 Insights da Comparação
        </h3>
        <div className="space-y-3 text-[hsl(var(--text-secondary))]">
          {variations.faturamento > 10 && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-600">Crescimento Significativo</p>
                <p className="text-sm">
                  O faturamento cresceu {variations.faturamento.toFixed(1)}% em relação a {monthToCompare}. Excelente performance!
                </p>
              </div>
            </div>
          )}

          {variations.faturamento < -10 && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-red-600">Queda no Faturamento</p>
                <p className="text-sm">
                  O faturamento caiu {Math.abs(variations.faturamento).toFixed(1)}% em relação a {monthToCompare}. Requer atenção.
                </p>
              </div>
            </div>
          )}

          {variations.roas > 0 && variations.faturamento > 0 && (
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-semibold text-blue-600">Eficiência Melhorada</p>
                <p className="text-sm">
                  Tanto o faturamento quanto o ROAS aumentaram, indicando maior eficiência nas campanhas.
                </p>
              </div>
            </div>
          )}

          {variations.lucro < 0 && variations.faturamento > 0 && (
            <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-lg">
              <span className="text-2xl">💰</span>
              <div>
                <p className="font-semibold text-orange-600">Atenção aos Custos</p>
                <p className="text-sm">
                  O faturamento cresceu mas o lucro diminuiu. Revise os custos operacionais.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
