import { ProductData } from '@/types/dashboard';

interface TotaisGerais {
  faturamentoTotal: number;
  faturamentoTendencia: number;
  lucroTotal: number;
  lucroTendencia: number;
  roasFunilMedio: number;
  roasFunilTendencia: number;
}

interface TotaisGeraisProps {
  productData: ProductData | undefined;
  productName: string;
}

function calcularTotaisGerais(productData: ProductData | undefined): TotaisGerais {
  if (!productData) {
    return {
      faturamentoTotal: 0,
      faturamentoTendencia: 0,
      lucroTotal: 0,
      lucroTendencia: 0,
      roasFunilMedio: 0,
      roasFunilTendencia: 0
    };
  }

  let faturamentoTotal = 0;
  let lucroTotal = 0;
  let roasFunilSoma = 0;

  productData.semanas.forEach(semana => {
    faturamentoTotal += semana.faturamentoFunil;
    lucroTotal += semana.lucroFunil;
    roasFunilSoma += semana.roasFunil;
  });

  const faturamentoTendencia = productData.tendencia?.faturamentoFunil || 0;
  const lucroTendencia = productData.tendencia?.lucroFunil || 0;
  const roasFunilMedio = productData.semanas.length > 0 ? roasFunilSoma / productData.semanas.length : 0;
  const roasFunilTendencia = productData.tendencia?.roasFunil || 0;

  return {
    faturamentoTotal,
    faturamentoTendencia,
    lucroTotal,
    lucroTendencia,
    roasFunilMedio,
    roasFunilTendencia
  };
}

export function TotaisGerais({ productData, productName }: TotaisGeraisProps) {
  const totais = calcularTotaisGerais(productData);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="w-full mt-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-foreground">
        💰 TOTAIS - {productName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">💵</span>
            <h3 className="text-sm font-semibold opacity-90">Faturamento Total</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totais.faturamentoTotal)}</p>
          <p className="text-xs mt-2 opacity-80">(Soma das 4 semanas)</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📈</span>
            <h3 className="text-sm font-semibold opacity-90">Tendência Faturamento</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totais.faturamentoTendencia)}</p>
          <p className="text-xs mt-2 opacity-80">(Projeção próximo período)</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">💰</span>
            <h3 className="text-sm font-semibold opacity-90">Lucro Total</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totais.lucroTotal)}</p>
          <p className="text-xs mt-2 opacity-80">(Soma das 4 semanas)</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📊</span>
            <h3 className="text-sm font-semibold opacity-90">Tendência Lucro</h3>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totais.lucroTendencia)}</p>
          <p className="text-xs mt-2 opacity-80">(Projeção próximo período)</p>
        </div>

        <div className={`bg-gradient-to-br ${totais.roasFunilMedio >= 2 ? 'from-green-500 to-green-600' : totais.roasFunilMedio >= 1 ? 'from-yellow-500 to-yellow-600' : 'from-red-500 to-red-600'} rounded-lg p-6 text-white shadow-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🎯</span>
            <h3 className="text-sm font-semibold opacity-90">ROAS do Funil (Média)</h3>
          </div>
          <p className="text-3xl font-bold">{totais.roasFunilMedio.toFixed(2)}x</p>
          <p className="text-xs mt-2 opacity-80">(Média das 4 semanas)</p>
        </div>

        <div className={`bg-gradient-to-br ${totais.roasFunilTendencia >= 2 ? 'from-teal-500 to-teal-600' : totais.roasFunilTendencia >= 1 ? 'from-amber-500 to-amber-600' : 'from-rose-500 to-rose-600'} rounded-lg p-6 text-white shadow-lg`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">📈</span>
            <h3 className="text-sm font-semibold opacity-90">Tendência ROAS</h3>
          </div>
          <p className="text-3xl font-bold">{totais.roasFunilTendencia.toFixed(2)}x</p>
          <p className="text-xs mt-2 opacity-80">(Projeção próximo período)</p>
        </div>
      </div>
    </div>
  );
}
