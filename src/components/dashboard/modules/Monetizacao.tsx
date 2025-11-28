import { useState } from 'react';
import { DollarSign, Users, ShoppingCart, Plus, TrendingUp, Award, Target, X, Edit2, Trash2, Loader2, BarChart3, ArrowRight, Package, Clock, Briefcase, RefreshCcw } from 'lucide-react';
import type { Closer, Funil, Venda } from '@/types/dashboard';
import { useClosers, useFunis, useVendas, useMonetizacaoMetrics, useFunilAquisicao } from '@/hooks/useMonetizacao';

// Lista de produtos disponíveis
const PRODUTOS_DISPONIVEIS = [
  'Mentoria Premium Trimestral',
  'Mentoria Premium Semestral',
  'Mentoria Elite Premium',
  'Implementação Comercial',
  'Implementação de inteligência artificial',
  'Bethel Growth',
  'Ingresso do intensivo',
] as const;

// Modal Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Closer Form
function CloserForm({ closer, onSubmit, onCancel, loading }: {
  closer?: Closer;
  onSubmit: (data: Partial<Closer>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    nome: closer?.nome || '',
    time: closer?.time || '',
    taxa_conversao: closer?.taxa_conversao || 0,
    numero_vendas: closer?.numero_vendas || 0,
    valor_total_vendas: closer?.valor_total_vendas || 0,
    valor_total_entradas: closer?.valor_total_entradas || 0,
    ativo: closer?.ativo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Nome *</label>
        <input
          type="text"
          required
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Time</label>
        <input
          type="text"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Taxa Conversao (%)</label>
          <input
            type="number"
            step="0.1"
            value={formData.taxa_conversao}
            onChange={(e) => setFormData({ ...formData, taxa_conversao: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Numero Vendas</label>
          <input
            type="number"
            value={formData.numero_vendas}
            onChange={(e) => setFormData({ ...formData, numero_vendas: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ativo"
          checked={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
          className="rounded border-slate-700"
        />
        <label htmlFor="ativo" className="text-sm text-slate-400">Ativo</label>
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {closer ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}

// Funil Form
function FunilForm({ funil, onSubmit, onCancel, loading }: {
  funil?: Funil;
  onSubmit: (data: Partial<Funil>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    nome_produto: funil?.nome_produto || '',
    valor_venda: funil?.valor_venda || 0,
    especialista: funil?.especialista || '',
    descricao: funil?.descricao || '',
    total_vendas: funil?.total_vendas || 0,
    valor_total_gerado: funil?.valor_total_gerado || 0,
    ativo: funil?.ativo ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Nome do Produto *</label>
        <input
          type="text"
          required
          value={formData.nome_produto}
          onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Especialista *</label>
        <input
          type="text"
          required
          value={formData.especialista}
          onChange={(e) => setFormData({ ...formData, especialista: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Valor de Venda (R$) *</label>
        <input
          type="number"
          required
          step="0.01"
          value={formData.valor_venda}
          onChange={(e) => setFormData({ ...formData, valor_venda: parseFloat(e.target.value) || 0 })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Descricao</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          rows={3}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="funilAtivo"
          checked={formData.ativo}
          onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
          className="rounded border-slate-700"
        />
        <label htmlFor="funilAtivo" className="text-sm text-slate-400">Ativo</label>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {funil ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}

// Venda Form
function VendaForm({ venda, closers, funis, onSubmit, onCancel, loading }: {
  venda?: Venda;
  closers: Closer[];
  funis: Funil[];
  onSubmit: (data: Partial<Venda>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    closer_id: venda?.closer_id || '',
    funil_id: venda?.funil_id || '',
    produto: venda?.produto || '',
    valor_venda: venda?.valor_venda || 0,
    valor_entrada: venda?.valor_entrada || 0,
    negociacao: venda?.negociacao || '',
    data_venda: venda?.data_venda || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Closer *</label>
        <select
          required
          value={formData.closer_id}
          onChange={(e) => setFormData({ ...formData, closer_id: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        >
          <option value="">Selecione um closer</option>
          {closers.filter(c => c.ativo).map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Produto Vendido *</label>
        <select
          required
          value={formData.produto}
          onChange={(e) => setFormData({ ...formData, produto: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        >
          <option value="">Selecione um produto</option>
          {PRODUTOS_DISPONIVEIS.map((produto) => (
            <option key={produto} value={produto}>{produto}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Funil/Campanha *</label>
        <select
          required
          value={formData.funil_id}
          onChange={(e) => {
            const funil = funis.find(f => f.id === e.target.value);
            setFormData({
              ...formData,
              funil_id: e.target.value,
              valor_venda: funil?.valor_venda || formData.valor_venda,
            });
          }}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        >
          <option value="">Selecione um funil</option>
          {funis.filter(f => f.ativo).map((f) => (
            <option key={f.id} value={f.id}>{f.nome_produto} - R$ {f.valor_venda.toLocaleString('pt-BR')}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Valor Venda (R$)</label>
          <input
            type="number"
            step="0.01"
            value={formData.valor_venda}
            onChange={(e) => setFormData({ ...formData, valor_venda: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Entrada (R$)</label>
          <input
            type="number"
            step="0.01"
            value={formData.valor_entrada}
            onChange={(e) => setFormData({ ...formData, valor_entrada: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Data da Venda *</label>
        <input
          type="date"
          required
          value={formData.data_venda}
          onChange={(e) => setFormData({ ...formData, data_venda: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Negociacao</label>
        <textarea
          value={formData.negociacao}
          onChange={(e) => setFormData({ ...formData, negociacao: e.target.value })}
          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          rows={2}
          placeholder="Observacoes sobre a negociacao..."
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {venda ? 'Salvar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}

// Closer Detail Modal
function CloserDetailModal({ closer, vendas, onEdit, onClose }: {
  closer: Closer;
  vendas: Venda[];
  onEdit: () => void;
  onClose: () => void;
}) {
  // Filter vendas for this closer
  const closerVendas = vendas.filter(v => v.closer_id === closer.id);

  // Calculate products sold by this closer
  const produtosSummary = closerVendas.reduce((acc, venda) => {
    const produto = venda.produto || 'Não especificado';
    if (!acc[produto]) {
      acc[produto] = { quantidade: 0, valor: 0 };
    }
    acc[produto].quantidade++;
    acc[produto].valor += venda.valor_venda;
    return acc;
  }, {} as Record<string, { quantidade: number; valor: number }>);

  const produtosArray = Object.entries(produtosSummary).map(([nome, data]) => ({
    nome,
    ...data,
  })).sort((a, b) => b.valor - a.valor);

  // Calculate time with company (mock - you might want to store this in the database)
  const calcularTempoEmpresa = (createdAt: string) => {
    const inicio = new Date(createdAt);
    const agora = new Date();
    const meses = Math.floor((agora.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24 * 30));
    if (meses < 1) return 'Menos de 1 mês';
    if (meses < 12) return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}${mesesRestantes > 0 ? ` e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white">
                {closer.nome.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{closer.nome}</h2>
                <p className="text-slate-400 text-sm">{closer.time || 'Sem time definido'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar Perfil
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-slate-400 text-sm">Tempo de Empresa</span>
              </div>
              <div className="text-xl font-bold text-white">
                {calcularTempoEmpresa(closer.created_at)}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span className="text-slate-400 text-sm">Cargo</span>
              </div>
              <div className="text-xl font-bold text-white">
                Closer
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-4 h-4 text-green-400" />
                <span className="text-slate-400 text-sm">Total Vendas</span>
              </div>
              <div className="text-xl font-bold text-white">
                {closer.numero_vendas}
              </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="text-slate-400 text-sm">Taxa Conversão</span>
              </div>
              <div className="text-xl font-bold text-white">
                {closer.taxa_conversao}%
              </div>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-2">Valor Total em Vendas</div>
              <div className="text-3xl font-bold text-green-400">
                R$ {closer.valor_total_vendas.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="text-slate-400 text-sm mb-2">Valor Total em Entradas</div>
              <div className="text-3xl font-bold text-yellow-400">
                R$ {closer.valor_total_entradas.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-400" />
              Produtos Aptos a Vender
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRODUTOS_DISPONIVEIS.map((produto) => {
                const vendido = produtosArray.find(p => p.nome === produto);
                return (
                  <div
                    key={produto}
                    className={`p-3 rounded-lg border ${
                      vendido
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{produto}</span>
                      {vendido && (
                        <span className="text-green-400 text-xs font-medium">
                          {vendido.quantidade} venda{vendido.quantidade !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Sales */}
          {closerVendas.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Vendas Recentes ({closerVendas.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {closerVendas.slice(0, 10).map((venda) => (
                  <div key={venda.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div>
                      <div className="text-white font-medium">{venda.produto}</div>
                      <div className="text-slate-400 text-sm">
                        {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        R$ {venda.valor_venda.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-yellow-400 text-sm">
                        Entrada: R$ {venda.valor_entrada.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Detail Modal
function ProductDetailModal({ produto, vendas, closers, onClose }: {
  produto: string;
  vendas: Venda[];
  closers: Closer[];
  onClose: () => void;
}) {
  // Filter vendas for this product
  const produtoVendas = vendas.filter(v => v.produto === produto);

  // Calculate total sales and revenue
  const totalVendas = produtoVendas.length;
  const totalEntradas = produtoVendas.reduce((sum, v) => sum + v.valor_entrada, 0);
  const totalValor = produtoVendas.reduce((sum, v) => sum + v.valor_venda, 0);

  // Calculate top 3 sellers
  const vendedoresSummary = produtoVendas.reduce((acc, venda) => {
    const closerId = venda.closer_id;
    if (!acc[closerId]) {
      acc[closerId] = { quantidade: 0, valor: 0 };
    }
    acc[closerId].quantidade++;
    acc[closerId].valor += venda.valor_venda;
    return acc;
  }, {} as Record<string, { quantidade: number; valor: number }>);

  const top3Vendedores = Object.entries(vendedoresSummary)
    .map(([closerId, data]) => ({
      closer: closers.find(c => c.id === closerId),
      ...data,
    }))
    .filter(item => item.closer)
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{produto}</h2>
            <p className="text-slate-400 text-sm mt-1">Estatísticas do Produto</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Total de Vendas</span>
              </div>
              <div className="text-3xl font-bold text-white">{totalVendas}</div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-400 text-sm">Total de Entradas</span>
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                R$ {totalEntradas.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Top 3 Sellers */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Top 3 Vendedores
            </h3>
            {top3Vendedores.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhuma venda registrada</p>
            ) : (
              <div className="space-y-3">
                {top3Vendedores.map((item, index) => (
                  <div key={item.closer?.id} className="flex items-center gap-4 bg-slate-800/50 rounded-lg p-4">
                    <span className="text-3xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl font-bold text-white">
                      {item.closer?.nome.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium text-lg">{item.closer?.nome}</div>
                      <div className="text-slate-400 text-sm">
                        {item.quantidade} venda{item.quantidade !== 1 ? 's' : ''} •
                        Taxa: {item.closer?.taxa_conversao}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">
                        R$ {item.valor.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-slate-400 text-sm">
                        Média: R$ {(item.valor / item.quantidade).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Sales */}
          {produtoVendas.length > 0 && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Vendas Recentes ({produtoVendas.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {produtoVendas.slice(0, 10).map((venda) => (
                  <div key={venda.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div>
                      <div className="text-white font-medium">{venda.closer?.nome || 'Closer não definido'}</div>
                      <div className="text-slate-400 text-sm">
                        {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        R$ {venda.valor_venda.toLocaleString('pt-BR')}
                      </div>
                      <div className="text-yellow-400 text-sm">
                        Entrada: R$ {venda.valor_entrada.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Funil Detail Modal
function FunilDetailModal({ funil, vendas, onClose }: {
  funil: Funil;
  vendas: Venda[];
  onClose: () => void;
}) {
  const { aquisicaoData, loading: loadingAquisicao } = useFunilAquisicao(funil.id);

  // Filter vendas for this funil
  const funilVendas = vendas.filter(v => v.funil_id === funil.id);

  // Calculate monetização metrics
  const monetizacao = {
    totalVendas: funilVendas.length,
    valorVendas: funilVendas.reduce((sum, v) => sum + (v.valor_venda || 0), 0),
    valorEntradas: funilVendas.reduce((sum, v) => sum + (v.valor_entrada || 0), 0),
  };

  // Calculate totals from Aquisição (Google Sheets only)
  const totais = {
    investimento: aquisicaoData?.investimento || 0,
    faturamento: aquisicaoData?.faturamento || 0,
    roas: 0,
  };
  totais.roas = totais.investimento > 0 ? totais.faturamento / totais.investimento : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{funil.nome_produto}</h2>
            <p className="text-slate-400 text-sm mt-1">{funil.especialista}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loadingAquisicao ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : (
            <>
              {/* Geral */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Geral (Total)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm">Investimento Total</div>
                    <div className="text-2xl font-bold text-white">
                      R$ {totais.investimento.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">Faturamento Total</div>
                    <div className="text-2xl font-bold text-green-400">
                      R$ {totais.faturamento.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm">ROAS Total</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {totais.roas.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Aquisição */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Aquisição</h3>
                    <span className="text-xs text-slate-500">(Google Sheets)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Investimento</span>
                      <span className="text-white font-medium">
                        R$ {(aquisicaoData?.investimento || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Faturamento</span>
                      <span className="text-blue-400 font-medium">
                        R$ {(aquisicaoData?.faturamento || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">ROAS</span>
                      <span className="text-purple-400 font-medium">
                        {(aquisicaoData?.roas || 0).toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Alunos</span>
                      <span className="text-white font-medium">
                        {(aquisicaoData?.alunos || 0).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monetização */}
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Monetização</h3>
                    <span className="text-xs text-slate-500">(Vendas Registradas)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total de Vendas</span>
                      <span className="text-white font-medium">
                        {monetizacao.totalVendas}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Valor de Vendas</span>
                      <span className="text-green-400 font-medium">
                        R$ {monetizacao.valorVendas.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Valor de Entradas</span>
                      <span className="text-yellow-400 font-medium">
                        R$ {monetizacao.valorEntradas.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Ticket Médio</span>
                      <span className="text-white font-medium">
                        R$ {monetizacao.totalVendas > 0
                          ? (monetizacao.valorVendas / monetizacao.totalVendas).toLocaleString('pt-BR', { maximumFractionDigits: 2 })
                          : '0'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendas List */}
              {funilVendas.length > 0 && (
                <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Vendas Recentes ({funilVendas.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {funilVendas.slice(0, 10).map((venda) => (
                      <div key={venda.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                        <div>
                          <div className="text-white font-medium">{venda.closer?.nome || 'Closer não definido'}</div>
                          <div className="text-slate-400 text-sm">
                            {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-medium">
                            R$ {venda.valor_venda.toLocaleString('pt-BR')}
                          </div>
                          <div className="text-yellow-400 text-sm">
                            Entrada: R$ {venda.valor_entrada.toLocaleString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function MonetizacaoModule() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'closers' | 'funis' | 'produtos' | 'vendas'>('dashboard');

  // Hooks
  const { closers, loading: loadingClosers, createCloser, updateCloser, deleteCloser } = useClosers();
  const { funis, loading: loadingFunis, syncing: syncingFunis, forceSyncFromSheets, createFunil, updateFunil, deleteFunil } = useFunis();
  const { vendas, loading: loadingVendas, createVenda, updateVenda, deleteVenda } = useVendas();
  const { metrics, top3Closers, top3Funis, loading: loadingMetrics } = useMonetizacaoMetrics();

  // Modal states
  const [closerModal, setCloserModal] = useState<{ open: boolean; closer?: Closer }>({ open: false });
  const [funilModal, setFunilModal] = useState<{ open: boolean; funil?: Funil }>({ open: false });
  const [vendaModal, setVendaModal] = useState<{ open: boolean; venda?: Venda }>({ open: false });
  const [funilDetailModal, setFunilDetailModal] = useState<Funil | null>(null);
  const [closerDetailModal, setCloserDetailModal] = useState<Closer | null>(null);
  const [productDetailModal, setProductDetailModal] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'closers', label: 'Closers', icon: Users },
    { id: 'funis', label: 'Funis', icon: Target },
    { id: 'produtos', label: 'Produtos', icon: Package },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  ];

  // Handlers
  const handleCloserSubmit = async (data: Partial<Closer>) => {
    setFormLoading(true);
    if (closerModal.closer) {
      await updateCloser(closerModal.closer.id, data);
    } else {
      await createCloser(data as Omit<Closer, 'id' | 'created_at' | 'updated_at'>);
    }
    setFormLoading(false);
    setCloserModal({ open: false });
  };

  const handleFunilSubmit = async (data: Partial<Funil>) => {
    setFormLoading(true);
    if (funilModal.funil) {
      await updateFunil(funilModal.funil.id, data);
    } else {
      await createFunil(data as Omit<Funil, 'id' | 'created_at' | 'updated_at'>);
    }
    setFormLoading(false);
    setFunilModal({ open: false });
  };

  const handleVendaSubmit = async (data: Partial<Venda>) => {
    setFormLoading(true);
    if (vendaModal.venda) {
      await updateVenda(vendaModal.venda.id, data);
    } else {
      await createVenda(data as Omit<Venda, 'id' | 'created_at' | 'closer' | 'funil'>);
    }
    setFormLoading(false);
    setVendaModal({ open: false });
  };

  const handleDeleteCloser = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este closer?')) {
      await deleteCloser(id);
    }
  };

  const handleDeleteFunil = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este funil?')) {
      await deleteFunil(id);
    }
  };

  const handleDeleteVenda = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta venda?')) {
      await deleteVenda(id);
    }
  };

  const loading = loadingClosers || loadingFunis || loadingVendas;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-green-400" />
            Monetização
          </h1>
          <p className="text-slate-400 mt-1">Gestão de closers, funis e vendas</p>
        </div>
        {(loading || syncingFunis) && (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            {syncingFunis ? 'Sincronizando funis do Google Sheets...' : 'Carregando...'}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm">Total Vendas</span>
              </div>
              <div className="text-2xl font-bold text-white">{metrics.totalVendas}</div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-slate-400 text-sm">Valor Total</span>
              </div>
              <div className="text-2xl font-bold text-white">
                R$ {metrics.valorTotalVendas.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-400 text-sm">Entradas</span>
              </div>
              <div className="text-2xl font-bold text-white">
                R$ {metrics.valorTotalEntradas.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-purple-400" />
                <span className="text-slate-400 text-sm">Ticket Medio</span>
              </div>
              <div className="text-2xl font-bold text-white">
                R$ {metrics.ticketMedio.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Top 3 Rankings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 3 Closers */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Top 3 Closers
              </h2>
              {top3Closers.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Nenhum closer cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {top3Closers.map((closer, index) => (
                    <div key={closer.id} className="flex items-center gap-4 bg-slate-900/50 rounded-lg p-3">
                      <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{closer.nome}</div>
                        <div className="text-slate-400 text-sm">{closer.numero_vendas} vendas</div>
                      </div>
                      <div className="text-green-400 font-medium">
                        R$ {closer.valor_total_vendas.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top 3 Funis */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Top 3 Funis
              </h2>
              {top3Funis.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Nenhum funil cadastrado</p>
              ) : (
                <div className="space-y-3">
                  {top3Funis.map((funil, index) => (
                    <div key={funil.id} className="flex items-center gap-4 bg-slate-900/50 rounded-lg p-3">
                      <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{funil.nome_produto}</div>
                        <div className="text-slate-400 text-sm">{funil.total_vendas} vendas</div>
                      </div>
                      <div className="text-green-400 font-medium">
                        R$ {funil.valor_total_gerado.toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Closers Tab */}
      {activeTab === 'closers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setCloserModal({ open: true })}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Closer
            </button>
          </div>

          {closers.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Nenhum closer cadastrado</p>
              <p className="text-slate-500 text-sm">Clique em "Novo Closer" para adicionar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {closers.map((closer) => (
                <div
                  key={closer.id}
                  className={`bg-slate-800/50 border rounded-xl p-6 cursor-pointer transition-all hover:scale-105 ${
                    closer.ativo ? 'border-slate-700 hover:border-green-500/50' : 'border-red-900/50 opacity-60'
                  }`}
                  onClick={() => setCloserDetailModal(closer)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl font-bold text-white">
                        {closer.nome.charAt(0)}
                      </div>
                      <div>
                        <div className="text-white font-medium">{closer.nome}</div>
                        <div className="text-slate-400 text-sm">{closer.time || 'Sem time'}</div>
                      </div>
                    </div>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setCloserModal({ open: true, closer })} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCloser(closer.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-slate-400">Vendas</div>
                      <div className="text-white font-medium">{closer.numero_vendas}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Taxa Conv.</div>
                      <div className="text-white font-medium">{closer.taxa_conversao}%</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-slate-400">Total Vendido</div>
                      <div className="text-green-400 font-medium">R$ {closer.valor_total_vendas.toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-blue-400 mt-4 pt-3 border-t border-slate-700">
                    <ArrowRight className="w-3 h-3" />
                    Clique para ver detalhes
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Funis Tab */}
      {activeTab === 'funis' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <p className="text-blue-400 text-sm">
                ℹ️ Funis são sincronizados automaticamente do Google Sheets (Aquisição)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => forceSyncFromSheets()}
                disabled={syncingFunis}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Sincronizar com Google Sheets"
              >
                <RefreshCcw className={`w-4 h-4 ${syncingFunis ? 'animate-spin' : ''}`} />
                {syncingFunis ? 'Sincronizando...' : 'Sincronizar'}
              </button>
              <button
                onClick={() => setFunilModal({ open: true })}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Funil
              </button>
            </div>
          </div>

          {funis.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Nenhum funil cadastrado</p>
              <p className="text-slate-500 text-sm">Clique em "Novo Funil" para adicionar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {funis.map((funil) => {
                // Check if it's a summary/total card
                const isSummary = funil.nome_produto.toLowerCase().includes('geral') ||
                                  funil.nome_produto.toLowerCase().includes('total');

                // Calculate tendencies (percentage change)
                const tendenciaFaturamentoPct = funil.faturamento && funil.tendencia_faturamento
                  ? ((funil.tendencia_faturamento - funil.faturamento) / funil.faturamento) * 100
                  : 0;

                const tendenciaLucroPct = funil.lucro !== undefined && funil.tendencia_lucro !== undefined && funil.lucro !== 0
                  ? ((funil.tendencia_lucro - funil.lucro) / Math.abs(funil.lucro)) * 100
                  : 0;

                return (
                  <div
                    key={funil.id}
                    className={`bg-slate-800/50 border rounded-xl p-6 transition-all ${
                      isSummary
                        ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                        : `cursor-pointer hover:scale-105 ${funil.ativo ? 'border-slate-700 hover:border-green-500/50' : 'border-red-900/50 opacity-60'}`
                    }`}
                    onClick={() => !isSummary && setFunilDetailModal(funil)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-white font-medium text-lg">{funil.nome_produto}</div>
                        {isSummary && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                            Compilado
                          </span>
                        )}
                      </div>
                      {!isSummary && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFunilModal({ open: true, funil });
                            }}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFunil(funil.id);
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="text-slate-400 text-sm mb-4">{funil.especialista}</div>

                    {/* Grid de métricas */}
                    <div className="space-y-3">
                      {/* Linha 1: Investimento e Faturamento */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-400 text-xs mb-1">Investimento</div>
                          <div className="text-white font-medium">
                            R$ {(funil.investimento || 0).toLocaleString('pt-BR')}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-xs mb-1">Faturamento Total</div>
                          <div className="text-green-400 font-medium">
                            R$ {(funil.faturamento || 0).toLocaleString('pt-BR')}
                          </div>
                          {tendenciaFaturamentoPct !== 0 && (
                            <div className={`text-xs flex items-center gap-1 mt-0.5 ${
                              tendenciaFaturamentoPct > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              <TrendingUp className={`w-3 h-3 ${tendenciaFaturamentoPct < 0 ? 'rotate-180' : ''}`} />
                              {Math.abs(tendenciaFaturamentoPct).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Linha 2: Lucro */}
                      <div>
                        <div className="text-slate-400 text-xs mb-1">Lucro</div>
                        <div className={`font-medium ${(funil.lucro || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          R$ {(funil.lucro || 0).toLocaleString('pt-BR')}
                        </div>
                        {tendenciaLucroPct !== 0 && (
                          <div className={`text-xs flex items-center gap-1 mt-0.5 ${
                            tendenciaLucroPct > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <TrendingUp className={`w-3 h-3 ${tendenciaLucroPct < 0 ? 'rotate-180' : ''}`} />
                            {Math.abs(tendenciaLucroPct).toFixed(1)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {!isSummary && (
                      <div className="flex items-center justify-center gap-2 text-xs text-blue-400 mt-4 pt-3 border-t border-slate-700">
                        <ArrowRight className="w-3 h-3" />
                        Clique para ver detalhes
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Produtos Tab */}
      {activeTab === 'produtos' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 mb-6">
            <p className="text-blue-400 text-sm">
              ℹ️ Estatísticas de produtos baseadas nas vendas registradas
            </p>
          </div>

          {PRODUTOS_DISPONIVEIS.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Nenhum produto disponível</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRODUTOS_DISPONIVEIS.map((produto) => {
                // Calculate stats for this product
                const produtoVendas = vendas.filter(v => v.produto === produto);
                const totalVendas = produtoVendas.length;
                const totalEntradas = produtoVendas.reduce((sum, v) => sum + v.valor_entrada, 0);
                const totalValor = produtoVendas.reduce((sum, v) => sum + v.valor_venda, 0);

                return (
                  <div
                    key={produto}
                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer transition-all hover:scale-105 hover:border-purple-500/50"
                    onClick={() => setProductDetailModal(produto)}
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-5 h-5 text-purple-400" />
                        <h3 className="text-white font-semibold text-lg">{produto}</h3>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Total de Vendas</span>
                        <span className="text-white font-medium">{totalVendas}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Total em Entradas</span>
                        <span className="text-yellow-400 font-medium">
                          R$ {totalEntradas.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-sm">Total em Vendas</span>
                        <span className="text-green-400 font-medium">
                          R$ {totalValor.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs text-blue-400 mt-4 pt-3 border-t border-slate-700">
                      <ArrowRight className="w-3 h-3" />
                      Clique para ver top vendedores
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Vendas Tab */}
      {activeTab === 'vendas' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setVendaModal({ open: true })}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar Venda
            </button>
          </div>

          {vendas.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Nenhuma venda registrada</p>
              <p className="text-slate-500 text-sm">Clique em "Registrar Venda" para adicionar</p>
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Produto</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-400">Closer</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Valor</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Entrada</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-slate-400">Acoes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {vendas.map((venda) => (
                      <tr key={venda.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-white">
                          {new Date(venda.data_venda).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-white">{venda.produto}</td>
                        <td className="px-4 py-3 text-slate-400">{venda.closer?.nome || '-'}</td>
                        <td className="px-4 py-3 text-right text-green-400">
                          R$ {venda.valor_venda.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-right text-yellow-400">
                          R$ {venda.valor_entrada.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setVendaModal({ open: true, venda })} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDeleteVenda(venda.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={closerModal.open} onClose={() => setCloserModal({ open: false })} title={closerModal.closer ? 'Editar Closer' : 'Novo Closer'}>
        <CloserForm closer={closerModal.closer} onSubmit={handleCloserSubmit} onCancel={() => setCloserModal({ open: false })} loading={formLoading} />
      </Modal>

      <Modal isOpen={funilModal.open} onClose={() => setFunilModal({ open: false })} title={funilModal.funil ? 'Editar Funil' : 'Novo Funil'}>
        <FunilForm funil={funilModal.funil} onSubmit={handleFunilSubmit} onCancel={() => setFunilModal({ open: false })} loading={formLoading} />
      </Modal>

      <Modal isOpen={vendaModal.open} onClose={() => setVendaModal({ open: false })} title={vendaModal.venda ? 'Editar Venda' : 'Registrar Venda'}>
        <VendaForm venda={vendaModal.venda} closers={closers} funis={funis} onSubmit={handleVendaSubmit} onCancel={() => setVendaModal({ open: false })} loading={formLoading} />
      </Modal>

      {/* Funil Detail Modal */}
      {funilDetailModal && (
        <FunilDetailModal
          funil={funilDetailModal}
          vendas={vendas}
          onClose={() => setFunilDetailModal(null)}
        />
      )}

      {/* Closer Detail Modal */}
      {closerDetailModal && (
        <CloserDetailModal
          closer={closerDetailModal}
          vendas={vendas}
          onEdit={() => {
            setCloserModal({ open: true, closer: closerDetailModal });
            setCloserDetailModal(null);
          }}
          onClose={() => setCloserDetailModal(null)}
        />
      )}

      {/* Product Detail Modal */}
      {productDetailModal && (
        <ProductDetailModal
          produto={productDetailModal}
          vendas={vendas}
          closers={closers}
          onClose={() => setProductDetailModal(null)}
        />
      )}
    </div>
  );
}
