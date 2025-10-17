@echo off
echo ========================================
echo    ATUALIZADOR N8N-NODES-UADEZAP
echo ========================================
echo.

echo [1/6] Verificando login no NPM...
npm whoami
if %errorlevel% neq 0 (
    echo ERRO: Voce nao esta logado no NPM!
    echo Execute: npm login
    pause
    exit /b 1
)
echo ✓ Login verificado!
echo.

echo [2/6] Lendo versao do package.json...
for /f "tokens=2 delims=:" %%a in ('findstr "version" package\package.json') do (
    set version=%%a
    set version=!version: =!
    set version=!version:,=!
    set version=!version:"=!
)
echo ✓ Versao encontrada: %version%
echo.

echo [3/6] Copiando arquivos dist para package...
if not exist package\dist mkdir package\dist
xcopy dist package\dist\ /E /I /Y /Q
echo ✓ Arquivos copiados!
echo.

echo [4/6] Testando pacote...
cd package
npm pack
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar pacote!
    pause
    exit /b 1
)
echo ✓ Pacote criado com sucesso!
echo.

echo [5/6] Verificando conteudo do pacote...
tar -tzf n8n-nodes-uadezap-%version%.tgz | findstr "dist"
if %errorlevel% neq 0 (
    echo AVISO: Arquivos dist podem nao estar incluidos!
)
echo ✓ Verificacao concluida!
echo.

echo [6/6] Publicando no NPM...
npm publish
if %errorlevel% neq 0 (
    echo ERRO: Falha ao publicar no NPM!
    pause
    exit /b 1
)
echo ✓ Publicado com sucesso!
echo.

echo ========================================
echo    PUBLICACAO CONCLUIDA!
echo ========================================
echo.
echo Versao: %version%
echo Pacote: n8n-nodes-uadezap@%version%
echo NPM: https://www.npmjs.com/package/n8n-nodes-uadezap
echo.

echo [OPCIONAL] Verificando publicacao...
npm view n8n-nodes-uadezap version
echo.

echo Limpando arquivos temporarios...
del n8n-nodes-uadezap-*.tgz
echo ✓ Limpeza concluida!
echo.

echo ========================================
echo    TUDO PRONTO! 🎉
echo ========================================
echo.
echo Para instalar no n8n:
echo 1. Vá em Settings → Community Nodes
echo 2. Digite: n8n-nodes-uadezap@%version%
echo 3. Instale e configure as credenciais
echo.
pause
