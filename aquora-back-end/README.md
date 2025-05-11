# Aquora Agenda de Contatos - Backend

Backend da aplicação de agenda de contatos desenvolvida como teste prático para vaga de desenvolvedor full stack.

## Tecnologias Utilizadas

- Java 17
- Spring Boot 3.2.5
- Spring Data JPA
- PostgreSQL
- Docker
- Swagger/OpenAPI para documentação
- JUnit e Mockito para testes

## Configuração e Execução

### Pré-requisitos

- JDK 17
- Maven
- Docker e Docker Compose

### Passos para Execução

1. Clone o repositório
2. Inicialize o banco de dados PostgreSQL usando Docker Compose:

```bash
cd aquora-back-end
docker-compose up -d
```

3. Execute a aplicação:

```bash
mvn spring-boot:run
```

4. A aplicação estará disponível em: http://localhost:8080/api
5. A documentação Swagger estará disponível em: http://localhost:8080/api/swagger-ui.html

## Estrutura do Projeto

- `model`: Classes de entidade que mapeiam para tabelas no banco de dados
- `dto`: Classes de transferência de dados
- `repository`: Interfaces para acesso ao banco de dados
- `service`: Serviços que contêm a lógica de negócios
- `controller`: Controladores REST que expõem as APIs
- `exception`: Classes para tratamento de exceções
- `validator`: Validadores personalizados
- `config`: Classes de configuração

## APIs Disponíveis

| Método | URL                   | Descrição                   |
|--------|----------------------|----------------------------|
| GET    | /api/contacts        | Listar todos os contatos    |
| GET    | /api/contacts?search=termo | Buscar contatos por termo |
| GET    | /api/contacts/{id}   | Obter contato por ID        |
| POST   | /api/contacts        | Criar novo contato          |
| PUT    | /api/contacts/{id}   | Atualizar contato existente |
| DELETE | /api/contacts/{id}   | Excluir contato             |

## Validações

A aplicação implementa várias validações para os dados dos contatos:

- **Nome**: Deve conter pelo menos dois nomes, cada um começando com letra maiúscula (exceto preposições)
- **Email**: Deve ser um email válido e único
- **Telefone**: Deve conter entre 10-11 dígitos e ser único
- **Data de Nascimento**: Obrigatória no formato YYYY-MM-DD 