# 🏍️ MotoRotas - BackOffice

Uma aplicação web moderna para gestão de rotas de entrega de motoboys, inspirada no painel do iFood Gestor. Sistema com interface Kanban que permite visualizar, organizar e gerenciar rotas de entrega em tempo real.

![React](https://img.shields.io/badge/React-19.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8)
![Vite](https://img.shields.io/badge/Vite-7.1-646cff)

## ✨ Funcionalidades

- 📊 **Dashboard Kanban** com 3 colunas de status (Pronto, Em Rota, Concluído)
- 🔄 **Gestão de rotas** com modais para criação e visualização detalhada
- 👤 **Gestão de motoboys** com atribuição de rotas
- ⚡ **Performance otimizada** com React Query e Zustand
- 📱 **Design responsivo** mobile-first
- 🎨 **Interface moderna** inspirada no iFood Gestor com TailwindCSS v4
- 🗺️ **Roteamento** com React Router para navegação entre páginas

## 🛠️ Tecnologias

- **React 19** - Framework UI
- **TypeScript 5.9** - Tipagem estática
- **Vite 7.1** - Build tool ultrarrápido
- **TailwindCSS 4.1** - Estilos utilitários (nova sintaxe com `@theme`)
- **React Query 5** - Gerenciamento de estado servidor
- **Zustand 5** - Estado global
- **React Router 7** - Roteamento
- **Axios** - Cliente HTTP
- **Lucide React** - Biblioteca de ícones
- **JSON Server** - API REST fake para desenvolvimento

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm

### Instalar dependências

```bash
npm install
```

## 🚀 Executar o Projeto

### Opção 1: Rodar tudo junto (RECOMENDADO)

Este comando inicia simultaneamente o JSON Server (API mock) e o Vite dev server:

```bash
npm run dev:full
```

Isso irá:

- ✅ Iniciar o **JSON Server** em `http://localhost:3001` (API mock)
- ✅ Iniciar o **Vite** em `http://localhost:5173` (aplicação)
- ✅ O React Query busca dados automaticamente do JSON Server

### Opção 2: Rodar separadamente

**Terminal 1** - Iniciar a API mock:

```bash
npm run api
```

**Terminal 2** - Iniciar a aplicação:

```bash
npm run dev
```

### Acessar

Abra http://localhost:5173 no navegador

## 📁 Estrutura do Projeto

```
src/
├─ api/
│  ├─ routesApi.ts        # Configuração Axios + endpoints
│  └─ mockData.ts         # Dados sincronizados com db.json
├─ components/
│  ├─ core/               # Componentes reutilizáveis
│  │  ├─ Button.tsx
│  │  ├─ Modal.tsx
│  │  └─ SkeletonLoader.tsx
│  ├─ domain/             # Componentes do domínio
│  │  ├─ CreateRouteModal.tsx
│  │  ├─ RouteDetailsModal.tsx
│  │  ├─ DeliveryCard.tsx
│  │  ├─ Header.tsx
│  │  ├─ RouteCard.tsx
│  │  └─ StatusColumn.tsx
│  └─ layout/             # Componentes de layout
│     ├─ MainLayout.tsx
│     ├─ Sidebar.tsx
│     └─ Topbar.tsx
├─ hooks/
│  └─ useRoutesQuery.ts   # React Query hooks customizados
├─ pages/
│  ├─ Dashboard.tsx       # Dashboard principal (Kanban)
│  ├─ Routes.tsx          # Página de rotas
│  ├─ RouteDetailsPage.tsx # Detalhes de uma rota específica
│  ├─ DeliveryPeople.tsx  # Gestão de motoboys
│  └─ Settings.tsx        # Configurações
├─ routes/
│  └─ index.tsx           # Configuração de rotas do React Router
├─ store/
│  └─ useUIStore.ts       # Zustand store (modais, sidebar)
├─ types/
│  └─ index.ts            # TypeScript types
├─ App.tsx                # Componente raiz + QueryClientProvider
└─ main.tsx               # Entry point + BrowserRouter
```

## �️ Fonte de Dados

A aplicação utiliza **JSON Server** como API mock, lendo dados do arquivo `db.json` na raiz do projeto.

### Estrutura do `db.json`

```json
{
  "routes": [
    {
      "id": "1",
      "externalId": "Rota #541",
      "status": "ready",
      "deliveryCount": 8,
      "startTime": "2025-10-17T10:30:00.000Z",
      "estimatedDuration": 120,
      "deliveryPerson": {
        "id": "1",
        "name": "João Silva",
        "avatarUrl": "https://i.pravatar.cc/150?img=1"
      }
    }
  ],
  "delivery-people": [
    {
      "id": "1",
      "name": "João Silva",
      "avatarUrl": "https://i.pravatar.cc/150?img=1"
    }
  ]
}
```

## �🔌 API Endpoints

A aplicação consome os seguintes endpoints do JSON Server (`http://localhost:3001`):

| Método | Endpoint           | Descrição                    |
| ------ | ------------------ | ---------------------------- |
| GET    | `/routes`          | Listar todas as rotas        |
| GET    | `/routes/:id`      | Obter uma rota específica    |
| GET    | `/delivery-people` | Listar todos os entregadores |
| PATCH  | `/routes/:id`      | Atualizar rota               |
| DELETE | `/routes/:id`      | Deletar rota                 |

### Exemplos de Requisições

**Atualizar status:**

```bash
PATCH http://localhost:3001/routes/1
Content-Type: application/json

{
  "status": "in_progress"
}
```

**Atribuir motoboy:**

```bash
PATCH http://localhost:3001/routes/1
Content-Type: application/json

{
  "deliveryPersonId": "2"
}
```

## 📝 Modelos de Dados

### Route

```typescript
interface Route {
  id: string;
  externalId: string; // Ex: "Rota #541"
  status: RouteStatus; // "ready" | "in_progress" | "completed"
  deliveryPerson?: DeliveryPerson;
  deliveryCount: number;
  startTime: string; // ISO 8601
  estimatedDuration: number; // Em minutos
}
```

### DeliveryPerson

```typescript
interface DeliveryPerson {
  id: string;
  name: string;
  avatarUrl?: string;
}
```

### Delivery (para modal de detalhes)

```typescript
interface Delivery {
  customerName: string;
  address: string;
  status: "aguardando" | "entregue" | "cancelada";
  estimatedTime: string;
  notes?: string;
}
```

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Iniciar apenas Vite dev server
npm run api          # Iniciar apenas JSON Server (porta 3001)
npm run dev:full     # Iniciar Vite + JSON Server simultaneamente
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Executar linter
```

## 🎨 Tema e Cores

O projeto usa a paleta de cores do iFood, definida em `src/index.css` usando a nova sintaxe do TailwindCSS v4:

```css
@theme {
  --color-ifood-red: #ea1d2c;
  --color-ifood-background: #f3f4f6;
  --color-sidebar-background: #f9fafb;
}
```

## 🗺️ Rotas da Aplicação

| Rota              | Componente       | Descrição                    |
| ----------------- | ---------------- | ---------------------------- |
| `/`               | Dashboard        | Dashboard principal (Kanban) |
| `/dashboard`      | Dashboard        | Alias para `/`               |
| `/rotas`          | RoutesPage       | Página de rotas              |
| `/rotas/:routeId` | RouteDetailsPage | Detalhes de uma rota         |
| `/motoboys`       | DeliveryPeople   | Gestão de motoboys           |
| `/configuracoes`  | Settings         | Configurações                |

## 🌐 Configuração para Produção

1. Atualizar `baseURL` em `src/api/routesApi.ts` para apontar para sua API real
2. Configurar variáveis de ambiente (`.env`)
3. Ajustar CORS no backend
4. Build:

```bash
npm run build
```

5. Os arquivos de produção estarão em `dist/`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto para fins educacionais e de demonstração.

---

**Desenvolvido com ❤️ para gestão eficiente de entregas! 🏍️**
