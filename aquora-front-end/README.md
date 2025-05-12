# Aquora Contact List - Frontend

Interface de usuário para aplicação de agenda de contatos, desenvolvida com React e TypeScript.

## Visão Geral

O frontend da aplicação Aquora Contact List oferece uma experiência de usuário moderna e intuitiva para:

- Visualização da lista de contatos
- Busca de contatos por nome, email ou telefone
- Adição, edição e exclusão de contatos
- Upload e visualização de fotos de perfil
- Feedback visual através de modais e notificações

## Tecnologias Utilizadas

- **React**: Biblioteca para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS para design moderno
- **Lucide React**: Ícones modernos e consistentes
- **Vite**: Ferramenta de build rápida e moderna

## Componentes Principais

### 1. ContactList
- Componente principal que gerencia o estado da aplicação
- Responsável por buscar e exibir contatos
- Coordena operações de adição, edição e exclusão

### 2. ContactCard
- Exibe informações de um contato individual
- Responsável pela renderização dos dados e imagem
- Fornece botões para editar e excluir

### 3. ContactModal
- Form para criar ou editar contatos
- Validação em tempo real
- Upload de imagem com pré-visualização

### 4. NotificationModal
- Exibe notificações e mensagens de confirmação
- Fornece feedback visual para ações importantes
- Mostra detalhes de alterações antes de confirmar

### 5. Componentes Auxiliares
- **SearchBar**: Componente de busca
- **ContactListHeader**: Cabeçalho da aplicação
- **ContactListStates**: Estados visuais (carregando, erro, vazio)

## Funcionalidades Destacadas

### Validação de Dados
- Validação em tempo real com feedback visual
- Regras específicas para nome, email, telefone e data
- Prevenção de datas futuras
- Verificação de integridade da imagem

### Formatação Inteligente
- Formatação de data para padrão brasileiro
- Formatação dinâmica de telefone (10 ou 11 dígitos)
- Formatação visual durante digitação

### Experiência de Usuário
- Estado de carregamento com indicadores visuais
- Tratamento de erros com mensagens amigáveis
- Confirmação para ações destrutivas
- Modais para resumo de alterações

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ContactList.tsx   # Componente principal
│   ├── ContactCard.tsx   # Card de contato individual
│   ├── ContactModal.tsx  # Modal de criação/edição
│   ├── NotificationModal.tsx  # Modais de notificação
│   ├── SearchBar.tsx     # Barra de busca
│   ├── ContactListHeader.tsx  # Cabeçalho da lista
│   └── ContactListStates.tsx  # Estados da lista
├── services/             # Comunicação com a API
│   └── api.ts            # Funções para requisições HTTP
├── types/                # Definições de tipos TypeScript
│   └── index.ts          # Interfaces de dados
├── utils/                # Funções utilitárias
│   ├── formatters.ts     # Formatadores (telefone, data)
│   └── validators.ts     # Validadores de entrada
└── App.tsx               # Componente raiz da aplicação
```

## Boas Práticas Adotadas

### 1. Componentização
- Componentes pequenos e reutilizáveis
- Separação clara de responsabilidades
- Props bem definidas com interfaces TypeScript

### 2. Gerenciamento de Estado
- Estado isolado em componentes específicos
- Propagação de eventos via props
- Feedback visual para todas as operações

### 3. Validação e Formatação
- Utilitários separados em arquivos específicos
- Validação em tempo real
- Feedback imediato para o usuário

### 4. UX/UI
- Design responsivo com Tailwind CSS
- Feedback visual para todas as ações
- Tratamento de estados de erro e carregamento
- Modais de confirmação para ações destrutivas

### 5. Qualidade de Código
- Nomes descritivos para variáveis e funções
- Código organizado e comentado
- Separação de lógica de negócio da interface 