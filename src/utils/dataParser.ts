import type { WeekData } from '@/types/dashboard';

// Parse value tratando erros do Excel e formatação brasileira
export function parseValue(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  
  // Tratar erros do Excel
  if (typeof val === 'string') {
    const upperVal = val.toUpperCase();
    if (upperVal.includes('#N/A') || upperVal.includes('#DIV/0!') || 
        upperVal.includes('#NUM!') || upperVal.includes('#VALOR!') ||
        upperVal.includes('#REF!') || upperVal.includes('#NOME?')) {
      return 0;
    }
    
    // Remover caracteres não numéricos exceto vírgula e ponto
    let cleaned = val.replace(/[^\d,.-]/g, '');
    
    // Remover pontos de milhar (assumindo formato brasileiro: 1.234,56)
    cleaned = cleaned.replace(/\./g, '');
    
    // Substituir vírgula decimal por ponto
    cleaned = cleaned.replace(',', '.');
    
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

export function parseRow(row: any[]): WeekData {
  // Mapeamento correto das colunas conforme a planilha
  // Coluna A - Funil (row[0])
  // Coluna B - Período (row[1])
  const investido = parseValue(row[2]);                  // Coluna C - Investimento
  const faturamentoTrafego = parseValue(row[3]);         // Coluna D - Faturamento Tráfego
  const roasTrafego = parseValue(row[4]);                // Coluna E - Roas Tráfego
  const alunos = parseValue(row[5]);                     // Coluna F - Número de alunos
  const formularios = parseValue(row[6]);                // Coluna G - Número de formulários
  const taxaPreenchimento = parseValue(row[7]);          // Coluna H - Taxa de preenchimento
  const qualificados = parseValue(row[8]);               // Coluna I - Qualificados
  const agendados = parseValue(row[9]);                  // Coluna J - Agendados
  const taxaAgendamento = parseValue(row[10]);           // Coluna K - Taxa de agendamento
  const callRealizada = parseValue(row[11]);             // Coluna L - Call realizada
  const taxaComparecimento = parseValue(row[12]);        // Coluna M - Taxa de comparecimento
  const numeroVenda = parseValue(row[13]);               // Coluna N - Número de vendas
  const taxaConversao = parseValue(row[14]);             // Coluna O - Taxa de conversão
  const taxaAscensao = parseValue(row[15]);              // Coluna P - Taxa de ascensão
  const vendaMonetizacao = parseValue(row[16]);          // Coluna Q - Venda Monetização
  const entradas = parseValue(row[17]);                  // Coluna R - Entradas Monetização
  const faturamentoFunil = parseValue(row[18]);          // Coluna S - Faturamento Funil
  const roasFunil = parseValue(row[19]);                 // Coluna T - Roas do Funil
  const lucroFunil = faturamentoFunil - investido;       // Calculado

  return {
    funil: row[0] || '',                                 // Coluna A - Funil
    periodo: row[1] || '',                               // Coluna B - Período
    investido,
    faturamentoTrafego,
    roasTrafego,
    alunos,
    formularios,
    taxaPreenchimento,
    qualificados,
    agendados,
    taxaAgendamento,
    callRealizada,
    taxaComparecimento,
    numeroVenda,
    taxaConversao,
    taxaAscensao,
    vendaMonetizacao,
    entradas,
    faturamentoFunil,
    roasFunil,
    lucroFunil,
  };
}

export function calculateTotals(semanas: WeekData[]) {
  return {
    alunos: semanas.reduce((sum, s) => sum + s.alunos, 0),
    qualificados: semanas.reduce((sum, s) => sum + s.qualificados, 0),
    agendados: semanas.reduce((sum, s) => sum + s.agendados, 0),
    callRealizada: semanas.reduce((sum, s) => sum + s.callRealizada, 0),
    vendas: semanas.reduce((sum, s) => sum + s.numeroVenda, 0),
    investido: semanas.reduce((sum, s) => sum + s.investido, 0),
    faturado: semanas.reduce((sum, s) => sum + s.faturamentoTrafego, 0),
    faturamentoFunil: semanas.reduce((sum, s) => sum + s.faturamentoFunil, 0),
    lucroFunil: semanas.reduce((sum, s) => sum + s.lucroFunil, 0),
    vendaMonetizacao: semanas.reduce((sum, s) => sum + s.vendaMonetizacao, 0),
    entradas: semanas.reduce((sum, s) => sum + s.entradas, 0),
  };
}
