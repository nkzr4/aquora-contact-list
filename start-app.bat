@echo off
echo Iniciando a aplicacao Aquora Contact List...
echo.

echo Iniciando o banco de dados PostgreSQL com Docker...
cd aquora-back-end
start cmd /k "docker-compose up"
timeout /t 10

echo Iniciando o backend (Spring Boot)...
start cmd /k "cd aquora-back-end && mvnw spring-boot:run"
timeout /t 15

echo Iniciando o frontend (React)...
start cmd /k "cd aquora-front-end && npm run dev"

echo.
echo Todos os servicos foram iniciados!
echo - Backend: http://localhost:8080/api
echo - Frontend: http://localhost:5173
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo.
echo Pressione qualquer tecla para encerrar todos os servicos...

pause > nul

echo Encerrando os servicos...
taskkill /f /im cmd.exe /fi "windowtitle eq *aquora*"
taskkill /f /im java.exe

echo Aplicacao encerrada. 