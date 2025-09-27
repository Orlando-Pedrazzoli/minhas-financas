# 💰 Minhas Finanças - Sistema de Gestão Financeira Pessoal

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0.0-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite" />
</div>

## ✨ Funcionalidades Implementadas

### 🎯 Core Features

- ✅ **Sistema de Autenticação Completo** - JWT com refresh tokens
- ✅ **Dashboard Interativo** - Visualização em tempo real
- ✅ **Gestão de Transações** - CRUD completo com categorias
- ✅ **Controle de Cartão de Crédito** - Limite, fatura e vencimento
- ✅ **Análises e Estatísticas** - Gráficos e relatórios
- ✅ **UI/UX Moderna** - Design responsivo e acessível
- ✅ **Notificações Toast** - Feedback visual instantâneo
- ✅ **Animações Suaves** - Transições e micro-interações
- ✅ **PWA Ready** - Instalável como app

### 🚀 Features Avançadas

- ✅ **Context API** - Estado global gerenciado
- ✅ **Validação de Formulários** - Feedback em tempo real
- ✅ **Loading States** - Skeletons e indicadores
- ✅ **Error Handling** - Tratamento robusto de erros
- ✅ **Mobile First** - Otimizado para dispositivos móveis
- ✅ **Dark Mode Ready** - Preparado para tema escuro
- ✅ **Segurança** - Senhas hasheadas com bcrypt
- ✅ **Performance** - Code splitting e lazy loading

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite com migrations
- **Autenticação**: JWT (jsonwebtoken)
- **Segurança**: bcryptjs para hash de senhas
- **UI Components**: Lucide React para ícones
- **Notificações**: React Hot Toast
- **State Management**: React Context API

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/minhas-financas.git
cd minhas-financas
```

2. **Instale as dependências**

```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env.local
```

4. **Inicialize o banco de dados**

```bash
npm run db:init
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
# ou
yarn dev
```

6. **Acesse a aplicação**

```
http://localhost:3000
```

## 🔐 Credenciais Padrão

```
Usuário: admin
Senha: 123456
```

⚠️ **IMPORTANTE**: Mude essas credenciais em produção!

## 📱 Screenshots da Nova UI

### Tela de Login

- Design moderno com gradientes animados
- Glassmorphism effects
- Animações suaves
- Validação em tempo real

### Dashboard Principal

- Cards informativos com gradientes
- Gráficos interativos
- Lista de transações organizada
- Floating Action Button para adicionar

### Gestão de Transações

- Modal intuitivo
- Categorias com ícones
- Quick amounts buttons
- Validação instantânea

## 🏗️ Estrutura do Projeto

```
minhas-financas/
├── app/                    # Páginas e rotas
│   ├── api/               # API Routes
│   │   ├── auth/         # Autenticação
│   │   ├── balance/      # Saldo
│   │   ├── credit-card/  # Cartão
│   │   └── transactions/ # Transações
│   ├── dashboard/         # Dashboard principal
│   └── login/            # Tela de login
├── components/            # Componentes React
│   ├── dashboard/        # Componentes do dashboard
│   └── layout/          # Layout components
├── contexts/             # Context providers
│   ├── AuthContext.js   # Contexto de autenticação
│   └── FinanceContext.js # Contexto financeiro
├── lib/                  # Utilitários
│   ├── config.js        # Configurações
│   └── db.js           # Database connection
└── public/              # Assets públicos
```

## 🎨 Melhorias de UI/UX Implementadas

### Design System

- **Cores**: Gradientes purple-to-indigo como tema principal
- **Tipografia**: Inter font com variações de peso
- **Espaçamento**: Sistema consistente de 4px
- **Border Radius**: 16px para cards principais
- **Sombras**: Multi-layer para profundidade

### Animações

- **Blob animations** no login
- **Slide-up** para modais
- **Scale** para hover states
- **Shimmer** para loading
- **Shake** para erros
- **Bounce** para notificações

### Acessibilidade

- Focus states visíveis
- Contraste WCAG AAA
- Aria labels
- Keyboard navigation
- Screen reader friendly

## 🔄 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Build de produção
npm run start        # Inicia servidor de produção

# Database
npm run db:init      # Inicializa banco de dados
npm run update-env   # Atualiza valores do .env

# Qualidade
npm run lint         # Verifica código
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte com Vercel
3. Configure variáveis de ambiente
4. Deploy automático

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Correções Implementadas

1. ✅ **Context Providers** - Adicionados ao layout principal
2. ✅ **Dashboard Integration** - Usa contextos ao invés de dados hardcoded
3. ✅ **Toast Notifications** - Sistema global de notificações
4. ✅ **Loading States** - Indicadores adequados
5. ✅ **Error Handling** - Tratamento robusto
6. ✅ **Form Validation** - Validação em tempo real
7. ✅ **API Integration** - Frontend conectado ao backend
8. ✅ **Responsive Design** - Mobile-first approach

## 📈 Próximos Passos

- [ ] Gráficos interativos com Recharts
- [ ] Exportação de relatórios PDF
- [ ] Modo escuro completo
- [ ] Múltiplas contas bancárias
- [ ] Categorias personalizadas
- [ ] Metas financeiras
- [ ] Notificações push
- [ ] Sincronização cloud

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 💬 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato.

---

<div align="center">
  <p>Desenvolvido com 💜 para ajudar você a controlar suas finanças</p>
  <p>⭐ Se este projeto te ajudou, considere dar uma estrela!</p>
</div>
