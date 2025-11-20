import { useState, useMemo } from 'react';
import {
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

interface EvolutionChartsProps {
  allData: AllData;
  currentMonth: string;
  currentProduct: string;
}

type MetricCategory = 'financeiro' | 'trafego' | 'conversao' | 'taxas' | 'todos';

export function EvolutionCharts({ allData, currentMonth, currentProduct }: EvolutionChartsProps) {
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('todos');
  const productData = allData[currentProduct];

  // Dados por semana
  const weeklyData = useMemo(() => {
    if (!productData) return [];

    return productData.semanas.map((semana, index) => ({
      name: `Sem ${index + 1}`,
      // Financeiro
      investido: semana.investido,
      faturamentoFunil: semana.faturamentoFunil,
      faturamentoTrafego: semana.faturamentoTrafego,
      lucro: semana.lucroFunil,
      // Tráfego
      alunos: semana.alunos,
      formularios: semana.formularios,
      qualificados: semana.qualificados,
      agendados: semana.agendados,
      callRealizada: semana.callRealizada,
      vendas: semana.numeroVenda,
      // Conversão
      roasFunil: semana.roasFunil,
      roasTrafego: semana.roasTrafego,
      // Taxas (em %)
      taxaPreenchimento: semana.taxaPreenchimento * 100,
      taxaAgendamento: semana.taxaAgendamento * 100,
      taxaComparecimento: semana.taxaComparecimento * 100,
      taxaConversao: semana.taxaConversao * 100,
      taxaAscensao: semana.taxaAscensao * 100,
    }));
  }, [productData]);

  // Adicionar tendência ao último ponto
  const dataWithTrend = useMemo(() => {
    if (!productData || !productData.tendencia) return weeklyData;

    const trendPoint = {
      name: `Tend.`,
      investido: productData.tendencia.investido,
      faturamentoFunil: productData.tendencia.faturamentoFunil,
      faturamentoTrafego: productData.tendencia.faturamentoTrafego,
      lucro: productData.tendencia.lucroFunil,
      alunos: productData.tendencia.alunos,
      formularios: productData.tendencia.formularios,
      qualificados: productData.tendencia.qualificados,
      agendados: productData.tendencia.agendados,
      callRealizada: productData.tendencia.callRealizada,
      vendas: productData.tendencia.numeroVenda,
      roasFunil: productData.tendencia.roasFunil,
      roasTrafego: productData.tendencia.roasTrafego,
      taxaPreenchimento: productData.tendencia.taxaPreenchimento * 100,
      taxaAgendamento: productData.tendencia.taxaAgendamento * 100,
      taxaComparecimento: productData.tendencia.taxaComparecimento * 100,
      taxaConversao: productData.tendencia.taxaConversao * 100,
      taxaAscensao: productData.tendencia.taxaAscensao * 100,
    };

    return [...weeklyData, trendPoint];
  }, [weeklyData, productData]);

  const categories = [
    { id: 'todos' as MetricCategory, label: 'Todas as Métricas', icon: '📊' },
    { id: 'financeiro' as MetricCategory, label: 'Financeiro', icon: '💰' },
    { id: 'trafego' as MetricCategory, label: 'Tráfego e Funil', icon: '👥' },
    { id: 'conversao' as MetricCategory, label: 'ROAS e Conversão', icon: '🎯' },
    { id: 'taxas' as MetricCategory, label: 'Taxas de Conversão', icon: '📈' },
  ];

  if (!productData) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-[hsl(var(--text-secondary))]">
          Selecione um produto para ver os Gráficos de Evolução
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-10 p-5">
        <h1 className="text-[3.5rem] bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent mb-[15px] font-extrabold max-md:text-[1.8rem]">
          📈 EVOLUÇÃO DE MÉTRICAS
        </h1>
        <p className="text-xl text-[hsl(var(--text-secondary))] mb-2.5 max-md:text-sm">
          Análise temporal detalhada de todas as métricas - {currentProduct}
        </p>
      </div>

      {/* Filtro de Categorias */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-secondary))] border-2 border-[hsl(var(--border-color))] hover:border-purple-500'
            }`}
          >
            <span className="mr-2">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gráficos Financeiros */}
      {(selectedCategory === 'todos' || selectedCategory === 'financeiro') && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
            💰 Métricas Financeiras
          </h2>

          {/* Investimento vs Faturamento vs Lucro */}
          <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
            <h3 className="text-xl font-bold text-[hsl(var(--text-primary))] mb-4">
              💵 Investimento, Faturamento e Lucro
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dataWithTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `R$ ${value.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                />
                <Legend />
                <Line type="monotone" dataKey="investido" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} name="Investido" />
                <Line type="monotone" dataKey="faturamentoFunil" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} name="Faturamento Funil" />
                <Line type="monotone" dataKey="faturamentoTrafego" stroke="#06b6d4" strokeWidth={2} dot={{ r: 5 }} strokeDasharray="5 5" name="Faturamento Tráfego" />
                <Line type="monotone" dataKey="lucro" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} name="Lucro" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-[hsl(var(--text-secondary))] mt-4">
              💡 <strong>Dica:</strong> Observe quando o lucro (roxo) se distancia do faturamento - isso indica boa margem de lucro.
            </p>
          </div>
        </div>
      )}

      {/* Gráficos de Tráfego e Funil */}
      {(selectedCategory === 'todos' || selectedCategory === 'trafego') && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
            👥 Tráfego e Funil de Vendas
          </h2>

          {/* Funil Completo */}
          <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
            <h3 className="text-xl font-bold text-[hsl(var(--text-primary))] mb-4">
              🔀 Evolução do Funil Completo
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dataWithTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
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
                <Line type="monotone" dataKey="alunos" stroke="#059669" strokeWidth={2} dot={{ r: 5 }} name="Alunos" />
                <Line type="monotone" dataKey="formularios" stroke="#0284c7" strokeWidth={2} dot={{ r: 5 }} name="Formulários" />
                <Line type="monotone" dataKey="qualificados" stroke="#0891b2" strokeWidth={2} dot={{ r: 5 }} name="Qualificados" />
                <Line type="monotone" dataKey="agendados" stroke="#2563eb" strokeWidth={2} dot={{ r: 5 }} name="Agendados" />
                <Line type="monotone" dataKey="callRealizada" stroke="#7c3aed" strokeWidth={2} dot={{ r: 5 }} name="Calls Realizadas" />
                <Line type="monotone" dataKey="vendas" stroke="#c026d3" strokeWidth={3} dot={{ r: 6 }} name="Vendas" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-[hsl(var(--text-secondary))] mt-4">
              💡 <strong>Dica:</strong> Identifique em qual etapa do funil há maior perda de leads para otimizar esse ponto.
            </p>
          </div>
        </div>
      )}

      {/* Gráficos de ROAS e Conversão */}
      {(selectedCategory === 'todos' || selectedCategory === 'conversao') && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
            🎯 ROAS e Performance de Conversão
          </h2>

          {/* ROAS */}
          <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
            <h3 className="text-xl font-bold text-[hsl(var(--text-primary))] mb-4">
              📊 Evolução do ROAS
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dataWithTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value}x`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => `${value.toFixed(2)}x`}
                />
                <Legend />
                <Line type="monotone" dataKey="roasFunil" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} name="ROAS Funil" />
                <Line type="monotone" dataKey="roasTrafego" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} strokeDasharray="5 5" name="ROAS Tráfego" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-[hsl(var(--text-secondary))]">
              <div>
                <strong>ROAS Funil:</strong> Retorno total considerando todo o faturamento do funil
              </div>
              <div>
                <strong>ROAS Tráfego:</strong> Retorno direto do investimento em tráfego
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos de Taxas */}
      {(selectedCategory === 'todos' || selectedCategory === 'taxas') && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
            📈 Taxas de Conversão e Performance
          </h2>

          {/* Taxas de Conversão */}
          <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
            <h3 className="text-xl font-bold text-[hsl(var(--text-primary))] mb-4">
              📊 Evolução das Taxas de Conversão
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dataWithTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
                <Line type="monotone" dataKey="taxaPreenchimento" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} name="Taxa Preenchimento" />
                <Line type="monotone" dataKey="taxaAgendamento" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} name="Taxa Agendamento" />
                <Line type="monotone" dataKey="taxaComparecimento" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5 }} name="Taxa Comparecimento" />
                <Line type="monotone" dataKey="taxaConversao" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6 }} name="Taxa Conversão" />
                <Line type="monotone" dataKey="taxaAscensao" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} strokeDasharray="5 5" name="Taxa Ascensão" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs text-[hsl(var(--text-secondary))]">
              <div>
                <strong>Taxa Preenchimento:</strong> Formulários ÷ Alunos
              </div>
              <div>
                <strong>Taxa Agendamento:</strong> Agendados ÷ Qualificados
              </div>
              <div>
                <strong>Taxa Comparecimento:</strong> Calls Realizadas ÷ Agendados
              </div>
              <div>
                <strong>Taxa Conversão:</strong> Vendas ÷ Calls Realizadas
              </div>
              <div>
                <strong>Taxa Ascensão:</strong> Taxa de upgrade ou upsell
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insights Gerais */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          💡 Insights da Evolução
        </h3>
        <div className="space-y-3 text-[hsl(var(--text-secondary))]">
          <div className="flex items-start gap-3 p-4 bg-[hsl(var(--bg-primary))] rounded-lg">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-[hsl(var(--text-primary))]">Análise de Tendência</p>
              <p className="text-sm">
                O último ponto em cada gráfico (marcado como "Tend.") representa a projeção baseada na tendência das semanas anteriores.
                Compare com os valores reais para avaliar se as previsões estão se concretizando.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="font-semibold text-blue-600">Como Usar Estes Gráficos</p>
              <p className="text-sm">
                Use os filtros acima para focar em categorias específicas de métricas. Identifique padrões, tendências e
                anomalias ao longo do tempo para tomar decisões estratégicas baseadas em dados.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-purple-500/10 rounded-lg">
            <span className="text-2xl">📈</span>
            <div>
              <p className="font-semibold text-purple-600">Otimização Contínua</p>
              <p className="text-sm">
                Monitore constantemente as métricas que mais impactam seu negócio. Pequenas melhorias consistentes
                nas taxas de conversão podem resultar em grandes ganhos no faturamento final.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
