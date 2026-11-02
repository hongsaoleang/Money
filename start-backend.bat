@echo off
echo Starting Spring Boot Backend...
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
pause
