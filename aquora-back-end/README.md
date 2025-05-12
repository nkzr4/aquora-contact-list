# Aquora Contact List - Backend

API RESTful para gerenciamento de contatos, desenvolvida com Spring Boot.

## Visão Geral

O backend da aplicação Aquora Contact List é responsável por:

- Cadastro, atualização, exclusão e consulta de contatos
- Validação de dados
- Busca por termo (nome, email ou telefone)
- Armazenamento de fotos de perfil

## Tecnologias Utilizadas

- **Java 17**: Linguagem de programação principal
- **Spring Boot**: Framework para criação de APIs RESTful
- **Spring Data JPA**: Persistência de dados
- **PostgreSQL**: Banco de dados relacional
- **Lombok**: Redução de código boilerplate
- **Swagger/OpenAPI**: Documentação da API

## Arquitetura

A aplicação segue uma arquitetura em camadas:

### 1. Controladores (Controller)
- Recebem requisições HTTP
- Delegam processamento para serviços
- Retornam respostas HTTP apropriadas

### 2. Serviços (Service)
- Implementam a lógica de negócio
- Validam dados
- Fazem operações no banco de dados via Repository

### 3. Repositórios (Repository)
- Interagem com o banco de dados
- Implementam consultas personalizadas

### 4. Modelos e DTOs
- **Model**: Representam entidades do banco
- **DTO**: Objetos para transferência de dados

### 5. Validadores
- Implementam regras específicas de validação
- Garantem a integridade dos dados

### 6. Tratamento de Exceções
- Centralizado com `@ControllerAdvice`
- Padronização de respostas de erro

## Funcionalidades Principais

### Gerenciamento de Contatos
- Criar, atualizar, excluir e listar contatos
- Buscar contatos por termo (nome, email, telefone)
- Upload de fotos de perfil

### Validações
- Nome completo com regras específicas (capitalização, preposições)
- Email válido e único
- Telefone com 10-11 dígitos e único
- Data de nascimento não pode ser no futuro

## Boas Práticas Adotadas

1. **Separação de Responsabilidades**:
   - Camadas bem definidas
   - Classes com propósito único

2. **Tratamento de Erros**:
   - Exceções personalizadas
   - Respostas de erro padronizadas

3. **Segurança**:
   - Validação de entrada de dados
   - Sanitização de saída

4. **Logging**:
   - Registro de eventos importantes
   - Informações úteis para depuração

5. **Documentação**:
   - API documentada com Swagger/OpenAPI
   - Comentários explicando detalhes importantes

## Endpoints da API

A API disponibiliza os seguintes endpoints:

- `GET /api/contacts`: Lista todos os contatos (aceita parâmetro `search`)
- `GET /api/contacts/{id}`: Busca um contato específico
- `POST /api/contacts`: Cria um novo contato
- `PUT /api/contacts/{id}`: Atualiza um contato existente
- `DELETE /api/contacts/{id}`: Remove um contato

## Estrutura de Diretórios

```
src/main/java/com/aquora/contacts/
├── config/        # Configurações (CORS, Multipart)
├── controller/    # Controladores REST
├── dto/           # Objetos de Transferência de Dados
├── exception/     # Exceções personalizadas
├── model/         # Entidades JPA
├── repository/    # Interfaces de repositório
├── service/       # Serviços com lógica de negócio
└── validator/     # Validadores personalizados
``` 