/**
 * 📊 GOOGLE SHEETS API SERVICE
 *
 * Serviço para integração com Google Sheets API v4
 * Busca dados reais da planilha de funis
 */

const GOOGLE_SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

/**
 * Interface para dados brutos do Google Sheets
 */
export interface SheetRawData {
  range: string;
  majorDimension: string;
  values: string[][];
}

/**
 * Interface para resposta da API do Google Sheets
 */
export interface GoogleSheetsResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

/**
 * Buscar dados de uma aba específica do Google Sheets
 *
 * @param sheetName - Nome da aba (ex: "Funil Geral", "ROI", "Custos")
 * @param range - Intervalo de células (ex: "A1:Z100")
 * @returns Dados da planilha
 */
export async function fetchSheetData(
  sheetName: string,
  range: string = 'A1:Z1000'
): Promise<string[][]> {
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error('❌ Google Sheets API Key não configurada. Configure VITE_GOOGLE_SHEETS_API_KEY no .env');
  }

  if (!SPREADSHEET_ID) {
    throw new Error('❌ Google Spreadsheet ID não configurado. Configure VITE_GOOGLE_SPREADSHEET_ID no .env');
  }

  const fullRange = `${sheetName}!${range}`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${fullRange}?key=${GOOGLE_SHEETS_API_KEY}`;

  try {
    console.log(`📊 Buscando dados: ${fullRange}`);

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro Google Sheets API:', error);

      if (response.status === 403) {
        throw new Error('❌ Acesso negado. Verifique se a planilha está pública ou se a API Key está correta.');
      }

      if (response.status === 404) {
        throw new Error(`❌ Aba "${sheetName}" não encontrada na planilha.`);
      }

      throw new Error(`❌ Erro ao buscar dados: ${error.error?.message || response.statusText}`);
    }

    const data: GoogleSheetsResponse = await response.json();

    if (!data.values || data.values.length === 0) {
      console.warn(`⚠️ Aba "${sheetName}" está vazia`);
      return [];
    }

    console.log(`✅ Dados carregados: ${data.values.length} linhas da aba "${sheetName}"`);
    return data.values;

  } catch (error) {
    console.error('❌ Erro ao buscar Google Sheets:', error);
    throw error;
  }
}

/**
 * Buscar múltiplas abas de uma vez
 *
 * @param sheets - Array de objetos com {name, range}
 * @returns Objeto com dados de cada aba
 */
export async function fetchMultipleSheets(
  sheets: { name: string; range?: string }[]
): Promise<Record<string, string[][]>> {
  const results: Record<string, string[][]> = {};

  // Buscar todas as abas em paralelo
  await Promise.all(
    sheets.map(async (sheet) => {
      try {
        const data = await fetchSheetData(sheet.name, sheet.range);
        results[sheet.name] = data;
      } catch (error) {
        console.error(`❌ Erro ao buscar aba "${sheet.name}":`, error);
        results[sheet.name] = [];
      }
    })
  );

  return results;
}

/**
 * Verificar se a configuração do Google Sheets está OK
 *
 * @returns true se configurado corretamente
 */
export function isGoogleSheetsConfigured(): boolean {
  return !!(GOOGLE_SHEETS_API_KEY && SPREADSHEET_ID);
}

/**
 * Obter informações da configuração
 */
export function getGoogleSheetsConfig() {
  return {
    hasApiKey: !!GOOGLE_SHEETS_API_KEY,
    hasSpreadsheetId: !!SPREADSHEET_ID,
    spreadsheetId: SPREADSHEET_ID,
    isConfigured: isGoogleSheetsConfigured(),
  };
}
