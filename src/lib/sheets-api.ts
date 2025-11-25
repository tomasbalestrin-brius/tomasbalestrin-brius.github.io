// src/lib/sheets-api.ts
// Fetch via CSV público do Google Sheets (não requer API Key)

const SPREADSHEET_ID = '1XsdWQNR7FUo4TrrhsMjSGESS3PtS9G7X8FoHHStxLtU';

const SHEET_NAMES: Record<string, string> = {
  'Outubro': 'Dados de Out/25',
  'Novembro': 'Dados de Nov/25',
  'Dezembro': 'Dados de Dez/25',
  'Janeiro': 'Dados de Jan/26'
};

/**
 * Mapeamento das colunas da planilha Google Sheets:
 *
 * AQUISIÇÃO (Colunas A-F):
 * A (0) = Funil
 * B (1) = Período (Semana 1, 2, 3, 4, Tendência)
 * C (2) = Investimento
 * D (3) = Faturamento Tráfego
 * E (4) = ROAS Tráfego
 * F (5) = Número de Alunos
 *
 * SDR (Colunas G-M):
 * G (6) = Número de Formulários
 * H (7) = Taxa de Preenchimento
 * I (8) = Qualificados
 * J (9) = Agendados
 * K (10) = Taxa de Agendamento
 * L (11) = Call Realizada
 * M (12) = Taxa de Comparecimento
 */

export interface WeekData {
  funil?: string;
  periodo?: string;
  // Aquisição (C-F)
  investido: number;        // Coluna C (2)
  faturamentoTrafego: number; // Coluna D (3)
  roasTrafego: number;      // Coluna E (4)
  alunos: number;           // Coluna F (5)
  // SDR (G-M)
  formularios: number;      // Coluna G (6)
  taxaPreenchimento: number; // Coluna H (7)
  qualificados: number;     // Coluna I (8)
  agendados: number;        // Coluna J (9)
  taxaAgendamento: number;  // Coluna K (10)
  callRealizada: number;    // Coluna L (11)
  taxaComparecimento: number; // Coluna M (12)
  // Campos adicionais
  numeroVenda: number;
  taxaConversao: number;
  taxaAscensao: number;
  vendaMonetizacao: number;
  entradas: number;
  faturamentoFunil: number;
  roasFunil: number;
  lucroFunil: number;
}

export interface ProductData {
  name: string;
  weeks: WeekData[];
  tendencia: WeekData | null;
}

function parseValue(val: any): number {
  if (!val || val === '#N/A' || val === '#DIV/0!' || val === '' || val === '#NUM!' || val === '-') {
    return 0;
  }

  let cleanVal = val.toString().replace(/[^\d,.-]/g, '');
  cleanVal = cleanVal.replace(/\./g, ''); // Remove pontos de milhar
  cleanVal = cleanVal.replace(',', '.'); // Substitui vírgula por ponto

  return parseFloat(cleanVal) || 0;
}

function parseRow(row: string[]): WeekData {
  // Aquisição (C-F)
  const investido = parseValue(row[2]);         // C - Investimento
  const faturamentoTrafego = parseValue(row[3]); // D - Faturamento Tráfego
  const roasTrafego = parseValue(row[4]);       // E - ROAS Tráfego
  const alunos = parseValue(row[5]);            // F - Número de Alunos

  // SDR (G-M)
  const formularios = parseValue(row[6]);       // G - Número de Formulários
  const taxaPreenchimento = parseValue(row[7]); // H - Taxa de Preenchimento
  const qualificados = parseValue(row[8]);      // I - Qualificados
  const agendados = parseValue(row[9]);         // J - Agendados
  const taxaAgendamento = parseValue(row[10]);  // K - Taxa de Agendamento
  const callRealizada = parseValue(row[11]);    // L - Call Realizada
  const taxaComparecimento = parseValue(row[12]); // M - Taxa de Comparecimento

  // Campos adicionais (N-T)
  const numeroVenda = parseValue(row[13]);      // N
  const taxaConversao = parseValue(row[14]);    // O
  const taxaAscensao = parseValue(row[15]);     // P
  const vendaMonetizacao = parseValue(row[16]); // Q
  const entradas = parseValue(row[17]);         // R
  const faturamentoFunil = parseValue(row[18]); // S
  const roasFunil = parseValue(row[19]);        // T
  const lucroFunil = faturamentoFunil - investido;

  return {
    funil: row[0] || '',     // A - Funil
    periodo: row[1] || '',   // B - Período
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
    lucroFunil
  };
}

function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;

    const row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  }

  return rows;
}

function parseSheetData(rows: string[][]): ProductData[] {
  const products: ProductData[] = [];

  // Começar da linha 1, pulando o header
  let i = 1;

  while (i < rows.length) {
    const row = rows[i];

    if (!row || !row[0] || row[0].trim() === '') {
      i++;
      continue;
    }

    const productName = row[0].toString().trim();
    const weeks: WeekData[] = [];
    let tendencia: WeekData | null = null;

    console.log(`📦 Processando produto: ${productName} (linha ${i + 1})`);

    // Ler as próximas 5 linhas (4 semanas + 1 tendência)
    for (let j = 0; j < 5 && (i + j) < rows.length; j++) {
      const currentRow = rows[i + j];
      if (!currentRow || !currentRow[1]) continue;

      const periodo = currentRow[1].toString().toLowerCase();

      if (periodo.includes('tendência') || periodo.includes('tendencia')) {
        tendencia = parseRow(currentRow);
        console.log(`  📈 Tendência encontrada`);
      } else if (periodo.includes('semana')) {
        const weekData = parseRow(currentRow);
        weeks.push(weekData);
        console.log(`  📅 ${currentRow[1]}`);
      }
    }

    if (weeks.length > 0) {
      products.push({
        name: productName,
        weeks,
        tendencia
      });
      console.log(`  ✅ ${productName}: ${weeks.length} semanas`);
    }

    i += 5;
  }

  console.log(`✅ Total: ${products.length} produtos`);
  return products;
}

export async function fetchSheetData(month: string): Promise<ProductData[]> {
  console.log('🔄 Buscando dados do Google Sheets via CSV público');
  console.log('📅 Mês:', month);

  const sheetName = SHEET_NAMES[month];
  if (!sheetName) {
    throw new Error(`Mês inválido: ${month}. Use: ${Object.keys(SHEET_NAMES).join(', ')}`);
  }

  // URL para exportar como CSV público
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  console.log('📋 Aba:', sheetName);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/csv',
      },
    });

    console.log('📡 Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro:', errorText);
      throw new Error(`Erro ${response.status}: Não foi possível acessar a planilha`);
    }

    const csvText = await response.text();
    console.log('✅ CSV recebido:', csvText.length, 'caracteres');

    if (!csvText || csvText.length < 100) {
      throw new Error('Dados vazios ou inválidos da planilha');
    }

    const rows = parseCSV(csvText);
    console.log('✅ Linhas parseadas:', rows.length);

    const parsed = parseSheetData(rows);
    console.log('✅ Produtos parseados:', parsed.length);

    return parsed;
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    throw error;
  }
}
