import { useState, useEffect } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { useNavigate } from 'react-router-dom';
import { supabaseTyped as supabase } from '@/lib/supabase-typed';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface SpreadsheetConnection {
  id: string;
  spreadsheet_id: string;
  spreadsheet_name: string;
  status: 'active' | 'error' | 'disabled';
  error_message: string | null;
  last_synced_at: string | null;
}

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { organization, canManageSettings, loading: orgLoading } = useOrganization();

  const [connection, setConnection] = useState<SpreadsheetConnection | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [spreadsheetName, setSpreadsheetName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organization) {
      fetchConnection();
    }
  }, [organization]);

  const fetchConnection = async () => {
    if (!organization) return;

    try {
      const { data, error } = await supabase
        .from('spreadsheet_connections')
        .select('*')
        .eq('organization_id', organization.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setConnection(data as SpreadsheetConnection);
        setSpreadsheetId(data.spreadsheet_id);
        setSpreadsheetName(data.spreadsheet_name);
      }
    } catch (error: any) {
      console.error('Error fetching connection:', error);
      toast({
        title: 'Erro ao carregar configurações',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!organization || !spreadsheetId.trim()) return;

    setSaving(true);
    try {
      if (connection) {
        // Atualizar conexão existente
        const { error } = await supabase
          .from('spreadsheet_connections')
          .update({
            spreadsheet_id: spreadsheetId,
            spreadsheet_name: spreadsheetName || 'Dashboard Analytics',
          })
          .eq('id', connection.id);

        if (error) throw error;
      } else {
        // Criar nova conexão
        const { error } = await supabase
          .from('spreadsheet_connections')
          .insert({
            organization_id: organization.id,
            spreadsheet_id: spreadsheetId,
            spreadsheet_name: spreadsheetName || 'Dashboard Analytics',
            status: 'active',
          });

        if (error) throw error;
      }

      toast({
        title: 'Configurações salvas!',
        description: 'A planilha foi configurada com sucesso.',
      });

      // Recarregar conexão
      await fetchConnection();
    } catch (error: any) {
      console.error('Error saving connection:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const extractSpreadsheetId = (url: string): string => {
    // Extrair ID da URL do Google Sheets
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  const handleUrlChange = (value: string) => {
    const extracted = extractSpreadsheetId(value);
    setSpreadsheetId(extracted);
  };

  if (orgLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!canManageSettings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para gerenciar configurações da organização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Configurações da Organização</h1>
            <p className="text-muted-foreground mt-1">{organization?.name}</p>
          </div>
        </div>

        {/* Google Sheets Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Google Sheets</CardTitle>
            <CardDescription>
              Configure a planilha do Google Sheets que contém os dados do dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status */}
            {connection && (
              <Alert variant={connection.status === 'active' ? 'default' : 'destructive'}>
                {connection.status === 'active' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {connection.status === 'active'
                    ? 'Planilha conectada e funcionando'
                    : connection.error_message || 'Erro ao conectar com a planilha'}
                </AlertDescription>
              </Alert>
            )}

            {/* Spreadsheet Name */}
            <div className="space-y-2">
              <Label htmlFor="spreadsheet-name">Nome da Planilha (opcional)</Label>
              <Input
                id="spreadsheet-name"
                placeholder="Dashboard Analytics"
                value={spreadsheetName}
                onChange={(e) => setSpreadsheetName(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Um nome amigável para identificar esta planilha
              </p>
            </div>

            {/* Spreadsheet ID/URL */}
            <div className="space-y-2">
              <Label htmlFor="spreadsheet-id">
                URL ou ID da Planilha <span className="text-destructive">*</span>
              </Label>
              <Input
                id="spreadsheet-id"
                placeholder="https://docs.google.com/spreadsheets/d/1ABC.../edit ou 1ABC..."
                value={spreadsheetId}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Cole a URL completa ou apenas o ID da planilha do Google Sheets
              </p>
            </div>

            {/* Current Spreadsheet Link */}
            {connection && (
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">Planilha Atual</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {connection.spreadsheet_id}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://docs.google.com/spreadsheets/d/${connection.spreadsheet_id}`,
                      '_blank'
                    )
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir
                </Button>
              </div>
            )}

            {/* Instructions */}
            <Alert>
              <AlertDescription className="space-y-2">
                <p className="font-medium">Como obter o ID da planilha:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Abra sua planilha no Google Sheets</li>
                  <li>Copie a URL da barra de endereço</li>
                  <li>Cole aqui (o ID será extraído automaticamente)</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">
                  A planilha deve estar{' '}
                  <span className="font-semibold">pública para leitura</span> ou você deve ter
                  configurado uma API Key válida.
                </p>
              </AlertDescription>
            </Alert>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!spreadsheetId.trim() || saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plan Info */}
        <Card>
          <CardHeader>
            <CardTitle>Plano Atual</CardTitle>
            <CardDescription>Limites e recursos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Plano</p>
                <p className="text-lg font-semibold capitalize">{organization?.plan || 'Free'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Máximo de Usuários</p>
                <p className="text-lg font-semibold">{organization?.max_users || 3}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Máximo de Planilhas</p>
                <p className="text-lg font-semibold">{organization?.max_spreadsheets || 1}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold capitalize">{organization?.status || 'Active'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
