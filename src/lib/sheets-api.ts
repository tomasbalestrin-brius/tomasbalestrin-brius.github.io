// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD ANALYTICS - GOOGLE SHEETS API INTEGRATION
// Sistema de mapeamento dinâmico de colunas
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════════════════════

const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID || '1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU';
const API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;

// Mapeamento de meses para nomes das abas
const SHEET_NAMES: Record<string, string> = {
  'Outubro': 'Dados de Out/25',
  'Novembro': 'Dados de Nov/25',
  'Dezembro': 'Dados de Dez/25',
  'Janeiro': 'Dados de Jan/26'
};

// ═══════════════════════════════════════════════════════════════════════════
// MAPEAMENTO DINÂMICO DE COLUNAS
//
// INSTRUÇÕES PARA ADICIONAR NOVA COLUNA:
// 1. Adicione a coluna na planilha do Google Sheets
// 2. Adicione o campo no objeto COLUMN_MAPPING abaixo
// 3. Adicione o campo na interface WeekData
// 4. Adicione o campo na função parseRow
// 5. Atualize LAST_COLUMN se necessário
//
// IMPORTANTE: Se adicionar coluna NO MEIO, atualize todos os índices!
// ═══════════════════════════════════════════════════════════════════════════

const COLUMN_MAPPING = {
  // Colunas de identificação
  funil: 0,              // A - Nome do funil
  periodo: 1,            // B - Período (Semana 1-4, Tendência)

  // Colunas de dados (métricas)
  investido: 2,          // C - Investido
  faturamentoTrafego: 3, // D - Faturamento Tráfego
  roasTrafego: 4,        // E - ROAS Tráfego
  alunos: 5,             // F - Número de Alunos
  qualificados: 6,       // G - Qualificados
  agendados: 7,          // H - Agendados
  taxaAgendamento: 8,    // I - Taxa de Agendamento
  callRealizada: 9,      // J - Call Realizada
  taxaComparecimento: 10,// K - Taxa de Comparecimento
  numeroVenda: 11,       // L - Número de Venda
  taxaConversao: 12,     // M - Taxa de Conversão
  taxaAscensao: 13,      // N - Taxa de Ascensão
  vendaMonetizacao: 14,  // O - Venda Monetização
  entradas: 15,          // P - Entrada Monetização
  faturamentoFunil: 16,  // Q - Faturamento do Funil
  lucroFunil: 17,        // R - Lucro do Funil

  // ═══════════════════════════════════════════════════════════════════════
  // ADICIONE NOVAS COLUNAS AQUI (quando adicionar na planilha primeiro!):
  // numeroFormularios: 6,  // G - Número de Formulários
  // taxaPreenchimento: 7,  // H - Taxa de Preenchimento
  // ═══════════════════════════════════════════════════════════════════════
};

// Última coluna de dados (atualizar quando adicionar novas colunas)
const LAST_COLUMN = 'R';

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface WeekData {
  investido: number;
  faturamentoTrafego: number;
  roasTrafego: number;
  alunos: number;
  qualificados: number;
  agendados: number;
  taxaAgendamento: number;
  callRealizada: number;
  taxaComparecimento: number;
  numeroVenda: number;
  taxaConversao: number;
  taxaAscensao: number;
  vendaMonetizacao: number;
  entradas: number;
  faturamentoFunil: number;
  lucroFunil: number;
  roasFunil: number;

  // ═══════════════════════════════════════════════════════════════════════
  // ADICIONE NOVOS CAMPOS AQUI (quando adicionar na planilha primeiro!):
  // numeroFormularios?: number;
  // taxaPreenchimento?: number;
  // ═══════════════════════════════════════════════════════════════════════
}

