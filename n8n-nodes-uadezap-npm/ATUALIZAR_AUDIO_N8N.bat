@echo off
echo ========================================
echo   ATUALIZANDO N8N NODE UADEZAP AUDIO
echo ========================================
echo.

echo [1/4] Entrando na pasta do pacote...
cd n8n-nodes-uadezap-npm\package

echo [2/4] Gerando novo pacote...
call npm pack

echo [3/4] Listando arquivos gerados...
dir *.tgz

echo [4/4] Concluido!
echo.
echo ========================================
echo   INSTRUCOES PARA INSTALAR NO N8N:
echo ========================================
echo.
echo 1. Copie o arquivo .tgz mais recente
echo 2. No N8N, va em Settings ^> Community Nodes
echo 3. Clique em "Install a community node"
echo 4. Cole o caminho do arquivo .tgz
echo 5. Instale e reinicie o N8N
echo.
echo ========================================
echo   CORRECOES APLICADAS:
echo ========================================
echo.
echo ✅ Audio Type com configuracoes para smartphone
echo ✅ PTT automatico baseado no tipo
echo ✅ Mimetype otimizado (OGG Opus para voice)
echo ✅ Suporte a URL e Base64
echo ✅ Logs detalhados no servidor
echo.
echo ========================================
echo   COMO USAR:
echo ========================================
echo.
echo 📱 Para smartphone: "Voice Message (PTT) - Smartphone"
echo 🌐 Para web: "Music/Audio File - Web"
echo.
echo ========================================
pause
