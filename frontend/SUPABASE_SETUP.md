# Configuração do Supabase - Lar Temporário

Este projeto usa Supabase como backend. Siga os passos abaixo para configurar.

## 📋 Pré-requisitos

1. Criar uma conta no [Supabase](https://supabase.com)
2. Criar um novo projeto no Supabase

## 🔧 Configuração Inicial

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.local` e adicione suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

**Onde encontrar essas credenciais:**
- Acesse seu projeto no Supabase
- Vá em Settings > API
- Copie a `URL` e as chaves `anon/public` e `service_role`

### 2. Executar o Script SQL

1. No Supabase, vá em `SQL Editor`
2. Crie uma nova query
3. Cole o conteúdo do arquivo `supabase-schema.sql`
4. Execute o script (clique em "Run")

Isso criará:
- ✅ Tabelas: `usuarios`, `gatos`, `escalas`, `limpeza`, `tarefas`, `limpeza_tarefas`, `socializacao`, `consulta`, `medicacao`, `notificacoes`
- ✅ Enum: `perfil_usuario` (Voluntario, Lider)
- ✅ Índices para melhor performance
- ✅ Trigger automático para criar usuário na tabela `usuarios` quando um novo usuário é registrado

### 3. Configurar Storage (Armazenamento)

Para upload de imagens, você precisa criar um bucket de storage:

1. No Supabase, vá em `Storage`
2. Crie um bucket público chamado `fotos`
3. Configure as políticas de acesso:

```sql
-- Permitir leitura pública das fotos
CREATE POLICY "Fotos são públicas"
ON storage.objects FOR SELECT
USING (bucket_id = 'fotos');

-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem fazer upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'fotos' AND auth.role() = 'authenticated');

-- Permitir deleção apenas para usuários autenticados
CREATE POLICY "Usuários autenticados podem deletar"
ON storage.objects FOR DELETE
USING (bucket_id = 'fotos' AND auth.role() = 'authenticated');
```

### 4. Configurar Autenticação

1. No Supabase, vá em `Authentication > Providers`
2. Configure os provedores que deseja usar:
   - Email (já vem habilitado)
   - Google, GitHub, etc. (opcional)

3. Configure as URLs de redirecionamento:
   - Development: `http://localhost:3000/**`
   - Production: `https://seu-dominio.com/**`

### 5. Popular Tarefas de Limpeza (Opcional)

```sql
INSERT INTO tarefas (nome) VALUES
  ('Limpar caixas de areia'),
  ('Repor água'),
  ('Repor ração'),
  ('Varrer e passar pano'),
  ('Lavar tigelas'),
  ('Organizar área de brinquedos'),
  ('Desinfetar superfícies');
```

## 📚 Estrutura da API

### Arquivos Criados

```
lib/
├── supabase.ts              # Cliente Supabase (browser)
├── supabase-admin.ts        # Cliente admin (server-side)
└── api/
    ├── auth.ts              # Autenticação
    ├── gatos.ts             # CRUD de gatos
    ├── usuarios.ts          # CRUD de usuários
    ├── escalas.ts           # CRUD de escalas (Limpeza, Socialização, Consulta, Medicação)
    └── notificacoes.ts      # CRUD de notificações
```

### Exemplos de Uso

#### Autenticação

```typescript
import { authApi } from '@/lib/api/auth'

// Login
await authApi.signIn('usuario@email.com', 'senha')

// Registro (trigger automático cria registro na tabela usuarios)
await authApi.signUp('novo@email.com', 'senha', {
  nome: 'João Silva',
  telefone: '11999999999'
})

// Logout
await authApi.signOut()
```

#### Gerenciar Gatos

```typescript
import { gatosApi } from '@/lib/api/gatos'

// Listar todos os gatos
const gatos = await gatosApi.getAll()

// Criar novo gato
const novoGato = await gatosApi.create({
  nome: 'Miau',
  data_nascimento: '2023-01-15',
  sexo: 'M',
  data_resgate: '2024-06-10',
  status: 'Disponível',
  observacao: 'Gato carinhoso e brincalhão'
})

// Calcular idade
const idade = gatosApi.calcularIdade('2023-01-15')
```

