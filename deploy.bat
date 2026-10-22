@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"

rem ============================================================
rem  DEPLOY - IA na Pratica
rem  Envia as alteracoes para o GitHub. O Cloudflare Pages,
rem  conectado ao repositorio, publica o site automaticamente.
rem  Uso: de dois cliques ou rode  deploy.bat "mensagem do commit"
rem ============================================================

set "REPO_URL=https://github.com/Lucas12es/IA_NAPRATICA.git"
set "BRANCH=main"

where git >nul 2>&1
if errorlevel 1 (
  echo [ERRO] Git nao encontrado. Instale em https://git-scm.com/download/win e tente de novo.
  goto :fim
)

rem --- 1. Primeira vez: liga esta pasta ao repositorio ---
if not exist ".git" (
  echo [1/4] Conectando esta pasta ao repositorio do GitHub...
  git init -b %BRANCH% || goto :erro
  git remote add origin %REPO_URL% || goto :erro
  git fetch origin || goto :erro
  git reset --mixed origin/%BRANCH% || goto :erro
) else (
  echo [1/4] Repositorio ja conectado.
  git remote get-url origin >nul 2>&1 || git remote add origin %REPO_URL%
)

rem --- 2. Mensagem do commit ---
set "MSG=%~1"
if "%MSG%"=="" (
  set /p MSG="Mensagem do commit (Enter = Atualizacao da landing page): "
)
if "%MSG%"=="" set "MSG=Atualizacao da landing page"

rem --- 3. Commit ---
echo [2/4] Preparando arquivos...
git add -A || goto :erro
git diff --cached --quiet
if not errorlevel 1 (
  echo Nenhuma alteracao nova para enviar.
  goto :sync
)
echo [3/4] Criando commit: %MSG%
git commit -m "%MSG%" || goto :erro

:sync
rem --- 4. Envio ---
echo [4/4] Enviando para o GitHub...
git pull --rebase origin %BRANCH%
git push -u origin %BRANCH% || goto :erro

echo.
echo ============================================================
echo  Pronto! Codigo enviado ao GitHub.
echo  O Cloudflare Pages vai publicar em ate 1-2 minutos.
echo ============================================================
goto :fim

:erro
echo.
echo [ERRO] Algo deu errado. Leia a mensagem acima.
echo Dica: se pedir login, entre na conta do GitHub (Lucas12es) na janela que abrir.

:fim
echo.
pause
endlocal
