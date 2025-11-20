import { useState } from 'react';
import { exportToPDF, exportToExcel, exportToCSV, shareLink } from '@/lib/export-utils';
import type { AllData } from '@/types/dashboard';

interface ExportarModuleProps {
  allData: AllData;
  currentMonth: string;
  currentProduct: string;
  currentWeek: string;
}

export function ExportarModule({
  allData,
  currentMonth,
  currentProduct,
  currentWeek
}: ExportarModuleProps) {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const productData = allData[currentProduct];
  const exportOptions = [
    {
      icon: '📄',
      title: 'Exportar PDF',
      description: 'Gere um relatório completo em PDF',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: '📊',
      title: 'Exportar Excel',
      description: 'Baixe todos os dados em planilha',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: '📋',
      title: 'Exportar CSV',
      description: 'Arquivo CSV para análise de dados',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: '🔗',
      title: 'Compartilhar Link',
      description: 'Gere um link para compartilhar',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const handleExportPDF = async () => {
    setExporting(true);
    setProgress(0);
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await exportToPDF('root', `${currentProduct}_${currentMonth}.pdf`);

      clearInterval(interval);
      setProgress(100);

      if (result.success) {
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Erro ao exportar:', error);
      alert('❌ Erro ao exportar PDF');
    } finally {
      setTimeout(() => {
        setExporting(false);
        setProgress(0);
      }, 500);
    }
  };

  const handleExportExcel = async () => {
    if (!productData) {
      alert('❌ Nenhum dado disponível para exportar');
      return;
    }

    try {
      const result = exportToExcel(
        { productName: currentProduct, productData },
        `${currentProduct}_${currentMonth}.xlsx`
      );

      if (result.success) {
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      alert('❌ Erro ao exportar Excel');
    }
  };

  const handleExportCSV = async () => {
    if (!productData) {
      alert('❌ Nenhum dado disponível para exportar');
      return;
    }

    try {
      const result = exportToCSV(
        { productName: currentProduct, productData },
        `${currentProduct}_${currentMonth}.csv`
      );

      if (result.success) {
        alert('✅ ' + result.message);
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('❌ Erro ao exportar CSV');
    }
  };

  const handleShareLink = () => {
    const result = shareLink(currentMonth, currentProduct, currentWeek);
    if (result.success) {
      alert('✅ ' + result.message + '\n\n' + result.url);
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleExport = (type: string) => {
    switch (type) {
      case 'Exportar Excel':
        handleExportExcel();
        break;
      case 'Exportar CSV':
        handleExportCSV();
        break;
      case 'Compartilhar Link':
        handleShareLink();
        break;
      default:
        alert(`Funcionalidade de ${type} em desenvolvimento!`);
    }
  };

  return (
    <div>
      <div className="text-center mb-10 p-5">
        <h1 className="text-[3.5rem] bg-gradient-to-r from-[hsl(var(--accent-primary))] to-[hsl(var(--accent-secondary))] bg-clip-text text-transparent mb-[15px] font-extrabold max-md:text-[1.8rem]">
          📥 EXPORTAR DADOS
        </h1>
        <p className="text-xl text-[hsl(var(--text-secondary))] mb-2.5 max-md:text-sm">
          Exporte seus dados em diferentes formatos
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="relative group overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[280px]"
        >
          {/* Progress overlay */}
          {exporting && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          )}
          
          {/* Shimmer effect */}
          {exporting && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          )}
          
          <div className="relative flex items-center justify-center gap-2">
            {exporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Gerando PDF... {progress}%</span>
              </>
            ) : (
              <>
                <span className="text-2xl">📄</span>
                <span>Exportar Relatório em PDF</span>
              </>
            )}
          </div>
        </button>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 mb-[30px] max-md:grid-cols-1">
        {exportOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => handleExport(option.title)}
            className="bg-[hsl(var(--bg-secondary))] p-[30px] rounded-xl border-2 border-[hsl(var(--border-color))] cursor-pointer transition-all duration-300 text-center hover:border-[hsl(var(--accent-primary))] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
          >
            <div className="text-5xl mb-[15px]">{option.icon}</div>
            <div className="text-xl font-bold text-[hsl(var(--text-primary))] mb-2">
              {option.title}
            </div>
            <div className="text-sm text-[hsl(var(--text-secondary))]">
              {option.description}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[hsl(var(--bg-secondary))] p-8 rounded-2xl border-2 border-[hsl(var(--border-color))]">
        <h3 className="text-2xl font-bold text-[hsl(var(--text-primary))] mb-4">
          ℹ️ Informações sobre Exportação
        </h3>
        <div className="text-[hsl(var(--text-secondary))] space-y-3">
          <p>• <strong>PDF:</strong> Ideal para apresentações e relatórios executivos</p>
          <p>• <strong>Excel:</strong> Perfeito para análises detalhadas e gráficos personalizados</p>
          <p>• <strong>CSV:</strong> Formato universal compatível com qualquer ferramenta de análise</p>
          <p>• <strong>Compartilhar:</strong> Gere um link seguro para compartilhar com sua equipe</p>
        </div>
      </div>
    </div>
  );
}