#### Gerenciar Usuários

```typescript
import { usuariosApi } from '@/lib/api/usuarios'

// Buscar usuário atual
const usuario = await usuariosApi.getCurrent()

// Listar voluntários
const voluntarios = await usuariosApi.getByPerfil('Voluntario')

// Promover a líder
await usuariosApi.promoteToLider(userId)
```

#### Gerenciar Escalas

```typescript
import { escalasApi } from '@/lib/api/escalas'

// Criar escala de limpeza com tarefas
const { escala, limpeza } = await escalasApi.createLimpeza(
  {
    usuario_id: userId,
    data_hora_inicio: '2025-11-20T09:00:00',
    data_hora_fim: '2025-11-20T12:00:00',
    tipo: 'Limpeza'
  },
  [1, 2, 3] // IDs das tarefas
)

// Criar escala de socialização
const { escala, socializacao } = await escalasApi.createSocializacao(
  {
    usuario_id: userId,
    data_hora_inicio: '2025-11-20T14:00:00',
    data_hora_fim: '2025-11-20T15:00:00',
    tipo: 'Socialização'
  },
  gatoId
)

// Criar escala de medicação
const { escala, medicacao } = await escalasApi.createMedicacao(
  {
    usuario_id: userId,
    data_hora_inicio: '2025-11-20T08:00:00',
    data_hora_fim: '2025-11-20T08:15:00',
    tipo: 'Medicação'
  },
  gatoId,
  'Antibiótico XYZ',
  '2 gotas via oral',
  '2025-11-20T08:00:00'
)

// Registrar que medicação foi administrada
await escalasApi.registrarMedicacao(medicacaoId, 'Administrado com sucesso')

// Criar consulta veterinária
const { escala, consulta } = await escalasApi.createConsulta(
  {
    usuario_id: userId,
    data_hora_inicio: '2025-11-21T10:00:00',
    data_hora_fim: '2025-11-21T11:00:00',
    tipo: 'Consulta'
  },
  gatoId,
  '2025-11-21T10:00:00',
  'Dr. Silva'
)
```

#### Notificações

```typescript
import { notificacoesApi } from '@/lib/api/notificacoes'

// Listar notificações não lidas
const naoLidas = await notificacoesApi.getUnread(userId)

// Criar notificação
await notificacoesApi.create({
  usuario_id: userId,
  titulo: 'Lembrete',
  mensagem: 'Você tem uma consulta agendada amanhã',
  tipo: 'alerta'
})

// Marcar como lida
await notificacoesApi.markAsRead(notificacaoId)

// Tempo real
const sub = notificacoesApi.subscribeToChanges(userId, (payload) => {
  console.log('Nova notificação:', payload.new)
})
```

## 🗂️ Estrutura do Banco de Dados

### Tabelas Principais

- **usuarios**: Voluntários e líderes do lar temporário
- **gatos**: Gatos resgatados e disponíveis para adoção
- **escalas**: Escalas de trabalho dos voluntários

### Tabelas de Tipos de Escala

- **limpeza**: Escalas de limpeza
- **limpeza_tarefas**: Tarefas associadas a cada limpeza
- **tarefas**: Lista de tarefas de limpeza disponíveis
- **socializacao**: Escalas de socialização com gatos específicos
- **consulta**: Consultas veterinárias agendadas
- **medicacao**: Administração de medicamentos
- **notificacoes**: Notificações para usuários

## 🔒 Segurança

- ✅ Trigger automático cria usuário ao registrar via auth
- ✅ Cascata de deleção configurada nas foreign keys
- ✅ Separação entre cliente público e admin
- ✅ Service Role Key apenas para operações server-side
- ✅ Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend

## 🚀 Próximos Passos

1. Configure Row Level Security (RLS) nas tabelas conforme suas necessidades
2. Configure email templates em `Authentication > Email Templates`
3. Ajuste as políticas de acesso baseadas nos perfis de usuário
4. Configure webhooks se necessário em `Database > Webhooks`

## 📖 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
