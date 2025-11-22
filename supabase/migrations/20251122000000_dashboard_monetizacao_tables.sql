-- =====================================================
-- DASHBOARD BETHEL - TABELAS DE MONETIZAÇÃO E AQUISIÇÃO
-- =====================================================

-- TABELA: closers (vendedores)
CREATE TABLE IF NOT EXISTS closers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  foto_url TEXT,
  taxa_conversao DECIMAL(5,2) DEFAULT 0,
  numero_vendas INTEGER DEFAULT 0,
  valor_total_vendas DECIMAL(12,2) DEFAULT 0,
  valor_total_entradas DECIMAL(12,2) DEFAULT 0,
  tempo_empresa TEXT,
  time TEXT,
  produto_mais_vendido TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para closers
CREATE INDEX IF NOT EXISTS idx_closers_ativo ON closers(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_closers_time ON closers(time);
CREATE INDEX IF NOT EXISTS idx_closers_vendas ON closers(valor_total_vendas DESC);

-- TABELA: funis (produtos/funis de venda)
CREATE TABLE IF NOT EXISTS funis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_produto TEXT NOT NULL,
  valor_venda DECIMAL(12,2) DEFAULT 0,
  especialista TEXT,
  descricao TEXT,
  total_vendas INTEGER DEFAULT 0,
  valor_total_gerado DECIMAL(12,2) DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para funis
CREATE INDEX IF NOT EXISTS idx_funis_ativo ON funis(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_funis_vendas ON funis(total_vendas DESC);

-- TABELA: vendas (registro de vendas)
CREATE TABLE IF NOT EXISTS vendas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  closer_id UUID REFERENCES closers(id) ON DELETE SET NULL,
  funil_id UUID REFERENCES funis(id) ON DELETE SET NULL,
  produto TEXT NOT NULL,
  valor_venda DECIMAL(12,2) NOT NULL,
  valor_entrada DECIMAL(12,2) DEFAULT 0,
  negociacao TEXT,
  data_venda DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para vendas
CREATE INDEX IF NOT EXISTS idx_vendas_closer ON vendas(closer_id);
CREATE INDEX IF NOT EXISTS idx_vendas_funil ON vendas(funil_id);
CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(data_venda DESC);

-- TABELA: funis_aquisicao (dados de aquisição do Google Sheets)
CREATE TABLE IF NOT EXISTS funis_aquisicao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_funil TEXT NOT NULL,
  investido DECIMAL(12,2) DEFAULT 0,
  faturamento_trafego DECIMAL(12,2) DEFAULT 0,
  roas_trafego DECIMAL(10,4) DEFAULT 0,
  numero_alunos INTEGER DEFAULT 0,
  periodo TEXT NOT NULL,
  data_inicio DATE,
  data_fim DATE,
  sheet_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  -- Constraint: um funil não pode estar duplicado no mesmo período
  UNIQUE(nome_funil, periodo)
);

-- Índices para funis_aquisicao
CREATE INDEX IF NOT EXISTS idx_funis_aquisicao_periodo ON funis_aquisicao(periodo);
CREATE INDEX IF NOT EXISTS idx_funis_aquisicao_nome ON funis_aquisicao(nome_funil);

-- TABELA: sync_logs (logs de sincronização)
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('aquisicao', 'monetizacao', 'sdr')),
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  mensagem TEXT,
  registros_sincronizados INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices para sync_logs
CREATE INDEX IF NOT EXISTS idx_sync_logs_tipo ON sync_logs(tipo);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created ON sync_logs(created_at DESC);

-- =====================================================
-- TRIGGERS para updated_at
-- =====================================================

-- Função handle_updated_at (se não existir)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS closers_updated_at ON closers;
CREATE TRIGGER closers_updated_at
  BEFORE UPDATE ON closers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS funis_updated_at ON funis;
CREATE TRIGGER funis_updated_at
  BEFORE UPDATE ON funis
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS funis_aquisicao_updated_at ON funis_aquisicao;
CREATE TRIGGER funis_aquisicao_updated_at
  BEFORE UPDATE ON funis_aquisicao
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE closers ENABLE ROW LEVEL SECURITY;
ALTER TABLE funis ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE funis_aquisicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Policies para closers (permitir todas as operações para usuários autenticados)
CREATE POLICY "Allow all for authenticated users - closers"
  ON closers FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policies para funis
CREATE POLICY "Allow all for authenticated users - funis"
  ON funis FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policies para vendas
CREATE POLICY "Allow all for authenticated users - vendas"
  ON vendas FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policies para funis_aquisicao
CREATE POLICY "Allow all for authenticated users - funis_aquisicao"
  ON funis_aquisicao FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Policies para sync_logs
CREATE POLICY "Allow all for authenticated users - sync_logs"
  ON sync_logs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- DADOS INICIAIS (SEED)
-- =====================================================

-- Inserir alguns closers de exemplo
INSERT INTO closers (nome, time, taxa_conversao, ativo) VALUES
  ('Closer Demo 1', 'Equipe A', 25.5, true),
  ('Closer Demo 2', 'Equipe B', 30.0, true)
ON CONFLICT DO NOTHING;

-- Inserir alguns funis de exemplo
INSERT INTO funis (nome_produto, valor_venda, especialista, ativo) VALUES
  ('Produto Demo 1', 997.00, 'Especialista A', true),
  ('Produto Demo 2', 1997.00, 'Especialista B', true)
ON CONFLICT DO NOTHING;
