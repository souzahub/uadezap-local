@echo off
:: =============================================
:: Uadezap API - Limpar Sessão WhatsApp
:: Remove a pasta de autenticação para forçar novo QR Code
:: =============================================

title Uadezap API - Limpar Sessão
color 0c
cls

echo.
echo   #############################################
echo   #        LIMPEZA DE SESSÃO WHATSAPP        #
echo   #############################################
echo.
echo   ATENCAO: Isso ira desconectar o WhatsApp atual.
echo   Voce precisara escanear o QR Code novamente.
echo.
echo   IMPORTANTE: Feche o servidor (janela do Inicializar.bat) antes de continuar!
echo.
echo   Pressione qualquer tecla para confirmar ou feche a janela para cancelar.
pause >nul

cd /d "%~dp0"

if exist "auth_info_baileys_local" (
    echo.
    echo [!] Removendo pasta de sessao...
    rmdir /s /q "auth_info_baileys_local"
    
    if exist "auth_info_baileys_local" (
        echo.
        echo [X] Falha ao remover. Verifique se o servidor esta fechado e tente novamente.
    ) else (
        echo.
        echo [V] Sessao removida com sucesso!
        echo     Na proxima inicializacao, um novo QR Code sera gerado.
    )
) else (
    echo.
    echo [!] A pasta de sessao nao existe ou ja foi apagada.
)

echo.
pause