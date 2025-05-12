# Aquora Contact List

Aplicação completa de agenda de contatos com backend em Java Spring Boot e frontend em React.

![Aquora Contact List](https://via.placeholder.com/800x400?text=Aquora+Contact+List)

## Visão Geral

Aquora Contact List é uma aplicação moderna para gerenciamento de contatos pessoais ou profissionais. A aplicação permite salvar informações de contatos como nome, e-mail, telefone, data de nascimento e foto, com uma interface amigável e funcionalidades avançadas.

## Funcionalidades Principais

- **Gerenciamento Completo de Contatos**
  - Adicionar, visualizar, editar e excluir contatos
  - Upload de fotos de perfil com validação de formato e tamanho
  - Formatação automática de telefone e data

- **Busca Avançada**
  - Pesquisa em tempo real por nome, e-mail ou telefone
  - Feedback visual para resultados da busca

- **Validação Rigorosa de Dados**
  - Validação de nome com regras específicas para capitalização
  - Verificação de e-mail e telefone com formatos válidos
  - Prevenção de datas futuras para nascimento
  - Validação de unicidade de contatos

- **Interface Intuitiva**
  - Layout responsivo e moderno
  - Temas de cores consistentes (light/dark mode)
  - Feedback visual para todas as ações
  - Modais para confirmação de ações importantes
  - Paginação para listas longas

## Arquitetura

O projeto segue uma arquitetura cliente-servidor:

### Backend (Java Spring Boot)

Implementa uma API RESTful com as seguintes camadas:
- **Controladores**: Gerenciamento de requisições HTTP
- **Serviços**: Lógica de negócio e validação
- **Repositórios**: Acesso ao banco de dados
- **DTOs**: Transferência de dados
- **Entidades**: Modelos de dados
- **Validadores**: Regras de validação personalizadas

### Frontend (React)

Implementa uma interface de usuário com:
- **Componentes**: Peças reutilizáveis da interface
- **Serviços**: Comunicação com a API
- **Utilitários**: Funções para formatação e validação
- **Tipos**: Definições de interfaces TypeScript

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Lombok
- Swagger/OpenAPI

### Frontend
- React
- TypeScript
- Tailwind CSS
- Lucide React (ícones)
- Vite (build)

## Como Executar a Aplicação

### Requisitos
- Docker e Docker Compose

### Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/aquora-contact-list.git
   cd aquora-contact-list
   ```

2. Inicie a aplicação usando Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Acesse a aplicação:
   - Frontend: http://localhost:5173
   - API Backend: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/api/swagger-ui.html

### Parando a Aplicação

Para parar todos os contêineres:
```bash
docker-compose down
```

Para parar e remover volumes (apaga o banco de dados):
```bash
docker-compose down -v
```

## Estrutura do Projeto

```
aquora-contact-list/
├── aquora-back-end/         # Código do backend
│   ├── src/                 # Código fonte
│   ├── Dockerfile           # Configuração Docker
│   └── pom.xml              # Dependências do Maven
├── aquora-front-end/        # Código do frontend
│   ├── src/                 # Código fonte
│   ├── Dockerfile           # Configuração Docker
│   ├── nginx.conf           # Configuração do Nginx
│   └── package.json         # Dependências do npm
└── docker-compose.yml       # Orquestração dos serviços
```

## Diferenciais

### Validação Avançada
- Regras personalizadas para nomes (capitalização, preposições)
- Verificação de integridade de arquivos de imagem
- Validação em tempo real

### Experiência de Usuário
- Feedback visual para cada ação
- Tratamento abrangente de erros
- Modais informativos para confirmações
- Animações sutis para transições
- Tema escuro/claro

### Segurança
- Validação de dados no cliente e servidor
- Sanitização de entrada e saída
- Tratamento de CORS configurável
- Limitação de tamanho para uploads

### Manutenção
- Código modular e organizado
- Arquitetura em camadas
- Logs detalhados para depuração
- Tratamento centralizado de exceções

## Boas Práticas Adotadas

- **Código Limpo**: Nomes descritivos, funções pequenas e focadas
- **DRY (Don't Repeat Yourself)**: Extração de código repetitivo em utilitários
- **Separação de Responsabilidades**: Componentes e serviços com funções bem definidas
- **Tratamento Abrangente de Erros**: Feedback claro para todas as situações
- **Logging**: Registro de eventos importantes para depuração
- **Controle de Versão**: Commits organizados e descritivos

## Considerações de Design

- **Responsividade**: Layout adaptável a diferentes tamanhos de tela
- **Acessibilidade**: Elementos com descrições e papéis adequados
- **Consistência Visual**: Padrão de cores e elementos em toda a aplicação
- **Feedback Visual**: Indicadores de carregamento, sucesso e erro