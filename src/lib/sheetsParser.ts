/**
 * 🔄 GOOGLE SHEETS DATA PARSER
 *
 * Converte dados brutos do Google Sheets para o formato do dashboard
 */

import type { FunnelData, MonthData } from '@/types/dashboard';

/**
 * Converter string para número, removendo símbolos
 */
function parseNumber(value: string | undefined): number {
  if (!value) return 0;

  // Remove R$, %, pontos, vírgulas e espaços
  const cleaned = value
    .toString()
    .replace(/[R$%\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Converter string para porcentagem (0-100)
 */
function parsePercentage(value: string | undefined): number {
  if (!value) return 0;
  const num = parseNumber(value);
  // Se o valor já está em % (ex: "15"), retorna direto
  // Se está em decimal (ex: "0.15"), multiplica por 100
  return num > 1 ? num : num * 100;
}

/**
 * Converter string de data para Date
 */
function parseDate(value: string | undefined): Date {
  if (!value) return new Date();

  try {
    // Tenta formatos: DD/MM/YYYY, YYYY-MM-DD, etc
    const [day, month, year] = value.split('/');
    if (day && month && year) {
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date(value);
  } catch {
    return new Date();
  }
}

/**
 * Parser para aba de Funil Geral
 *
 * Formato esperado:
 * | Funil | Impressões | Cliques | Leads | Vendas | Investimento | Receita |
 */
export function parseFunnelData(rows: string[][]): FunnelData[] {
  if (!rows || rows.length < 2) {
    console.warn('⚠️ Dados de funil vazios ou insuficientes');
    return [];
  }

  // Primeira linha é header, pular
  const dataRows = rows.slice(1);

  return dataRows
    .filter(row => row[0]) // Filtrar linhas vazias
    .map((row, index) => {
      const [
        name,
        impressions,
        clicks,
        leads,
        sales,
        investment,
        revenue,
        ctr,
        conversionRate,
        roi,
        roas,
        cpl,
        cpa
      ] = row;

      return {
        id: `funil-${index + 1}`,
        name: name || `Funil ${index + 1}`,
        impressions: parseNumber(impressions),
        clicks: parseNumber(clicks),
        leads: parseNumber(leads),
        sales: parseNumber(sales),
        investment: parseNumber(investment),
        revenue: parseNumber(revenue),
        ctr: ctr ? parsePercentage(ctr) : (parseNumber(clicks) / parseNumber(impressions)) * 100,
        conversionRate: conversionRate ? parsePercentage(conversionRate) : (parseNumber(sales) / parseNumber(leads)) * 100,
        roi: roi ? parsePercentage(roi) : ((parseNumber(revenue) - parseNumber(investment)) / parseNumber(investment)) * 100,
        roas: roas ? parseNumber(roas) : parseNumber(revenue) / parseNumber(investment),
        cpl: cpl ? parseNumber(cpl) : parseNumber(investment) / parseNumber(leads),
        cpa: cpa ? parseNumber(cpa) : parseNumber(investment) / parseNumber(sales),
      };
    });
}

/**
 * Parser para aba de Dados Mensais
 *
 * Formato esperado:
 * | Mês | Funil | Impressões | Cliques | Leads | Vendas | Investimento | Receita |
 */
export function parseMonthlyData(rows: string[][]): MonthData[] {
  if (!rows || rows.length < 2) {
    console.warn('⚠️ Dados mensais vazios ou insuficientes');
    return [];
  }

  const dataRows = rows.slice(1);
  const monthlyMap = new Map<string, FunnelData[]>();

  dataRows
    .filter(row => row[0]) // Filtrar linhas vazias
    .forEach((row, index) => {
      const [
        month,
        funnelName,
        impressions,
        clicks,
        leads,
        sales,
        investment,
        revenue,
      ] = row;

      if (!month || !funnelName) return;

      const funnelData: FunnelData = {
        id: `${month}-funil-${index}`,
        name: funnelName,
        impressions: parseNumber(impressions),
        clicks: parseNumber(clicks),
        leads: parseNumber(leads),
        sales: parseNumber(sales),
        investment: parseNumber(investment),
        revenue: parseNumber(revenue),
        ctr: (parseNumber(clicks) / parseNumber(impressions)) * 100,
        conversionRate: (parseNumber(sales) / parseNumber(leads)) * 100,
        roi: ((parseNumber(revenue) - parseNumber(investment)) / parseNumber(investment)) * 100,
        roas: parseNumber(revenue) / parseNumber(investment),
        cpl: parseNumber(investment) / parseNumber(leads),
        cpa: parseNumber(investment) / parseNumber(sales),
      };

      if (!monthlyMap.has(month)) {
        monthlyMap.set(month, []);
      }
      monthlyMap.get(month)!.push(funnelData);
    });

  return Array.from(monthlyMap.entries()).map(([month, funnels]) => ({
    month,
    funnels,
  }));
}

/**
 * Parser genérico - detecta automaticamente o formato
 */
export function parseSheetData(rows: string[][], sheetType: 'funnel' | 'monthly' = 'funnel'): any {
  if (sheetType === 'monthly') {
    return parseMonthlyData(rows);
  }
  return parseFunnelData(rows);
}

/**
 * Validar se os dados do sheet estão no formato esperado
 */
export function validateSheetFormat(
  rows: string[][],
  requiredColumns: string[]
): { valid: boolean; message?: string } {
  if (!rows || rows.length === 0) {
    return { valid: false, message: 'Planilha vazia' };
  }

  const headers = rows[0];
  const missingColumns = requiredColumns.filter(
    col => !headers.some(h => h.toLowerCase().includes(col.toLowerCase()))
  );

  if (missingColumns.length > 0) {
    return {
      valid: false,
      message: `Colunas faltando: ${missingColumns.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Obter resumo dos dados carregados
 */
export function getDataSummary(funnels: FunnelData[]) {
  return {
    totalFunnels: funnels.length,
    totalImpressions: funnels.reduce((sum, f) => sum + f.impressions, 0),
    totalClicks: funnels.reduce((sum, f) => sum + f.clicks, 0),
    totalLeads: funnels.reduce((sum, f) => sum + f.leads, 0),
    totalSales: funnels.reduce((sum, f) => sum + f.sales, 0),
    totalInvestment: funnels.reduce((sum, f) => sum + f.investment, 0),
    totalRevenue: funnels.reduce((sum, f) => sum + f.revenue, 0),
  };
}
