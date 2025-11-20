import { useMemo } from 'react';
import type { AllData, ProductData } from '@/types/dashboard';

interface AlertsSystemProps {
  allData: AllData;
  currentMonth: string;
  currentProduct: string;
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  message: string;
  metric?: string;
  value?: number;
  threshold?: number;
  icon: string;
}

export function AlertsSystem({ allData, currentMonth, currentProduct }: AlertsSystemProps) {
  const productData = allData[currentProduct];

  // Calcular alertas baseados nas métricas
  const alerts = useMemo(() => {
    if (!productData || !productData.semanas || productData.semanas.length === 0) {
      return [];
    }

    const alertsList: Alert[] = [];
    let alertId = 0;

    // Calcular médias e totais
    const numSemanas = productData.semanas.length;
    const totais = {
      investido: 0,
      faturamento: 0,
      lucro: 0,
      roasFunil: 0,
      roasTrafego: 0,
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

    productData.semanas.forEach(semana => {
      totais.investido += semana.investido;
      totais.faturamento += semana.faturamentoFunil;
      totais.lucro += semana.lucroFunil;
      totais.roasFunil += semana.roasFunil;
      totais.roasTrafego += semana.roasTrafego;
      totais.alunos += semana.alunos;
      totais.formularios += semana.formularios;
      totais.qualificados += semana.qualificados;
      totais.agendados += semana.agendados;
      totais.callRealizada += semana.callRealizada;
      totais.vendas += semana.numeroVenda;
      totais.taxaPreenchimento += semana.taxaPreenchimento;
      totais.taxaAgendamento += semana.taxaAgendamento;
      totais.taxaComparecimento += semana.taxaComparecimento;
      totais.taxaConversao += semana.taxaConversao;
    });

    const medias = {
      roasFunil: totais.roasFunil / numSemanas,
      roasTrafego: totais.roasTrafego / numSemanas,
      taxaPreenchimento: (totais.taxaPreenchimento / numSemanas) * 100,
      taxaAgendamento: (totais.taxaAgendamento / numSemanas) * 100,
      taxaComparecimento: (totais.taxaComparecimento / numSemanas) * 100,
      taxaConversao: (totais.taxaConversao / numSemanas) * 100,
    };

    // ALERTA 1: ROAS abaixo de 1x (CRÍTICO)
    if (medias.roasFunil < 1) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'error',
        category: 'Financeiro',
        title: 'ROAS Crítico: Prejuízo',
        message: `Seu ROAS médio está em ${medias.roasFunil.toFixed(2)}x, indicando que você está investindo mais do que faturando. É urgente revisar as campanhas e otimizar o funil.`,
        metric: 'ROAS Funil',
        value: medias.roasFunil,
        threshold: 1.0,
        icon: '🚨',
      });
    }

    // ALERTA 2: ROAS entre 1x e 1.5x (ATENÇÃO)
    if (medias.roasFunil >= 1 && medias.roasFunil < 1.5) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'warning',
        category: 'Financeiro',
        title: 'ROAS Baixo',
        message: `Seu ROAS está em ${medias.roasFunil.toFixed(2)}x. Está positivo, mas há espaço para melhorias. Considere otimizar suas campanhas e funil de vendas.`,
        metric: 'ROAS Funil',
        value: medias.roasFunil,
        threshold: 1.5,
        icon: '⚠️',
      });
    }

    // ALERTA 3: Prejuízo total
    if (totais.lucro < 0) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'error',
        category: 'Financeiro',
        title: 'Prejuízo Total',
        message: `O período fechou com prejuízo de R$ ${Math.abs(totais.lucro).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Revise urgentemente os custos e a estratégia de vendas.`,
        metric: 'Lucro',
        value: totais.lucro,
        threshold: 0,
        icon: '💸',
      });
    }

    // ALERTA 4: Taxa de preenchimento baixa (< 50%)
    if (medias.taxaPreenchimento < 50) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'warning',
        category: 'Funil',
        title: 'Taxa de Preenchimento Baixa',
        message: `Apenas ${medias.taxaPreenchimento.toFixed(1)}% dos alunos estão preenchendo formulários. Simplifique o formulário e melhore a comunicação sobre sua importância.`,
        metric: 'Taxa Preenchimento',
        value: medias.taxaPreenchimento,
        threshold: 50,
        icon: '📝',
      });
    }

    // ALERTA 5: Taxa de agendamento baixa (< 40%)
    if (medias.taxaAgendamento < 40) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'warning',
        category: 'Funil',
        title: 'Taxa de Agendamento Baixa',
        message: `Apenas ${medias.taxaAgendamento.toFixed(1)}% dos qualificados estão agendando calls. Revise o processo de qualificação e a oferta de valor da call.`,
        metric: 'Taxa Agendamento',
        value: medias.taxaAgendamento,
        threshold: 40,
        icon: '📅',
      });
    }

    // ALERTA 6: Taxa de comparecimento baixa (< 50%)
    if (medias.taxaComparecimento < 50) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'error',
        category: 'Funil',
        title: 'Alta Taxa de No-Show',
        message: `${(100 - medias.taxaComparecimento).toFixed(1)}% das calls agendadas não são realizadas. Implemente lembretes automáticos e confirme presença antes da call.`,
        metric: 'Taxa Comparecimento',
        value: medias.taxaComparecimento,
        threshold: 50,
        icon: '📞',
      });
    }

    // ALERTA 7: Taxa de conversão baixa (< 20%)
    if (medias.taxaConversao < 20) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'warning',
        category: 'Vendas',
        title: 'Taxa de Conversão Baixa',
        message: `Apenas ${medias.taxaConversao.toFixed(1)}% das calls se convertem em vendas. Treine sua equipe de vendas e revise o script de vendas.`,
        metric: 'Taxa Conversão',
        value: medias.taxaConversao,
        threshold: 20,
        icon: '💰',
      });
    }

    // ALERTA 8: Queda significativa na última semana
    if (numSemanas >= 2) {
      const ultimaSemana = productData.semanas[numSemanas - 1];
      const penultimaSemana = productData.semanas[numSemanas - 2];

      // Queda de faturamento > 30%
      if (ultimaSemana.faturamentoFunil < penultimaSemana.faturamentoFunil * 0.7) {
        const queda = ((penultimaSemana.faturamentoFunil - ultimaSemana.faturamentoFunil) / penultimaSemana.faturamentoFunil) * 100;
        alertsList.push({
          id: `alert-${alertId++}`,
          type: 'error',
          category: 'Tendência',
          title: 'Queda Significativa no Faturamento',
          message: `O faturamento caiu ${queda.toFixed(1)}% na última semana. Investigue as causas e tome ações corretivas imediatamente.`,
          metric: 'Faturamento',
          value: ultimaSemana.faturamentoFunil,
          threshold: penultimaSemana.faturamentoFunil,
          icon: '📉',
        });
      }

      // Queda de vendas > 40%
      if (ultimaSemana.numeroVenda < penultimaSemana.numeroVenda * 0.6) {
        const queda = ((penultimaSemana.numeroVenda - ultimaSemana.numeroVenda) / penultimaSemana.numeroVenda) * 100;
        alertsList.push({
          id: `alert-${alertId++}`,
          type: 'error',
          category: 'Tendência',
          title: 'Queda Abrupta em Vendas',
          message: `O número de vendas caiu ${queda.toFixed(1)}% na última semana. Verifique se há problemas no processo de vendas.`,
          metric: 'Vendas',
          value: ultimaSemana.numeroVenda,
          threshold: penultimaSemana.numeroVenda,
          icon: '📊',
        });
      }
    }

    // ALERTAS POSITIVOS
    // ALERTA 9: ROAS excelente (>= 3x)
    if (medias.roasFunil >= 3) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'success',
        category: 'Desempenho',
        title: 'ROAS Excelente!',
        message: `Parabéns! Seu ROAS está em ${medias.roasFunil.toFixed(2)}x, muito acima da meta. Continue monitorando para manter este nível.`,
        metric: 'ROAS Funil',
        value: medias.roasFunil,
        threshold: 3.0,
        icon: '🎉',
      });
    }

    // ALERTA 10: Taxa de conversão excelente (>= 40%)
    if (medias.taxaConversao >= 40) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'success',
        category: 'Desempenho',
        title: 'Alta Taxa de Conversão',
        message: `Excelente! ${medias.taxaConversao.toFixed(1)}% das calls estão se convertendo em vendas. Sua equipe está performando muito bem!`,
        metric: 'Taxa Conversão',
        value: medias.taxaConversao,
        threshold: 40,
        icon: '🏆',
      });
    }

    // ALERTA 11: Lucro alto
    if (totais.lucro > totais.faturamento * 0.5) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'success',
        category: 'Desempenho',
        title: 'Margem de Lucro Excepcional',
        message: `Sua margem de lucro está acima de 50%! Você está gerando R$ ${totais.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de lucro.`,
        metric: 'Lucro',
        value: totais.lucro,
        threshold: totais.faturamento * 0.5,
        icon: '💎',
      });
    }

    // ALERTA 12: Tendência positiva forte
    if (productData.tendencia && productData.tendencia.roasFunil > medias.roasFunil * 1.2) {
      alertsList.push({
        id: `alert-${alertId++}`,
        type: 'info',
        category: 'Tendência',
        title: 'Tendência de Crescimento',
        message: `A tendência indica um crescimento de ${(((productData.tendencia.roasFunil / medias.roasFunil) - 1) * 100).toFixed(1)}% no ROAS. Continue com as estratégias atuais!`,
        metric: 'ROAS Tendência',
        value: productData.tendencia.roasFunil,
        threshold: medias.roasFunil,
        icon: '📈',
      });
    }

    return alertsList;
  }, [productData]);

  // Calcular saúde geral (health score)
  const healthScore = useMemo(() => {
    const errors = alerts.filter(a => a.type === 'error').length;
    const warnings = alerts.filter(a => a.type === 'warning').length;
    const successes = alerts.filter(a => a.type === 'success').length;

    // Score: 100 - (erros * 15) - (avisos * 5) + (sucessos * 10)
    let score = 100 - (errors * 15) - (warnings * 5) + (successes * 10);
    return Math.max(0, Math.min(100, score));
  }, [alerts]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Regular';
    return 'Crítica';
  };

  const getHealthIcon = (score: number) => {
    if (score >= 80) return '💚';
    if (score >= 60) return '💛';
    if (score >= 40) return '🧡';
    return '❤️';
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500 text-red-600';
      case 'warning':
        return 'bg-orange-500/10 border-orange-500 text-orange-600';
      case 'success':
        return 'bg-green-500/10 border-green-500 text-green-600';
      case 'info':
        return 'bg-blue-500/10 border-blue-500 text-blue-600';
      default:
        return 'bg-gray-500/10 border-gray-500 text-gray-600';
    }
  };

  const alertsByCategory = useMemo(() => {
    const categories: Record<string, Alert[]> = {};
    alerts.forEach(alert => {
      if (!categories[alert.category]) {
        categories[alert.category] = [];
      }
      categories[alert.category].push(alert);
    });
    return categories;
  }, [alerts]);

  if (!productData) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-[hsl(var(--text-secondary))]">
          Selecione um produto para ver o Sistema de Alertas
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-10 p-5">
        <h1 className="text-[3.5rem] bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent mb-[15px] font-extrabold max-md:text-[1.8rem]">
          🚨 SISTEMA DE ALERTAS
        </h1>
        <p className="text-xl text-[hsl(var(--text-secondary))] mb-2.5 max-md:text-sm">
          Monitoramento Inteligente de Performance - {currentProduct}
        </p>
      </div>

      {/* Health Score Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-[hsl(var(--border-color))] shadow-2xl">
        <div className="text-center">
          <p className="text-sm text-[hsl(var(--text-secondary))] mb-2">Saúde Geral do Funil</p>
          <div className={`text-7xl font-extrabold mb-4 ${getHealthColor(healthScore)}`}>
            {healthScore}
          </div>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold mb-6">
            <span>{getHealthIcon(healthScore)}</span>
            <span className={getHealthColor(healthScore)}>{getHealthLabel(healthScore)}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <div className="text-red-500 font-bold text-2xl">{alerts.filter(a => a.type === 'error').length}</div>
              <div className="text-[hsl(var(--text-secondary))]">Críticos</div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg">
              <div className="text-orange-500 font-bold text-2xl">{alerts.filter(a => a.type === 'warning').length}</div>
              <div className="text-[hsl(var(--text-secondary))]">Avisos</div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <div className="text-blue-500 font-bold text-2xl">{alerts.filter(a => a.type === 'info').length}</div>
              <div className="text-[hsl(var(--text-secondary))]">Informações</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <div className="text-green-500 font-bold text-2xl">{alerts.filter(a => a.type === 'success').length}</div>
              <div className="text-[hsl(var(--text-secondary))]">Sucessos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas por Categoria */}
      {Object.keys(alertsByCategory).map(category => (
        <div key={category} className="space-y-4">
          <h2 className="text-2xl font-bold text-[hsl(var(--text-primary))] flex items-center gap-2">
            📂 {category}
          </h2>
          {alertsByCategory[category].map(alert => (
            <div
              key={alert.id}
              className={`p-6 rounded-xl border-2 ${getAlertStyle(alert.type)}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl">{alert.icon}</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{alert.title}</h3>
                  <p className="text-[hsl(var(--text-secondary))] mb-3">{alert.message}</p>
                  {alert.metric && alert.value !== undefined && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-semibold">Métrica:</span> {alert.metric}
                      </div>
                      <div>
                        <span className="font-semibold">Valor Atual:</span> {
                          alert.metric.includes('Taxa') || alert.metric.includes('ROAS')
                            ? alert.value.toFixed(2) + (alert.metric.includes('ROAS') ? 'x' : '%')
                            : alert.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Nenhum alerta */}
      {alerts.length === 0 && (
        <div className="text-center p-10 bg-[hsl(var(--bg-secondary))] rounded-xl border-2 border-[hsl(var(--border-color))]">
          <span className="text-6xl mb-4 block">✅</span>
          <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-2">
            Nenhum Alerta Ativo
          </h3>
          <p className="text-[hsl(var(--text-secondary))]">
            Seu funil está operando dentro dos parâmetros normais. Continue monitorando!
          </p>
        </div>
      )}

      {/* Dicas Gerais */}
      <div className="bg-[hsl(var(--bg-secondary))] p-6 rounded-xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4 flex items-center gap-2">
          💡 Como Usar o Sistema de Alertas
        </h3>
        <div className="space-y-3 text-[hsl(var(--text-secondary))]">
          <p>
            <strong>🚨 Alertas Críticos:</strong> Requerem ação imediata. São problemas que estão impactando significativamente seu negócio.
          </p>
          <p>
            <strong>⚠️ Avisos:</strong> Indicam áreas que precisam de atenção. Não são urgentes, mas devem ser endereçados em breve.
          </p>
          <p>
            <strong>ℹ️ Informações:</strong> Insights e tendências importantes para acompanhar.
          </p>
          <p>
            <strong>✅ Sucessos:</strong> Reconhecem quando você está performando excepcionalmente bem em alguma métrica.
          </p>
          <p className="pt-3 border-t border-[hsl(var(--border-color))]">
            <strong>Health Score:</strong> O score de saúde é calculado automaticamente com base nos alertas ativos.
            Um score acima de 80 indica operação excelente, entre 60-80 é bom, 40-60 é regular e abaixo de 40 indica situação crítica.
          </p>
        </div>
      </div>
    </div>
  );
}
