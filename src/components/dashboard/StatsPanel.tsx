import type { ProductData } from '@/types/dashboard';

interface StatsPanelProps {
  data: ProductData;
  monetizacaoData?: {
    totalVendas: number;
    totalEntradas: number;
  };
}

export function StatsPanel({ data, monetizacaoData }: StatsPanelProps) {
  const { semanas, tendencia } = data;

  // Garantir que semanas existe e é um array antes de fazer reduce
  const semanasArray = Array.isArray(semanas) ? semanas : [];

  const totalFaturamentoTrafego = semanasArray.reduce((sum, s) => sum + (s?.faturamentoTrafego || 0), 0);
  const totalInvestido = semanasArray.reduce((sum, s) => sum + (s?.investido || 0), 0);
  const totalRoasTrafego = semanasArray.reduce((sum, s) => sum + (s?.roasTrafego || 0), 0);

  // Use dados de monetização do banco de dados (Supabase) se disponível
  const totalVendaMonetizacao = monetizacaoData?.totalVendas ?? 0;
  const totalEntradas = monetizacaoData?.totalEntradas ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4 max-md:gap-2">{/* ... keep existing code */}
      {/* Aquisição */}
      <div className="bg-[hsl(var(--bg-secondary))] p-4 rounded-xl border-l-4 border-[hsl(var(--accent-secondary))] max-md:p-3">
        <div className="text-lg font-extrabold text-[hsl(var(--text-primary))] mb-3 uppercase tracking-wide flex items-center gap-2 max-md:text-base">
          <span>🎯</span>
          <span>AQUISIÇÃO</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-[hsl(var(--border-color))] max-md:py-1.5">
          <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">💰 Faturamento Tráfego</span>
          <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
            R$ {totalFaturamentoTrafego.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-[hsl(var(--border-color))] max-md:py-1.5">
          <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">💸 Investimento</span>
          <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
            R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 max-md:py-1.5">
          <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">📊 Lucro Tráfego</span>
          <span className={`text-lg font-extrabold max-md:text-base ${totalRoasTrafego >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
            R$ {totalRoasTrafego.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Tendência Aquisição */}
      {tendencia && (
        <div className="bg-[hsl(var(--bg-primary))] p-4 rounded-xl border-l-[3px] border-dashed border-[hsl(var(--accent-secondary))] opacity-95 max-md:p-3">
          <div className="text-base font-extrabold text-[hsl(var(--text-secondary))] mb-3 uppercase tracking-wide flex items-center gap-2 max-md:text-sm">
            <span>📈</span>
            <span>TENDÊNCIA AQUISIÇÃO</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[hsl(var(--border-color))] max-md:py-1.5">
            <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">💰 Faturamento Tráfego</span>
            <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
              R$ {(tendencia.faturamentoTrafego || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[hsl(var(--border-color))] max-md:py-1.5">
            <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">💸 Investimento</span>
            <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
              R$ {(tendencia.investido || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between items-center py-2 max-md:py-1.5">
            <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">📊 Lucro Tráfego</span>
            <span className={`text-lg font-extrabold max-md:text-base ${(tendencia.roasTrafego || 0) >= 0 ? 'text-[hsl(var(--success))]' : 'text-[hsl(var(--danger))]'}`}>
              R$ {(tendencia.roasTrafego || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Monetização */}
      <div className="bg-[hsl(var(--bg-secondary))] p-4 rounded-xl border-l-4 border-[hsl(var(--success))] max-md:p-3">
        <div className="text-lg font-extrabold text-[hsl(var(--text-primary))] mb-3 uppercase tracking-wide flex items-center gap-2 max-md:text-base">
          <span>💵</span>
          <span>MONETIZAÇÃO</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-[hsl(var(--border-color))] max-md:py-1.5">
          <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">💳 Faturamento Monetização</span>
          <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
            R$ {totalVendaMonetizacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 max-md:py-1.5">
          <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">📥 Entradas</span>
          <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
            R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Tendência Monetização - Desabilitado (dados vêm do banco, não tem tendência) */}
      {false && tendencia && (
        <div className="bg-[hsl(var(--bg-primary))] p-4 rounded-xl border-l-[3px] border-dashed border-[hsl(var(--success))] opacity-95 max-md:p-3">
          <div className="text-base font-extrabold text-[hsl(var(--text-secondary))] mb-3 uppercase tracking-wide flex items-center gap-2 max-md:text-sm">
            <span>📈</span>
            <span>TENDÊNCIA MONETIZAÇÃO</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-[hsl(var(--border-color))] max-md:py-1.5">
            <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">💳 Faturamento Monetização</span>
            <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
              R$ 0
            </span>
          </div>

          <div className="flex justify-between items-center py-2 max-md:py-1.5">
            <span className="text-[hsl(var(--text-secondary))] text-sm font-semibold max-md:text-xs">📥 Entradas</span>
            <span className="text-[hsl(var(--text-primary))] text-lg font-extrabold max-md:text-base">
              R$ 0
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
