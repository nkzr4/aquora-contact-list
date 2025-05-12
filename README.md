# Aquora Contact List

Aplicação completa de agenda de contatos com backend Java Spring Boot e frontend React.

## Visão Geral

Aquora Contact List é uma aplicação moderna para gerenciamento de contatos que permite salvar e organizar informações como nome, e-mail, telefone, data de nascimento e foto.

## Funcionalidades

- **Gerenciamento de Contatos**
  - CRUD completo (Criar, Ler, Atualizar, Excluir)
  - Fotos de perfil com validação de formato/tamanho
  - Paginação de resultados (10 contatos por página)

- **Interface Responsiva**
  - Design adaptativo para qualquer dispositivo
  - Tema claro/escuro com persistência
  - Feedback visual para todas as ações

- **Busca e Filtros**
  - Pesquisa por nome, e-mail ou telefone
  - Resultados em tempo real
  - Navegação entre páginas de resultados

- **Validação Avançada**
  - Nome: regras específicas de capitalização
  - E-mail/telefone: unicidade e formato
  - Data: prevenção de datas futuras
  - Imagens: formato, tamanho e integridade

## Tecnologias

### Backend
- Java 17
- Spring Boot
- PostgreSQL
- Spring Data JPA

### Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

## Boas Práticas Implementadas

- **Código Limpo**: Funções pequenas e focadas, nomes descritivos
- **Arquitetura em Camadas**: Backend e frontend bem estruturados
- **Validação Completa**: Cliente e servidor validam dados
- **Feedback Visual**: Indicadores para todas as ações
- **Responsividade**: Interface adaptativa para todos dispositivos
- **Segurança**: Proteção contra dados inválidos e sanitização

## Executando a Aplicação

### Com Docker (Recomendado)

Requisitos: Docker e Docker Compose

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/aquora-contact-list.git
cd aquora-contact-list

# Inicie a aplicação
docker-compose up -d

# Acesse
Frontend: http://localhost:5173
API: http://localhost:8080/api
Swagger: http://localhost:8080/api/swagger-ui.html
```

Para parar: `docker-compose down`

### Manualmente (Desenvolvimento)

Backend:
```bash
cd aquora-back-end
./mvnw spring-boot:run
```

Frontend:
```bash
cd aquora-front-end
npm install
npm run dev
```