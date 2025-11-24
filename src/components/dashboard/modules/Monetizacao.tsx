import { useState } from 'react';
import { DollarSign, Users, ShoppingCart, Plus, TrendingUp, Award, Target, X, Edit2, Trash2, Loader2 } from 'lucide-react';
import type { Closer, Funil, Venda } from '@/types/dashboard';
import { useClosers, useFunis, useVendas, useMonetizacaoMetrics } from '@/hooks/useMonetizacao';

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
        <label className="block text-sm text-slate-400 mb-1">Funil/Produto *</label>
        <select
          required
          value={formData.funil_id}
          onChange={(e) => {
            const funil = funis.find(f => f.id === e.target.value);
            setFormData({
              ...formData,
              funil_id: e.target.value,
              produto: funil?.nome_produto || '',
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

export function MonetizacaoModule() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'closers' | 'funis' | 'vendas'>('dashboard');

  // Hooks
  const { closers, loading: loadingClosers, createCloser, updateCloser, deleteCloser } = useClosers();
  const { funis, loading: loadingFunis, syncing: syncingFunis, createFunil, updateFunil, deleteFunil } = useFunis();
  const { vendas, loading: loadingVendas, createVenda, updateVenda, deleteVenda } = useVendas();
  const { metrics, top3Closers, top3Funis, loading: loadingMetrics } = useMonetizacaoMetrics();

  // Modal states
  const [closerModal, setCloserModal] = useState<{ open: boolean; closer?: Closer }>({ open: false });
  const [funilModal, setFunilModal] = useState<{ open: boolean; funil?: Funil }>({ open: false });
  const [vendaModal, setVendaModal] = useState<{ open: boolean; venda?: Venda }>({ open: false });
  const [formLoading, setFormLoading] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'closers', label: 'Closers', icon: Users },
    { id: 'funis', label: 'Funis', icon: Target },
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
            Monetizacao
          </h1>
          <p className="text-slate-400 mt-1">Gestao de closers, funis e vendas</p>
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
                <div key={closer.id} className={`bg-slate-800/50 border rounded-xl p-6 ${closer.ativo ? 'border-slate-700' : 'border-red-900/50 opacity-60'}`}>
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
                    <div className="flex gap-1">
                      <button onClick={() => setCloserModal({ open: true, closer })} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCloser(closer.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
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
            <button
              onClick={() => setFunilModal({ open: true })}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Funil
            </button>
          </div>

          {funis.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Nenhum funil cadastrado</p>
              <p className="text-slate-500 text-sm">Clique em "Novo Funil" para adicionar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {funis.map((funil) => (
                <div key={funil.id} className={`bg-slate-800/50 border rounded-xl p-6 ${funil.ativo ? 'border-slate-700' : 'border-red-900/50 opacity-60'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-medium text-lg">{funil.nome_produto}</div>
                    <div className="flex gap-1">
                      <button onClick={() => setFunilModal({ open: true, funil })} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteFunil(funil.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm mb-4">{funil.especialista}</div>
                  {funil.descricao && <div className="text-slate-500 text-sm mb-4 line-clamp-2">{funil.descricao}</div>}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Valor</div>
                      <div className="text-green-400 font-medium">R$ {funil.valor_venda.toLocaleString('pt-BR')}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Vendas</div>
                      <div className="text-white font-medium">{funil.total_vendas}</div>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
}
