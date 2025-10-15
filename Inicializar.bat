@echo off
:: =============================================
:: Uadezap API - Iniciar Servidor (Automático)
:: Instala dependências e inicia a API
:: =============================================

title Uadezap API - Servidor WhatsApp
color 0a
cls

echo.
echo   #############################################
echo   #        Uadezap API - WhatsApp Server      #
echo   #         Iniciando...                      #
echo   #############################################
echo.

:: Vai para a pasta onde o .bat está
cd /d "%~dp0"

:: Verifica se o server.js existe
if not exist "server.js" (
    echo.
    echo ❌ ERRO: Arquivo 'server.js' não encontrado!
    echo    Verifique se este .bat está na pasta correta.
    echo.
    pause
    exit /b
)

:: Verifica se a pasta node_modules existe
if not exist "node_modules" (
    echo [✓] Primeira execução detectada.
    echo [✓] Instalando dependências com 'npm install'...
    echo.
    
    npm install
    
    if %errorLevel% NEQ 0 (
        echo.
        echo ❌ ERRO: Falha ao instalar as dependências.
        echo    Verifique sua conexão com a internet.
        echo    Ou instale o Node.js manualmente.
        echo.
        pause
        exit /b
    )
    
    echo.
    echo ✅ Dependências instaladas com sucesso!
    echo.
)

:: Verifica se o .env existe (opcional, mas recomendado)
if not exist ".env" (
    echo ⚠️  AVISO: Arquivo '.env' não encontrado.
    echo    A API pode usar chaves padrão.
    echo    Recomendado: crie um arquivo .env com API_KEY.
    echo.
)

:: Inicia o servidor
echo [✓] Iniciando a API do WhatsApp...
echo.
echo 🔗 Acesse: http://localhost:3000/qrcode
echo 🔐 Use o header: x-api-key: xxxxxxxxxxxxxxxxxxxxxxxx
echo.
echo (Para parar o servidor, pressione Ctrl + C)
echo.

node server.js

:: Se o servidor parar, mostra erro e espera
echo.
echo ❌ O servidor foi interrompido.
echo    Veja o erro acima.
echo.
pause