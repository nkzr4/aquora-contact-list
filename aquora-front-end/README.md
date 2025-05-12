# Aquora Contact List - Frontend

Interface de usuário para agenda de contatos, desenvolvida com React e TypeScript.

## Visão Geral

Interface moderna e responsiva para:
- Visualização e busca de contatos com paginação
- Adição, edição e exclusão de contatos
- Upload de fotos de perfil
- Alternância entre temas claro e escuro
- Feedback visual através de modais

## Tecnologias

- **React**
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (ícones)
- **Vite**

## Componentes Principais

- **ContactList**: Gerenciamento central do estado da aplicação
- **ContactCard**: Exibição de contato individual
- **ContactModal**: Formulário para criação/edição
- **NotificationModal**: Sistema de feedback
- **ThemeToggle**: Alternância de temas claro/escuro
- **Pagination**: Navegação entre páginas de resultados

## Funcionalidades Destacadas

- **Validação em Tempo Real**: Feedback imediato durante digitação
- **Formatação Inteligente**: Telefone formatado automaticamente (10-11 dígitos)
- **Tema Escuro/Claro**: Persistência da preferência no localStorage
- **Paginação**: Navegação facilitada em listas grandes
- **Responsividade**: Adaptação para qualquer tamanho de tela

## Utilitários

- **Formatadores**: Funções para formatação de telefone e data
- **Validadores**: Regras específicas para cada campo
- **API Service**: Comunicação com o backend

## Experiência do Usuário

- Feedback visual para todas as ações
- Indicadores de carregamento
- Confirmação para operações destrutivas
- Resumo de alterações antes de salvar
- Navegação intuitiva entre páginas

## Execução

Para instruções de execução, consulte o README principal na raiz do projeto. 