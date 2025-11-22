import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import type { Month } from '@/types/dashboard';
import { MonthSelector } from '@/components/dashboard/MonthSelector';

interface RelatorioModuleProps {
  currentMonth: Month;
  onMonthSelect: (month: Month) => void;
}

type DataType = 'aquisicao' | 'monetizacao' | 'closers' | 'funis' | 'vendas';

export function RelatorioModule({ currentMonth, onMonthSelect }: RelatorioModuleProps) {
  const [selectedDataTypes, setSelectedDataTypes] = useState<DataType[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [exporting, setExporting] = useState(false);

  const dataTypes: Array<{ id: DataType; label: string; description: string }> = [
    { id: 'aquisicao', label: 'Aquisicao', description: 'Dados de funis de aquisicao' },
    { id: 'monetizacao', label: 'Monetizacao', description: 'Resumo geral de monetizacao' },
    { id: 'closers', label: 'Closers', description: 'Lista de closers e metricas' },
    { id: 'funis', label: 'Funis', description: 'Produtos/funis cadastrados' },
    { id: 'vendas', label: 'Vendas', description: 'Historico de vendas' },
  ];

  const toggleDataType = (id: DataType) => {
    setSelectedDataTypes((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedDataTypes.length === 0) {
      alert('Selecione pelo menos um tipo de dado para exportar');
      return;
    }

    setExporting(true);

    // TODO: Implementar exportacao real
    setTimeout(() => {
      // Simular download de CSV
      const csvContent = 'data:text/csv;charset=utf-8,Tipo,Dado\nExemplo,Valor';
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `relatorio_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExporting(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-400" />
            Relatorio
          </h1>
          <p className="text-slate-400 mt-1">Exporte dados em formato CSV</p>
        </div>

        <MonthSelector currentMonth={currentMonth} onMonthSelect={onMonthSelect} />
      </div>

      {/* Data Selection */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          Selecione os dados para exportar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => toggleDataType(type.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedDataTypes.includes(type.id)
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    selectedDataTypes.includes(type.id)
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-slate-500'
                  }`}
                >
                  {selectedDataTypes.includes(type.id) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <span className="text-white font-medium">{type.label}</span>
              </div>
              <p className="text-slate-400 text-sm ml-6">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-400" />
          Periodo (opcional)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Data inicial</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">Data final</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={exporting || selectedDataTypes.length === 0}
          className={`flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-medium transition-all ${
            selectedDataTypes.length === 0
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
          }`}
        >
          <Download className={`w-5 h-5 ${exporting ? 'animate-bounce' : ''}`} />
          {exporting ? 'Exportando...' : 'Exportar CSV'}
        </button>
      </div>

      {/* Selected Summary */}
      {selectedDataTypes.length > 0 && (
        <div className="text-center text-slate-400 text-sm">
          {selectedDataTypes.length} tipo(s) de dado selecionado(s)
        </div>
      )}
    </div>
  );
}
