-- Adicionar colunas de dados de aquisição na tabela funis
-- Execute este script no Supabase SQL Editor

ALTER TABLE funis 
ADD COLUMN IF NOT EXISTS investimento INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS faturamento INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lucro INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tendencia_faturamento INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tendencia_lucro INTEGER DEFAULT 0;

-- Verificar se as colunas foram criadas
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'funis' 
ORDER BY ordinal_position;
