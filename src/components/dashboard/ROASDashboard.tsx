import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { AllData, ProductData } from '@/types/dashboard';

interface ROASDashboardProps {
  allData: AllData;
  currentMonth: string;
  currentProduct: string;
}

export function ROASDashboard({ allData, currentMonth, currentProduct }: ROASDashboardProps) {
  const productData = allData[currentProduct];

  // Dados para gráfico de linha (ROAS por semana)
  const roasWeekData = useMemo(() => {
    if (!productData) return [];

    return productData.semanas.map((semana, index) => ({
      name: `Semana ${index + 1}`,
      'ROAS Funil': semana.roasFunil,
      'ROAS Tráfego': semana.roasTrafego,
      investido: semana.investido,
      faturamento: semana.faturamentoFunil,
    }));
  }, [productData]);

  // Dados para gráfico de barras (Comparativo entre produtos)
  const roasComparisonData = useMemo(() => {
    return Object.keys(allData)
      .filter(key => allData[key] && allData[key].semanas.length > 0)
      .map(productName => {
        const data = allData[productName];
        const roasMedio = data.semanas.reduce((sum, s) => sum + s.roasFunil, 0) / data.semanas.length;

        return {
          name: productName.length > 15 ? productName.substring(0, 15) + '...' : productName,
          'ROAS': parseFloat(roasMedio.toFixed(2)),
          fullName: productName
        };
      })
      .sort((a, b) => b.ROAS - a.ROAS)
      .slice(0, 10); // Top 10
  }, [allData]);

  // Calcular médias e alertas
  const roasMedio = useMemo(() => {
    if (!productData || productData.semanas.length === 0) return 0;
    return productData.semanas.reduce((sum, s) => sum + s.roasFunil, 0) / productData.semanas.length;
  }, [productData]);

  const roasTendencia = productData?.tendencia?.roasFunil || 0;

  const isRoasBaixo = roasMedio < 1;
  const isRoasOtimo = roasMedio >= 2;
  const isRoasBom = roasMedio >= 1.5 && roasMedio < 2;

  // Cores para o gráfico de barras baseado em performance
  const getBarColor = (value: number) => {
    if (value >= 2) return '#10b981'; // Verde
    if (value >= 1.5) return '#f59e0b'; // Amarelo
    if (value >= 1) return '#fb923c'; // Laranja
    return '#ef4444'; // Vermelho
  };

  if (!productData) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-[hsl(var(--text-secondary))]">
          Selecione um produto para ver o Dashboard de ROAS
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card ROAS Médio */}
        <div className={`p-6 rounded-xl shadow-lg ${
          isRoasBaixo ? 'bg-gradient-to-br from-red-500 to-red-600' :
          isRoasOtimo ? 'bg-gradient-to-br from-green-500 to-green-600' :
          isRoasBom ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
          'bg-gradient-to-br from-orange-500 to-orange-600'
        } text-white`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🎯</span>
            <h3 className="text-sm font-semibold opacity-90">ROAS Médio</h3>
          </div>
          <p className="text-4xl font-bold">{roasMedio.toFixed(2)}x</p>
          <p className="text-xs mt-2 opacity-80">
            {isRoasBaixo && '⚠️ Abaixo do ideal (< 1x)'}
            {isRoasOtimo && '🎉 Excelente performance!'}
            {isRoasBom && '👍 Boa performance'}
            {!isRoasBaixo && !isRoasOtimo && !isRoasBom && '📊 Performance regular'}
          </p>
        </div>

        {/* Card Tendência */}
        <div className={`p-6 rounded-xl shadow-lg ${
          roasTendencia >= 2 ? 'bg-gradient-to-br from-teal-500 to-teal-600' :
          roasTendencia >= 1 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
          'bg-gradient-to-br from-rose-500 to-rose-600'
        } text-white`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📈</span>
            <h3 className="text-sm font-semibold opacity-90">Tendência ROAS</h3>
          </div>
          <p className="text-4xl font-bold">{roasTendencia.toFixed(2)}x</p>
          <p className="text-xs mt-2 opacity-80">
            {roasTendencia > roasMedio ? '📈 Crescimento previsto' : '📉 Atenção à tendência'}
          </p>
        </div>

        {/* Card Melhor Semana */}
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">⭐</span>
            <h3 className="text-sm font-semibold opacity-90">Melhor Semana</h3>
          </div>
          <p className="text-4xl font-bold">
            {Math.max(...productData.semanas.map(s => s.roasFunil)).toFixed(2)}x
          </p>
          <p className="text-xs mt-2 opacity-80">
            Semana {productData.semanas.findIndex(s => s.roasFunil === Math.max(...productData.semanas.map(s => s.roasFunil))) + 1}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {isRoasBaixo && (
        <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Alerta: ROAS Abaixo do Ideal</h3>
              <p className="text-[hsl(var(--text-secondary))] mb-3">
                Seu ROAS médio está abaixo de 1x, o que significa que você está investindo mais do que faturando.
              </p>
              <div className="space-y-2 text-sm text-[hsl(var(--text-secondary))]">
                <p>💡 <strong>Recomendações:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Revise suas campanhas de tráfego pago</li>
                  <li>Otimize suas taxas de conversão no funil</li>
                  <li>Analise o custo por lead e CAC</li>
                  <li>Considere pausar campanhas de baixa performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Linha - ROAS por Semana */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          📈 Evolução do ROAS - {currentProduct}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={roasWeekData}>
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
            <Line
              type="monotone"
              dataKey="ROAS Funil"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="ROAS Tráfego"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[hsl(var(--text-secondary))]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-purple-500"></div>
            <span><strong>ROAS Funil:</strong> Retorno total do funil (faturamento ÷ investimento)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-blue-500 opacity-50"></div>
            <span><strong>ROAS Tráfego:</strong> Retorno direto do tráfego</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Barras - Ranking de Produtos */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          🏆 Ranking de ROAS - Top Produtos
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={roasComparisonData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
              formatter={(value: number, name, props) => [
                `${value.toFixed(2)}x`,
                props.payload.fullName
              ]}
            />
            <Bar dataKey="ROAS" radius={[0, 8, 8, 0]}>
              {roasComparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.ROAS)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-[hsl(var(--text-secondary))]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>≥ 2.0x: Excelente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span>1.5-2.0x: Bom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span>1.0-1.5x: Regular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>&lt; 1.0x: Atenção</span>
          </div>
        </div>
      </div>

      {/* Insights Automáticos */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          💡 Insights Automáticos
        </h3>
        <div className="space-y-3 text-[hsl(var(--text-secondary))]">
          <div className="flex items-start gap-3 p-4 bg-[hsl(var(--bg-primary))] rounded-lg">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-[hsl(var(--text-primary))]">Variação Semanal</p>
              <p className="text-sm">
                Maior variação: {(Math.max(...productData.semanas.map(s => s.roasFunil)) - Math.min(...productData.semanas.map(s => s.roasFunil))).toFixed(2)}x entre semanas
              </p>
            </div>
          </div>

          {roasMedio < roasTendencia && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-semibold text-green-600">Tendência Positiva</p>
                <p className="text-sm">
                  A tendência indica crescimento de {((roasTendencia / roasMedio - 1) * 100).toFixed(1)}% no próximo período
                </p>
              </div>
            </div>
          )}

          {roasMedio > roasTendencia && (
            <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-orange-600">Atenção à Tendência</p>
                <p className="text-sm">
                  A tendência indica possível queda no próximo período. Monitore de perto.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
