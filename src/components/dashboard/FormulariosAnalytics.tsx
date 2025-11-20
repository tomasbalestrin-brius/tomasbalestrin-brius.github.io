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
import type { AllData } from '@/types/dashboard';

interface FormulariosAnalyticsProps {
  allData: AllData;
  currentMonth: string;
  currentProduct: string;
}

export function FormulariosAnalytics({ allData, currentMonth, currentProduct }: FormulariosAnalyticsProps) {
  const productData = allData[currentProduct];

  // Dados para gráfico de linha (Taxa de preenchimento por semana)
  const taxaPreenchimentoWeekData = useMemo(() => {
    if (!productData) return [];

    return productData.semanas.map((semana, index) => ({
      name: `Semana ${index + 1}`,
      'Taxa Preenchimento': semana.taxaPreenchimento * 100,
      alunos: semana.alunos,
      formularios: semana.formularios,
    }));
  }, [productData]);

  // Dados para gráfico de barras (Comparativo entre produtos)
  const formulariosComparisonData = useMemo(() => {
    return Object.keys(allData)
      .filter(key => allData[key] && allData[key].semanas.length > 0)
      .map(productName => {
        const data = allData[productName];
        const totalAlunos = data.semanas.reduce((sum, s) => sum + s.alunos, 0);
        const totalFormularios = data.semanas.reduce((sum, s) => sum + s.formularios, 0);
        const taxaMedia = totalAlunos > 0 ? (totalFormularios / totalAlunos) * 100 : 0;

        return {
          name: productName.length > 15 ? productName.substring(0, 15) + '...' : productName,
          'Taxa': parseFloat(taxaMedia.toFixed(1)),
          fullName: productName,
          alunos: totalAlunos,
          formularios: totalFormularios,
        };
      })
      .sort((a, b) => b.Taxa - a.Taxa)
      .slice(0, 10); // Top 10
  }, [allData]);

  // Calcular médias e alertas
  const taxaMedia = useMemo(() => {
    if (!productData || productData.semanas.length === 0) return 0;
    const totalAlunos = productData.semanas.reduce((sum, s) => sum + s.alunos, 0);
    const totalFormularios = productData.semanas.reduce((sum, s) => sum + s.formularios, 0);
    return totalAlunos > 0 ? (totalFormularios / totalAlunos) * 100 : 0;
  }, [productData]);

  const taxaTendencia = useMemo(() => {
    if (!productData?.tendencia) return 0;
    return productData.tendencia.taxaPreenchimento * 100;
  }, [productData]);

  const isTaxaBaixa = taxaMedia < 50;
  const isTaxaOtima = taxaMedia >= 80;
  const isTaxaBoa = taxaMedia >= 65 && taxaMedia < 80;

  // Cores para o gráfico de barras baseado em performance
  const getBarColor = (value: number) => {
    if (value >= 80) return '#10b981'; // Verde
    if (value >= 65) return '#f59e0b'; // Amarelo
    if (value >= 50) return '#fb923c'; // Laranja
    return '#ef4444'; // Vermelho
  };

  // Estatísticas adicionais
  const totalAlunos = productData?.semanas.reduce((sum, s) => sum + s.alunos, 0) || 0;
  const totalFormularios = productData?.semanas.reduce((sum, s) => sum + s.formularios, 0) || 0;
  const melhorSemana = productData?.semanas.reduce((max, s) =>
    s.taxaPreenchimento > max.taxaPreenchimento ? s : max
  , productData.semanas[0]);
  const piorSemana = productData?.semanas.reduce((min, s) =>
    s.taxaPreenchimento < min.taxaPreenchimento ? s : min
  , productData.semanas[0]);

  if (!productData) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-[hsl(var(--text-secondary))]">
          Selecione um produto para ver a Análise de Formulários
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card Taxa Média */}
        <div className={`p-6 rounded-xl shadow-lg ${
          isTaxaBaixa ? 'bg-gradient-to-br from-red-500 to-red-600' :
          isTaxaOtima ? 'bg-gradient-to-br from-green-500 to-green-600' :
          isTaxaBoa ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
          'bg-gradient-to-br from-orange-500 to-orange-600'
        } text-white`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📝</span>
            <h3 className="text-sm font-semibold opacity-90">Taxa Média</h3>
          </div>
          <p className="text-4xl font-bold">{taxaMedia.toFixed(1)}%</p>
          <p className="text-xs mt-2 opacity-80">
            {isTaxaBaixa && '⚠️ Abaixo do ideal (< 50%)'}
            {isTaxaOtima && '🎉 Excelente performance!'}
            {isTaxaBoa && '👍 Boa performance'}
            {!isTaxaBaixa && !isTaxaOtima && !isTaxaBoa && '📊 Performance regular'}
          </p>
        </div>

        {/* Card Tendência */}
        <div className={`p-6 rounded-xl shadow-lg ${
          taxaTendencia >= 80 ? 'bg-gradient-to-br from-teal-500 to-teal-600' :
          taxaTendencia >= 50 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
          'bg-gradient-to-br from-rose-500 to-rose-600'
        } text-white`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📈</span>
            <h3 className="text-sm font-semibold opacity-90">Tendência</h3>
          </div>
          <p className="text-4xl font-bold">{taxaTendencia.toFixed(1)}%</p>
          <p className="text-xs mt-2 opacity-80">
            {taxaTendencia > taxaMedia ? '📈 Crescimento previsto' : '📉 Atenção à tendência'}
          </p>
        </div>

        {/* Card Total Formulários */}
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📋</span>
            <h3 className="text-sm font-semibold opacity-90">Total Formulários</h3>
          </div>
          <p className="text-4xl font-bold">{totalFormularios}</p>
          <p className="text-xs mt-2 opacity-80">
            De {totalAlunos} alunos
          </p>
        </div>

        {/* Card Melhor Semana */}
        <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">⭐</span>
            <h3 className="text-sm font-semibold opacity-90">Melhor Semana</h3>
          </div>
          <p className="text-4xl font-bold">
            {melhorSemana ? (melhorSemana.taxaPreenchimento * 100).toFixed(1) : 0}%
          </p>
          <p className="text-xs mt-2 opacity-80">
            Semana {melhorSemana ? productData.semanas.indexOf(melhorSemana) + 1 : '-'}
          </p>
        </div>
      </div>

      {/* Alertas */}
      {isTaxaBaixa && (
        <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Alerta: Taxa de Preenchimento Baixa</h3>
              <p className="text-[hsl(var(--text-secondary))] mb-3">
                Sua taxa média de preenchimento está abaixo de 50%, indicando que menos da metade dos alunos estão preenchendo formulários.
              </p>
              <div className="space-y-2 text-sm text-[hsl(var(--text-secondary))]">
                <p>💡 <strong>Recomendações:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Simplifique o formulário - remova campos desnecessários</li>
                  <li>Melhore a comunicação sobre a importância do preenchimento</li>
                  <li>Adicione incentivos para preenchimento completo</li>
                  <li>Verifique se há problemas técnicos no formulário</li>
                  <li>Teste diferentes momentos para solicitar o preenchimento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Linha - Taxa de Preenchimento por Semana */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          📈 Evolução da Taxa de Preenchimento - {currentProduct}
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={taxaPreenchimentoWeekData}>
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
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taxa']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Taxa Preenchimento"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-[hsl(var(--text-secondary))]">
          <p>
            <strong>Taxa de Preenchimento:</strong> Percentual de alunos que preencheram o formulário em relação ao total de alunos.
          </p>
        </div>
      </div>

      {/* Gráfico de Barras - Ranking de Produtos */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          🏆 Ranking de Taxa de Preenchimento - Top Produtos
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={formulariosComparisonData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis type="number" stroke="#94a3b8" tickFormatter={(value) => `${value}%`} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
                color: '#e2e8f0'
              }}
              formatter={(value: number, name, props) => [
                `${value.toFixed(1)}%`,
                `${props.payload.fullName} (${props.payload.formularios}/${props.payload.alunos})`
              ]}
            />
            <Bar dataKey="Taxa" radius={[0, 8, 8, 0]}>
              {formulariosComparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.Taxa)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-[hsl(var(--text-secondary))]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500"></div>
            <span>≥ 80%: Excelente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500"></div>
            <span>65-80%: Bom</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span>50-65%: Regular</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>&lt; 50%: Atenção</span>
          </div>
        </div>
      </div>

      {/* Insights Automáticos */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          💡 Insights Automáticos
        </h3>
        <div className="space-y-3 text-[hsl(var(--text-secondary))]">
          {/* Variação entre melhor e pior semana */}
          {melhorSemana && piorSemana && (
            <div className="flex items-start gap-3 p-4 bg-[hsl(var(--bg-primary))] rounded-lg">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-[hsl(var(--text-primary))]">Variação Semanal</p>
                <p className="text-sm">
                  Variação de {((melhorSemana.taxaPreenchimento - piorSemana.taxaPreenchimento) * 100).toFixed(1)}% entre a melhor (Semana {productData.semanas.indexOf(melhorSemana) + 1}: {(melhorSemana.taxaPreenchimento * 100).toFixed(1)}%) e pior (Semana {productData.semanas.indexOf(piorSemana) + 1}: {(piorSemana.taxaPreenchimento * 100).toFixed(1)}%) semana
                </p>
              </div>
            </div>
          )}

          {/* Tendência positiva */}
          {taxaTendencia > taxaMedia && (
            <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-lg">
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-semibold text-green-600">Tendência Positiva</p>
                <p className="text-sm">
                  A tendência indica crescimento de {((taxaTendencia / taxaMedia - 1) * 100).toFixed(1)}% na taxa de preenchimento no próximo período
                </p>
              </div>
            </div>
          )}

          {/* Tendência negativa */}
          {taxaTendencia < taxaMedia && (
            <div className="flex items-start gap-3 p-4 bg-orange-500/10 rounded-lg">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-orange-600">Atenção à Tendência</p>
                <p className="text-sm">
                  A tendência indica possível queda de {((1 - taxaTendencia / taxaMedia) * 100).toFixed(1)}% na taxa de preenchimento. Monitore de perto e considere ações corretivas.
                </p>
              </div>
            </div>
          )}

          {/* Performance geral */}
          <div className="flex items-start gap-3 p-4 bg-[hsl(var(--bg-primary))] rounded-lg">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-semibold text-[hsl(var(--text-primary))]">Desempenho Geral</p>
              <p className="text-sm">
                {totalFormularios} formulários preenchidos de {totalAlunos} alunos ({taxaMedia.toFixed(1)}% do total).
                {taxaMedia >= 80 && ' Parabéns! Sua taxa de preenchimento está excelente.'}
                {taxaMedia >= 50 && taxaMedia < 80 && ' Há espaço para melhorias na taxa de preenchimento.'}
                {taxaMedia < 50 && ' É necessário melhorar urgentemente a taxa de preenchimento.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
