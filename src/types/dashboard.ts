export interface Month {
  id: string;
  name: string;
  gid: string;
  startDate: string;
  endDate: string;
}

export interface Product {
  id: string;
  name: string;
  icon: string;
  team: 'geral' | 'cleiton' | 'julia';
}

export interface WeekData {
  funil?: string;                // Coluna A - Funil (opcional)
  periodo?: string;              // Coluna B - Período (opcional)
  investido: number;
  faturamentoTrafego: number;
  roasTrafego: number;
  alunos: number;
  formularios: number;           // Coluna G - Número de formulários
  taxaPreenchimento: number;     // Coluna H - Taxa de preenchimento
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
  roasFunil: number;             // Coluna T - ROAS do Funil
  lucroFunil: number;
}

export interface ProductData {
  semanas: WeekData[];
  tendencia: WeekData | null;
}

export interface AllData {
  [productId: string]: ProductData;
}

export interface FunnelData {
  alunos: number;
  formularios: number;
  qualificados: number;
  agendados: number;
  callRealizada: number;
  vendas: number;
}

export type ModuleName =
  | 'dashboard'
  | 'resumo'
  | 'roi';

export type ThemeName = 'dark' | 'light' | 'blue' | 'green' | 'purple';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
