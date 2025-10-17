@echo off
echo ========================================
echo    PROCURADOR DE ARQUIVO ORIGINAL
echo ========================================
echo.

echo [1/3] Procurando arquivo .js principal...
echo.

echo 📋 Procurando em subpastas...
for /r . %%f in (*.js) do (
    echo Encontrado: %%f
    findstr /C:"class Uadezap" "%%f" >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✓ ARQUIVO PRINCIPAL ENCONTRADO: %%f
        echo.
        echo Conteudo do arquivo:
        echo ========================================
        type "%%f"
        echo ========================================
        echo.
        pause
        goto :fim
    )
)

echo ❌ Arquivo principal nao encontrado!
echo.
echo Por favor, me informe:
echo 1. O caminho da pasta do seu projeto Git
echo 2. Ou copie a pasta do projeto Git para esta pasta
echo.

:fim
pause
