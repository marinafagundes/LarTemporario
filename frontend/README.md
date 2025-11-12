# Projeto Lar Temporário 🐱

Sistema de gerenciamento para lares temporários de gatos, facilitando o cuidado, organização de escalas e acompanhamento da saúde dos animais resgatados.

## 📋 Sobre o Projeto

O **Projeto Lar Temporário** é uma aplicação web desenvolvida para ajudar ONGs e voluntários que cuidam de gatos em lares temporários. O sistema permite gerenciar informações dos gatos, organizar escalas de cuidados (limpeza, socialização, medicação, consultas), acompanhar notificações e gerenciar perfis de líderes e voluntários.

### Principais Funcionalidades

- **Gestão de Gatos**: Cadastro completo com foto, dados médicos, temperamento e histórico
- **Escalas de Cuidados**: Calendário interativo para organizar:
  - Limpeza
  - Socialização
  - Medicação
  - Consultas veterinárias
- **Notificações**: Sistema de lembretes para tarefas e eventos importantes
- **Perfis**: Gerenciamento de líderes e voluntários com suas responsabilidades
- **Autenticação**: Login seguro com Google OAuth

## 🚀 Tecnologias Utilizadas

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Ícones**: Lucide React
- **Formulários**: React Hook Form + Zod
- **Gerenciamento de Estado**: React 19.2
- **Calendário**: date-fns + react-day-picker

## 📁 Estrutura do Projeto

\`\`\`
├── app/                    # Páginas e rotas (App Router)
│   ├── cadastro/          # Cadastro de usuários
│   ├── escalas/           # Gestão de escalas e calendário
│   ├── gatos/             # Listagem e gestão de gatos
│   │   ├── [id]/         # Detalhes e edição de gato
│   │   └── novo/         # Cadastro de novo gato
│   ├── login/            # Autenticação
│   ├── notificacoes/     # Central de notificações
│   ├── perfil/           # Perfil do usuário
│   │   └── editar/       # Edição de perfil
│   └── layout.tsx        # Layout global
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── page-header.tsx   # Header padronizado
├── lib/                   # Utilitários e helpers
├── public/               # Arquivos estáticos
└── README.md
\`\`\`

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn ou pnpm

### Instalação

1. Clone o repositório:
\`\`\`bash
git clone <url-do-repositorio>
cd projeto-lar-temporario
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

3. Execute o servidor de desenvolvimento:
\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

4. Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar o projeto.

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linting do código

## 📱 Design Responsivo

O projeto foi desenvolvido com abordagem mobile-first e é totalmente responsivo, funcionando perfeitamente em:
- Smartphones
- Tablets
- Desktops

## 🎨 Paleta de Cores

O projeto utiliza um sistema de design tokens personalizados com tons terrosos e aconchegantes:
- **Primary**: Tons de marrom/terracota (#B08968)
- **Secondary**: Tons bege claro
- **Background**: Bege suave (#E6DDD5)
- **Accent**: Laranja coral

## 🔐 Autenticação

O sistema utiliza autenticação via Google OAuth para garantir segurança e facilidade de acesso aos usuários.

## 📄 Licença

Este projeto é privado e destinado ao uso interno do Projeto Lar Temporário.

## 👥 Contribuindo

Este é um projeto em desenvolvimento. Para contribuir, entre em contato com a equipe de desenvolvimento.

---