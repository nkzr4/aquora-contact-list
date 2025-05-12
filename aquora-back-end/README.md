# Aquora Contact List - Backend

API RESTful para gerenciamento de contatos desenvolvida com Spring Boot.

## Visão Geral

Backend responsável por:
- Gerenciamento completo de contatos (CRUD)
- Validação de dados
- Busca por termo (nome, email, telefone)
- Armazenamento de imagens de perfil
- Paginação de resultados

## Tecnologias

- **Java 17**
- **Spring Boot**
- **Spring Data JPA**
- **PostgreSQL**
- **Lombok**
- **Swagger/OpenAPI**

## Arquitetura

Estrutura em camadas:

- **Controller**: Gerencia endpoints e requisições HTTP
- **Service**: Implementa lógica de negócio e validação
- **Repository**: Interage com o banco de dados
- **DTOs/Model**: Transferência e persistência de dados
- **Validators**: Regras específicas de validação
- **Exception Handler**: Tratamento centralizado de erros

## Endpoints API

- `GET /api/contacts?page=0&size=10`: Lista contatos com paginação
- `GET /api/contacts?search=termo&page=0&size=10`: Busca contatos por termo
- `GET /api/contacts/{id}`: Busca contato por ID
- `POST /api/contacts`: Cria novo contato
- `PUT /api/contacts/{id}`: Atualiza contato existente
- `DELETE /api/contacts/{id}`: Remove contato

## Validações

- Nome: formato com capitalização e preposições corretas
- Email: formato válido e unicidade
- Telefone: 10-11 dígitos e unicidade
- Data de nascimento: não permite datas futuras
- Foto: validação de formato e tamanho

## Execução

Para instruções de execução, consulte o README principal na raiz do projeto. 