export interface ProductData {
  name: string;
  weeks: WeekData[];
  tendencia: WeekData | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES DE PARSE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converte valor da planilha para número
 * Trata valores vazios, erros (#N/A, #DIV/0!, etc) e formatação BR
 */
function parseValue(val: any): number {
  if (!val || val === '#N/A' || val === '#DIV/0!' || val === '' || val === '#NUM!' || val === '-') {
    return 0;
  }

  let cleanVal = val.toString().replace(/[^\d,.-]/g, '');
  cleanVal = cleanVal.replace(/\./g, ''); // Remove pontos de milhar
  cleanVal = cleanVal.replace(',', '.'); // Substitui vírgula por ponto

  return parseFloat(cleanVal) || 0;
}

/**
 * Converte uma linha da planilha para objeto WeekData
 * Usa COLUMN_MAPPING para mapear índices dinamicamente
 */
function parseRow(row: any[]): WeekData {
  const col = COLUMN_MAPPING;

  const investido = parseValue(row[col.investido]);
  const faturamentoFunil = parseValue(row[col.faturamentoFunil]);
  const roasFunil = investido > 0 ? (faturamentoFunil / investido) : 0;

  return {
    investido,
    faturamentoTrafego: parseValue(row[col.faturamentoTrafego]),
    roasTrafego: parseValue(row[col.roasTrafego]),
    alunos: parseValue(row[col.alunos]),
    qualificados: parseValue(row[col.qualificados]),
    agendados: parseValue(row[col.agendados]),
    taxaAgendamento: parseValue(row[col.taxaAgendamento]),
    callRealizada: parseValue(row[col.callRealizada]),
    taxaComparecimento: parseValue(row[col.taxaComparecimento]),
    numeroVenda: parseValue(row[col.numeroVenda]),
    taxaConversao: parseValue(row[col.taxaConversao]),
    taxaAscensao: parseValue(row[col.taxaAscensao]),
    vendaMonetizacao: parseValue(row[col.vendaMonetizacao]),
    entradas: parseValue(row[col.entradas]),
    faturamentoFunil,
    lucroFunil: parseValue(row[col.lucroFunil]),
    roasFunil,

    // ═══════════════════════════════════════════════════════════════════════
    // ADICIONE NOVOS CAMPOS AQUI (quando adicionar na planilha primeiro!):
    // numeroFormularios: parseValue(row[col.numeroFormularios]),
    // taxaPreenchimento: parseValue(row[col.taxaPreenchimento]),
    // ═══════════════════════════════════════════════════════════════════════
  };
}

/**
 * Processa todos os dados da planilha e retorna array de produtos
 * Cada produto tem 5 linhas: 4 semanas + 1 tendência
 */
function parseSheetData(rows: any[][]): ProductData[] {
  const products: ProductData[] = [];
  const col = COLUMN_MAPPING;

  // Começar da linha 1 (índice 1), pulando o header (índice 0)
  let i = 1;

  while (i < rows.length) {
    const row = rows[i];

    // Verificar se tem nome do funil na coluna A
    if (!row || !row[col.funil]) {
      i++;
      continue;
    }

    const productName = row[col.funil].toString().trim();
    const weeks: WeekData[] = [];
    let tendencia: WeekData | null = null;

    console.log(`📦 Processando produto: ${productName} (linha ${i + 1})`);

    // Ler as próximas 5 linhas (4 semanas + 1 tendência)
    for (let j = 0; j < 5 && (i + j) < rows.length; j++) {
      const currentRow = rows[i + j];

      if (!currentRow || !currentRow[col.periodo]) continue;

      const periodo = currentRow[col.periodo].toString().toLowerCase();

      // Verificar se é tendência
      if (periodo.includes('tendência') || periodo.includes('tendencia')) {
        tendencia = parseRow(currentRow);
        console.log(`  📈 Tendência encontrada (linha ${i + j + 1})`);
      } else if (periodo.includes('semana')) {
        const weekData = parseRow(currentRow);
        weeks.push(weekData);
        console.log(`  📅 ${currentRow[col.periodo]} (linha ${i + j + 1})`);
      }
    }

    // Adicionar produto se tiver pelo menos 1 semana
    if (weeks.length > 0) {
      products.push({
        name: productName,
        weeks,
        tendencia
      });
      console.log(`  ✅ ${productName}: ${weeks.length} semanas processadas`);
    }

    // Avançar 5 linhas (bloco completo)
    i += 5;
  }

  console.log(`✅ Total de produtos processados: ${products.length}`);

  return products;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL DE FETCH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Busca dados da planilha do Google Sheets
 * @param month - Mês a ser carregado (Outubro, Novembro, Dezembro, Janeiro)
 * @returns Array de ProductData com todos os produtos
 */
export async function fetchSheetData(month: string): Promise<ProductData[]> {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🎯 Iniciando busca de dados para:', month);
  console.log('═══════════════════════════════════════════════════════════');

  // Validar API Key
  if (!API_KEY) {
    throw new Error('❌ VITE_GOOGLE_SHEETS_API_KEY não configurada! Adicione nas variáveis de ambiente.');
  }

  // Validar Spreadsheet ID
  if (!SPREADSHEET_ID) {
    throw new Error('❌ VITE_GOOGLE_SPREADSHEET_ID não configurado! Adicione nas variáveis de ambiente.');
  }

  // Validar mês
  const sheetName = SHEET_NAMES[month];
  if (!sheetName) {
    throw new Error(`❌ Mês inválido: ${month}. Use: ${Object.keys(SHEET_NAMES).join(', ')}`);
  }

  // Construir URL da API
  const range = `${sheetName}!A1:${LAST_COLUMN}200`;
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY}`;

  console.log(`📋 Aba: ${sheetName}`);
  console.log(`📍 Range: ${range}`);
  console.log(`🔗 URL: ${url.replace(API_KEY, 'API_KEY_OCULTA')}`);

  try {
    // Fazer requisição
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`📡 Status: ${response.status}`);

    // Verificar resposta
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API:', errorText);
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    // Processar dados
    const data = await response.json();
    console.log(`✅ Dados recebidos: ${data.values?.length || 0} linhas`);

    // Validar formato
    if (!data.values || !Array.isArray(data.values)) {
      throw new Error('❌ Formato de dados inválido da API');
    }

    // Parse dos dados
    const parsed = parseSheetData(data.values);
    console.log(`✅ Dados parseados: ${parsed.length} produtos`);
    console.log('═══════════════════════════════════════════════════════════');

    return parsed;
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Retorna os meses disponíveis
 */
export function getAvailableMonths(): string[] {
  return Object.keys(SHEET_NAMES);
}

/**
 * Retorna o mapeamento de colunas atual
 */
export function getColumnMapping() {
  return COLUMN_MAPPING;
}

/**
 * Verifica se uma coluna existe no mapeamento
 */
export function hasColumn(columnName: string): boolean {
  return columnName in COLUMN_MAPPING;
}
