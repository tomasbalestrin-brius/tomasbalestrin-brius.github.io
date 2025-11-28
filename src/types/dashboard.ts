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
  | 'aquisicao'
  | 'sdr'
  | 'monetizacao'
  | 'relatorio'
  | 'comparar';

// Tipos para Supabase - Monetização
export interface Closer {
  id: string;
  nome: string;
  foto_url?: string;
  taxa_conversao: number;
  numero_vendas: number;
  valor_total_vendas: number;
  valor_total_entradas: number;
  tempo_empresa?: string;
  time?: string;
  produto_mais_vendido?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Funil {
  id: string;
  nome_produto: string;
  valor_venda: number;
  especialista: string;
  descricao?: string;
  total_vendas: number;
  valor_total_gerado: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
  // Dados de Aquisição do Google Sheets (opcionais)
  investimento?: number;
  faturamento?: number;
  lucro?: number;
  tendencia_faturamento?: number;
  tendencia_lucro?: number;
}

export interface Venda {
  id: string;
  closer_id: string;
  funil_id: string;
  produto: string;
  valor_venda: number;
  valor_entrada: number;
  negociacao?: string;
  data_venda: string;
  created_at: string;
  // Relacionamentos
  closer?: Closer;
  funil?: Funil;
}

export interface FunilAquisicao {
  id: string;
  nome_funil: string;
  investido: number;
  faturamento_trafego: number;
  roas_trafego: number;
  numero_alunos: number;
  periodo: string;
  data_inicio?: string;
  data_fim?: string;
  sheet_id?: string;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  tipo: 'aquisicao' | 'monetizacao';
  status: 'success' | 'error';
  mensagem?: string;
  registros_sincronizados: number;
  created_at: string;
}

export type ThemeName = 'dark' | 'light' | 'blue' | 'green' | 'purple';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
