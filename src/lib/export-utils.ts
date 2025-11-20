import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import type { ProductData } from '@/types/dashboard';

// ===================================
// EXPORTAR PARA PDF
// ===================================

export async function exportToPDF(elementId: string, fileName: string = 'dashboard.pdf') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado para exportar');
    }

    // Capturar o elemento como imagem
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#0f172a'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(fileName);

    return { success: true, message: 'PDF exportado com sucesso!' };
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    return { success: false, message: 'Erro ao exportar PDF' };
  }
}

// ===================================
// EXPORTAR PARA EXCEL
// ===================================

interface ExportExcelData {
  productName: string;
  productData: ProductData;
}

export function exportToExcel(data: ExportExcelData, fileName: string = 'dashboard.xlsx') {
  try {
    const { productName, productData } = data;

    if (!productData) {
      throw new Error('Dados do produto não disponíveis');
    }

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Dados por Semana
    const semanasData = productData.semanas.map((semana, index) => ({
      'Semana': `Semana ${index + 1}`,
      'Investido': semana.investido,
      'Fat. Tráfego': semana.faturamentoTrafego,
      'ROAS Tráfego': semana.roasTrafego,
      'Alunos': semana.alunos,
      'Formulários': semana.formularios,
      'Taxa Preench.': semana.taxaPreenchimento,
      'Qualificados': semana.qualificados,
      'Agendados': semana.agendados,
      'Taxa Agend.': semana.taxaAgendamento,
      'Call Realiz.': semana.callRealizada,
      'Taxa Comp.': semana.taxaComparecimento,
      'Vendas': semana.numeroVenda,
      'Taxa Conv.': semana.taxaConversao,
      'Taxa Asc.': semana.taxaAscensao,
      'Venda Monet.': semana.vendaMonetizacao,
      'Entradas': semana.entradas,
      'Fat. Funil': semana.faturamentoFunil,
      'ROAS Funil': semana.roasFunil,
      'Lucro': semana.lucroFunil
    }));

    // Adicionar linha de tendência se existir
    if (productData.tendencia) {
      semanasData.push({
        'Semana': 'Tendência',
        'Investido': productData.tendencia.investido,
        'Fat. Tráfego': productData.tendencia.faturamentoTrafego,
        'ROAS Tráfego': productData.tendencia.roasTrafego,
        'Alunos': productData.tendencia.alunos,
        'Formulários': productData.tendencia.formularios,
        'Taxa Preench.': productData.tendencia.taxaPreenchimento,
        'Qualificados': productData.tendencia.qualificados,
        'Agendados': productData.tendencia.agendados,
        'Taxa Agend.': productData.tendencia.taxaAgendamento,
        'Call Realiz.': productData.tendencia.callRealizada,
        'Taxa Comp.': productData.tendencia.taxaComparecimento,
        'Vendas': productData.tendencia.numeroVenda,
        'Taxa Conv.': productData.tendencia.taxaConversao,
        'Taxa Asc.': productData.tendencia.taxaAscensao,
        'Venda Monet.': productData.tendencia.vendaMonetizacao,
        'Entradas': productData.tendencia.entradas,
        'Fat. Funil': productData.tendencia.faturamentoFunil,
        'ROAS Funil': productData.tendencia.roasFunil,
        'Lucro': productData.tendencia.lucroFunil
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(semanasData);

    // Ajustar largura das colunas
    const colWidths = Object.keys(semanasData[0]).map(() => ({ wch: 12 }));
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, productName.substring(0, 31));

    // Sheet 2: Totais
    const totaisData = [{
      'Métrica': 'Faturamento Total',
      'Valor': productData.semanas.reduce((sum, s) => sum + s.faturamentoFunil, 0)
    }, {
      'Métrica': 'Lucro Total',
      'Valor': productData.semanas.reduce((sum, s) => sum + s.lucroFunil, 0)
    }, {
      'Métrica': 'Investido Total',
      'Valor': productData.semanas.reduce((sum, s) => sum + s.investido, 0)
    }, {
      'Métrica': 'ROAS Médio',
      'Valor': productData.semanas.reduce((sum, s) => sum + s.roasFunil, 0) / productData.semanas.length
    }, {
      'Métrica': 'Total Vendas',
      'Valor': productData.semanas.reduce((sum, s) => sum + s.numeroVenda, 0)
    }];

    const totaisWorksheet = XLSX.utils.json_to_sheet(totaisData);
    XLSX.utils.book_append_sheet(workbook, totaisWorksheet, 'Totais');

    XLSX.writeFile(workbook, fileName);

    return { success: true, message: 'Excel exportado com sucesso!' };
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    return { success: false, message: 'Erro ao exportar Excel' };
  }
}

// ===================================
// EXPORTAR PARA CSV
// ===================================

export function exportToCSV(data: ExportExcelData, fileName: string = 'dashboard.csv') {
  try {
    const { productData } = data;

    if (!productData) {
      throw new Error('Dados do produto não disponíveis');
    }

    // Cabeçalhos
    const headers = [
      'Semana',
      'Investido',
      'Fat. Tráfego',
      'ROAS Tráfego',
      'Alunos',
      'Formulários',
      'Taxa Preench.',
      'Qualificados',
      'Agendados',
      'Taxa Agend.',
      'Call Realiz.',
      'Taxa Comp.',
      'Vendas',
      'Taxa Conv.',
      'Taxa Asc.',
      'Venda Monet.',
      'Entradas',
      'Fat. Funil',
      'ROAS Funil',
      'Lucro'
    ];

    // Dados
    const rows = productData.semanas.map((semana, index) => [
      `Semana ${index + 1}`,
      semana.investido,
      semana.faturamentoTrafego,
      semana.roasTrafego,
      semana.alunos,
      semana.formularios,
      semana.taxaPreenchimento,
      semana.qualificados,
      semana.agendados,
      semana.taxaAgendamento,
      semana.callRealizada,
      semana.taxaComparecimento,
      semana.numeroVenda,
      semana.taxaConversao,
      semana.taxaAscensao,
      semana.vendaMonetizacao,
      semana.entradas,
      semana.faturamentoFunil,
      semana.roasFunil,
      semana.lucroFunil
    ]);

    // Adicionar tendência
    if (productData.tendencia) {
      rows.push([
        'Tendência',
        productData.tendencia.investido,
        productData.tendencia.faturamentoTrafego,
        productData.tendencia.roasTrafego,
        productData.tendencia.alunos,
        productData.tendencia.formularios,
        productData.tendencia.taxaPreenchimento,
        productData.tendencia.qualificados,
        productData.tendencia.agendados,
        productData.tendencia.taxaAgendamento,
        productData.tendencia.callRealizada,
        productData.tendencia.taxaComparecimento,
        productData.tendencia.numeroVenda,
        productData.tendencia.taxaConversao,
        productData.tendencia.taxaAscensao,
        productData.tendencia.vendaMonetizacao,
        productData.tendencia.entradas,
        productData.tendencia.faturamentoFunil,
        productData.tendencia.roasFunil,
        productData.tendencia.lucroFunil
      ]);
    }

    // Converter para CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    return { success: true, message: 'CSV exportado com sucesso!' };
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    return { success: false, message: 'Erro ao exportar CSV' };
  }
}

// ===================================
// COMPARTILHAR LINK
// ===================================

export function shareLink(currentMonth: string, currentProduct: string, currentWeek: string) {
  try {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      month: currentMonth,
      product: currentProduct,
      week: currentWeek
    });

    const shareUrl = `${baseUrl}?${params.toString()}`;

    // Copiar para clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      return { success: true, message: 'Link copiado para a área de transferência!' };
    }).catch(() => {
      // Fallback para navegadores mais antigos
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      return { success: true, message: 'Link copiado!' };
    });

    return { success: true, message: 'Link copiado!', url: shareUrl };
  } catch (error) {
    console.error('Erro ao compartilhar link:', error);
    return { success: false, message: 'Erro ao compartilhar link' };
  }
}
