# 🐱 Sistema de Gestão de Gatil

Sistema web completo para gerenciamento de gatil, desenvolvido para facilitar o cuidado e organização de gatos resgatados. O sistema permite o controle de limpeza, socialização, medicação, consultas veterinárias e gestão de voluntários.

## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar](#como-executar)
- [Papéis de Usuário](#papéis-de-usuário)
- [Módulos do Sistema](#módulos-do-sistema)
- [Paleta de Cores](#paleta-de-cores)

## ✨ Funcionalidades

### 🔐 Autenticação e Perfis
- Sistema de login com dois tipos de usuário: **Líder** e **Voluntária**
- Perfis personalizáveis com foto, nome, e-mail e telefone
- Gerenciamento de veterinários cadastrados (apenas líder)

### 🐈 Gestão de Gatos
- Cadastro completo de gatos com:
  - Nome, idade, sexo, raça
  - Temperamento (Dócil ou Não dócil)
  - Status de castração
  - Condições especiais
  - Foto do gato
- Listagem e busca de gatos
- Edição de informações dos gatos
- Visualização detalhada de cada gato

### 📅 Escalas e Turnos
- **Limpeza**: 2 turnos diários (Manhã e Tarde)
  - Atribuição de voluntários por turno
  - Sistema de check para marcar conclusão
  - Turnos gerados automaticamente
- **Socialização**: 2 turnos diários (Manhã e Tarde)
  - Atribuição de voluntários por turno
  - Sistema de check para marcar conclusão
  - Turnos gerados automaticamente
- **Medicação**: Registro de medicamentos com data e hora
  - Cadastro de medicação por gato
  - Seleção de veterinário responsável
  - Controle de conclusão
  - Apenas líder pode deletar
- **Consultas Veterinárias**: Agendamento e controle
  - Data, hora e local da consulta
  - Seleção de veterinário
  - Atribuição de acompanhante
  - Controle de conclusão
  - Apenas líder pode deletar

### 🔔 Notificações
- Sistema de notificações em tempo real
- Alertas de tarefas pendentes
- Lembretes de medicação e consultas

### 👥 Gestão de Voluntários
- Cadastro de voluntários
- Atribuição automática de turnos
- Controle de tarefas por voluntário

## 📁 Estrutura do Projeto

```
/
├── app/                          # Páginas Next.js (App Router)
│   ├── cadastro/                 # Página de cadastro de voluntários
│   ├── escalas/                  # Gestão de escalas e turnos
│   ├── gatos/                    # Gestão de gatos
│   │   ├── [id]/                 # Visualização e edição de gato específico
│   │   ├── novo/                 # Cadastro de novo gato
│   │   └── page.tsx              # Listagem de gatos
│   ├── home/                     # Página inicial pós-login
│   ├── login/                    # Autenticação
│   ├── notificacoes/             # Notificações do usuário
│   ├── perfil/                   # Visualização e edição de perfil
│   │   └── editar/               # Edição de perfil do usuário
│   ├── layout.tsx                # Layout raiz da aplicação
│   └── page.tsx                  # Landing page
│
├── components/                   # Componentes React reutilizáveis
│   ├── ui/                       # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...                   # Outros componentes UI
│   ├── bottom-nav.tsx            # Navegação inferior mobile
│   ├── cat-card.tsx              # Card de exibição de gato
│   ├── footer-credits.tsx        # Rodapé com créditos do projeto
│   └── page-header.tsx           # Cabeçalho de páginas
│
├── hooks/                        # React Hooks customizados
│   ├── use-mobile.ts             # Detecta dispositivos móveis
│   └── use-toast.ts              # Sistema de notificações toast
│
├── lib/                          # Utilitários
│   └── utils.ts                  # Funções auxiliares (cn, etc)
│
├── public/                       # Arquivos estáticos
│   ├── placeholder-logo.png
│   ├── placeholder-user.jpg
│   └── ...                       # Imagens de gatos
│
└── styles/                       # Estilos globais
    └── globals.css               # CSS global com tokens de design
```

## 🛠 Tecnologias Utilizadas

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Gerenciador de Pacotes**: pnpm

## 🚀 Como Executar

1. **Clone o repositório**
\`\`\`bash
git clone <url-do-repositorio>
cd arquivo-comprimido
\`\`\`

2. **Instale as dependências**
\`\`\`bash
pnpm install
\`\`\`

3. **Execute o servidor de desenvolvimento**
\`\`\`bash
pnpm dev
\`\`\`

4. **Acesse no navegador**
\`\`\`
http://localhost:3000
\`\`\`

## 👥 Papéis de Usuário

### 🔑 Líder
Possui permissões completas no sistema:
- ✅ Cadastrar, editar e remover gatos
- ✅ Cadastrar e gerenciar veterinários
- ✅ Criar, editar e **deletar** eventos (medicação/consulta)
- ✅ Selecionar turnos/eventos para si mesma
- ✅ Marcar tarefas como concluídas
- ✅ Visualizar todas as escalas
- ✅ Gerenciar voluntários

### 👤 Voluntária
Possui permissões limitadas:
- ✅ Visualizar gatos cadastrados
- ✅ Selecionar turnos/eventos para si mesma (limpeza, socialização, medicação, consulta)
- ✅ Marcar tarefas como concluídas
- ✅ Visualizar escalas e eventos
- ✅ Visualizar notificações
- ❌ **NÃO pode** cadastrar/editar gatos
- ❌ **NÃO pode** deletar eventos
- ❌ **NÃO pode** gerenciar veterinários

## 📦 Módulos do Sistema

### 1. Autenticação (`/login`, `/cadastro`)
Sistema de login e cadastro de usuários com validação de e-mail e senha.

**Arquivos principais:**
- `app/login/page.tsx`: Interface de login
- `app/cadastro/page.tsx`: Registro de novos voluntários

### 2. Gestão de Gatos (`/gatos`)
Cadastro e gerenciamento completo de gatos do gatil.

**Arquivos principais:**
- `app/gatos/page.tsx`: Listagem de gatos com busca
- `app/gatos/novo/page.tsx`: Formulário de cadastro
- `app/gatos/[id]/page.tsx`: Visualização detalhada
- `app/gatos/[id]/editar/page.tsx`: Edição de informações
- `components/cat-card.tsx`: Componente de card de gato

**Campos do cadastro:**
\`\`\`typescript
interface Cat {
  id: string
  nome: string
  idade: number
  sexo: 'Macho' | 'Fêmea'
  raca: string
  temperamento: 'Dócil' | 'Não dócil'
  castrado: boolean
  condicoes?: string // Condições especiais
  foto?: string
}
\`\`\`

### 3. Escalas e Turnos (`/escalas`)
Gerenciamento de limpeza, socialização, medicação e consultas veterinárias.

**Arquivos principais:**
- `app/escalas/page.tsx`: Interface principal de escalas com 4 abas

**Abas Disponíveis:**
- 🧹 **Limpeza**: Turnos de limpeza do gatil
- 🐾 **Socialização**: Turnos de socialização com os gatos
- 💊 **Medicação**: Eventos de medicação
- 🏥 **Consultas**: Agendamentos de consultas veterinárias

**Tipos de Eventos:**

#### 🧹 Limpeza
- 2 turnos fixos por dia: Manhã e Tarde
- Turnos gerados automaticamente pelo sistema
- Cada turno pode ser atribuído a um voluntário
- Checkbox habilitado apenas após seleção do voluntário
- Desmarcar checkbox remove seleção automaticamente
- Não pode ser deletado (turnos automáticos)

\`\`\`typescript
interface CleaningShift {
  id: string
  periodo: 'Manhã' | 'Tarde'
  voluntario?: string // Nome do voluntário atribuído
  concluido: boolean
}
\`\`\`

#### 🐾 Socialização
- 2 turnos fixos por dia: Manhã e Tarde
- Turnos gerados automaticamente pelo sistema
- Mesma lógica de atribuição da limpeza
- Não pode ser deletado (turnos automáticos)

\`\`\`typescript
interface SocializationShift {
  id: string
  periodo: 'Manhã' | 'Tarde'
  voluntario?: string
  concluido: boolean
}
\`\`\`

#### 💊 Medicação
- Cadastro livre de eventos de medicação
- Criado manualmente pela líder através do dialog "Criar Evento"
- Campos: gato, data, hora, medicamento, veterinário
- Voluntárias podem se atribuir ao evento
- Apenas líder pode deletar (ícone de lixeira)

\`\`\`typescript
interface Medication {
  id: string
  gatoId: string
  gatoNome: string
  data: string
  hora: string
  medicamento: string
  veterinarioId: string
  voluntario?: string // Quem vai aplicar
  concluido: boolean
}
\`\`\`

#### 🏥 Consulta Veterinária
- Agendamento de consultas veterinárias
- Criado manualmente pela líder através do dialog "Criar Evento"
- Campos: gato, data, hora, veterinário, local
- Atribuição de acompanhante voluntário
- Apenas líder pode deletar (ícone de lixeira vermelho)

\`\`\`typescript
interface Consultation {
  id: string
  gatoId: string
  gatoNome: string
  data: string
  hora: string
  veterinarioId: string
  veterinarioNome: string
  local: string
  voluntario?: string // Quem vai acompanhar
  concluido: boolean
}
\`\`\`

**Fluxo de Seleção de Turnos/Eventos:**
1. Usuário (líder ou voluntária) clica em "Selecionar" → sistema atribui para o usuário logado
2. Checkbox fica habilitado após seleção
3. Usuário marca checkbox → tarefa marcada como concluída
4. Desmarcar checkbox → remove conclusão E remove seleção automaticamente

**Diferenças entre tipos de evento:**
- **Automáticos** (Limpeza/Socialização): 
  - Gerados automaticamente pelo sistema todos os dias
  - Não podem ser deletados
  - Apenas turnos Manhã e Tarde
- **Manuais** (Medicação/Consultas): 
  - Criados manualmente pela líder através do dialog "Criar Evento"
  - Podem ser deletados apenas pela líder (ícone de lixeira vermelho)
  - Horários e datas personalizados

**Veterinários no Sistema:**
- Lista de veterinários vem do cadastro no perfil da líder
- Ao criar eventos de medicação/consulta, líder seleciona veterinário da lista cadastrada
- Apenas líder pode adicionar/remover veterinários

### 4. Perfil (`/perfil`)
Visualização e edição de informações do usuário.

**Arquivos principais:**
- `app/perfil/page.tsx`: Visualização do perfil
- `app/perfil/editar/page.tsx`: Edição de informações

**Campos do perfil:**
\`\`\`typescript
interface UserProfile {
  nome: string
  email: string
  telefone: string
  foto?: string
  tipo: 'lider' | 'voluntaria'
  veterinarios?: Veterinarian[] // Apenas para líder
}

interface Veterinarian {
  id: string
  nome: string
  clinica: string
}
\`\`\`

**Funcionalidades da líder:**
- Gerenciar lista de veterinários
- Adicionar novo veterinário (nome + clínica)
- Remover veterinários cadastrados

### 5. Notificações (`/notificacoes`)
Sistema de notificações e alertas.

**Arquivos principais:**
- `app/notificacoes/page.tsx`: Lista de notificações
- `hooks/use-toast.ts`: Hook para notificações toast

## 🎨 Paleta de Cores

O sistema utiliza uma paleta de cores terrosas e quentes:

\`\`\`css
/* Tokens de Design (globals.css) */
--primary: #CC5804;           /* Laranja principal */
--primary-foreground: #FFFFFF; /* Texto em elementos primários */

--background: #E8DCC4;         /* Fundo principal - bege claro */
--foreground: #1A1A1A;         /* Texto principal - preto suave */

--card: #D4C4A8;               /* Fundo de cards - bege médio */
--card-foreground: #1A1A1A;    /* Texto em cards */

--popover: #CDC5A5;            /* Fundo de popups/dialogs - bege */
--popover-foreground: #1A1A1A; /* Texto em popups */

--muted: #C7B89A;              /* Elementos secundários */
--muted-foreground: #5A5A5A;   /* Texto secundário */

--accent: #CC5804;             /* Cor de destaque - laranja */
--accent-foreground: #FFFFFF;  /* Texto em elementos de destaque */

--border: #CC5804;             /* Bordas - laranja */
--input: #C7B89A;              /* Fundo de inputs - bege escuro */
--ring: #CC5804;               /* Outline de foco */
\`\`\`

**Aplicações de cor:**
- **#CC5804 (Laranja)**: Botões principais, bordas, links, ícones ativos
- **#E8DCC4 (Bege claro)**: Fundo da aplicação
- **#D4C4A8 (Bege médio)**: Cards e containers
- **#CDC5A5 (Bege)**: Dialogs, popups (opaco)
- **#C7B89A (Bege escuro)**: Inputs, elementos hover

## 🔗 Navegação

### Desktop
- Header fixo no topo com links de navegação
- Logo clicável para voltar à home
- Menu de perfil no canto superior direito

### Mobile
- Bottom navigation bar com 5 itens:
  - 🏠 Home
  - 🐱 Gatos
  - 📅 Escalas
  - 🔔 Notificações
  - 👤 Perfil

**Arquivo:** `components/bottom-nav.tsx`

## 📝 Convenções de Código

### Nomenclatura
- **Componentes**: PascalCase (`CatCard`, `PageHeader`)
- **Arquivos**: kebab-case (`cat-card.tsx`, `page-header.tsx`)
- **Variáveis**: camelCase (`currentUser`, `isSelected`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_CATS`, `DEFAULT_PERIOD`)

### Estrutura de Componentes
\`\`\`typescript
'use client' // Apenas se necessário

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  // Props do componente
}

export default function Component({ prop }: ComponentProps) {
  // Estado e lógica
  const [state, setState] = useState()

  // Handlers
  const handleClick = () => {
    // Lógica
  }

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
\`\`\`

### Comentários
- Use comentários para explicar **por quê**, não **o quê**
- Documente lógica complexa
- Marque TODOs claramente: `// TODO: Implementar validação`

## 🔄 Fluxo de Dados

\`\`\`
Usuario faz login
    ↓
Sistema identifica tipo (lider/voluntaria)
    ↓
Renderiza interface com permissões apropriadas
    ↓
Usuario acessa escalas (limpeza/socialização/medicação/consulta)
    ↓
Visualiza turnos/eventos disponíveis
    ↓
Clica em "Selecionar" → sistema atribui para usuário logado
    ↓
Checkbox habilitado
    ↓
Marca checkbox → tarefa concluída
    ↓
Desmarca checkbox → remove conclusão E seleção automaticamente
\`\`\`

## 🐛 Debug

Para debugar, use console.log com prefixo [v0]:

\`\`\`typescript
console.log('[v0] Estado atual:', state)
console.log('[v0] Usuário selecionado:', selectedUser)
\`\`\`

## 📄 Licença

Projeto desenvolvido como trabalho acadêmico para a disciplina SSC0536 - Projeto e Desenvolvimento de Sistemas de Informação.

## 👨‍💻 Créditos

**Integrantes:**
- Diogo Melo - 12563522
- Gabriel Costa - 14785489
- Isabella Arão - 9265732
- Leonardo Pereira - 9039361
- Marina Fagundes - 9265405
- Raphael Bonaccorsi - 12563366

**Informações Acadêmicas:**
- Disciplina: SSC0536 - Projeto e Desenvolvimento de Sistemas de Informação
- Curso: Bacharelado em Sistemas de Informação
- Universidade: Universidade de São Paulo (USP)
- Ano: 2025

---
