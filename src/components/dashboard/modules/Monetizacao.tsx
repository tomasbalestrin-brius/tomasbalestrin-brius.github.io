import { useState } from 'react';
import { DollarSign, Users, ShoppingCart, Plus, TrendingUp, Award, Target } from 'lucide-react';
import type { Closer, Funil, Venda } from '@/types/dashboard';

export function MonetizacaoModule() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'closers' | 'funis' | 'vendas'>('dashboard');
  const [closers, setClosers] = useState<Closer[]>([]);
  const [funis, setFunis] = useState<Funil[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Placeholder metrics
  const metrics = {
    totalVendas: vendas.length,
    valorTotalVendas: vendas.reduce((acc, v) => acc + v.valor_venda, 0),
    valorTotalEntradas: vendas.reduce((acc, v) => acc + v.valor_entrada, 0),
    ticketMedio: vendas.length > 0
      ? vendas.reduce((acc, v) => acc + v.valor_venda, 0) / vendas.length
      : 0,
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'closers', label: 'Closers', icon: Users },
    { id: 'funis', label: 'Funis', icon: Target },
    { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  ];

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
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

          {/* Top 3 Closers */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Top 3 Closers
            </h2>
            {closers.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhum closer cadastrado ainda</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {closers.slice(0, 3).map((closer, index) => (
                  <div key={closer.id} className="bg-slate-900/50 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="text-white font-medium">{closer.nome}</div>
                    <div className="text-green-400 text-sm">
                      R$ {closer.valor_total_vendas.toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Closers Tab */}
      {activeTab === 'closers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
                <div key={closer.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl font-bold text-white">
                      {closer.nome.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{closer.nome}</div>
                      <div className="text-slate-400 text-sm">{closer.time || 'Sem time'}</div>
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
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
                <div key={funil.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="text-white font-medium text-lg mb-2">{funil.nome_produto}</div>
                  <div className="text-slate-400 text-sm mb-4">{funil.especialista}</div>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
