# ========================================
#    ATUALIZADOR N8N-NODES-UADEZAP
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    ATUALIZADOR N8N-NODES-UADEZAP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# [1/6] Verificar login no NPM
Write-Host "[1/6] Verificando login no NPM..." -ForegroundColor Yellow
try {
    $npmUser = npm whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Não logado"
    }
    Write-Host "✓ Login verificado: $npmUser" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Você não está logado no NPM!" -ForegroundColor Red
    Write-Host "Execute: npm login" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host ""

# [2/6] Ler versão do package.json
Write-Host "[2/6] Lendo versão do package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package\package.json" | ConvertFrom-Json
$version = $packageJson.version
Write-Host "✓ Versão encontrada: $version" -ForegroundColor Green
Write-Host ""

# [3/6] Copiar arquivos dist para package
Write-Host "[3/6] Copiando arquivos dist para package..." -ForegroundColor Yellow
if (!(Test-Path "package\dist")) {
    New-Item -ItemType Directory -Path "package\dist" -Force | Out-Null
}
Copy-Item -Path "dist\*" -Destination "package\dist\" -Recurse -Force
Write-Host "✓ Arquivos copiados!" -ForegroundColor Green
Write-Host ""

# [4/6] Testar pacote
Write-Host "[4/6] Testando pacote..." -ForegroundColor Yellow
Set-Location "package"
try {
    npm pack | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao criar pacote"
    }
    Write-Host "✓ Pacote criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Falha ao criar pacote!" -ForegroundColor Red
    Set-Location ".."
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host ""

# [5/6] Verificar conteúdo do pacote
Write-Host "[5/6] Verificando conteúdo do pacote..." -ForegroundColor Yellow
$tarballContent = tar -tzf "n8n-nodes-uadezap-$version.tgz"
if ($tarballContent -match "dist") {
    Write-Host "✓ Arquivos dist incluídos!" -ForegroundColor Green
} else {
    Write-Host "AVISO: Arquivos dist podem não estar incluídos!" -ForegroundColor Yellow
}
Write-Host ""

# [6/6] Publicar no NPM
Write-Host "[6/6] Publicando no NPM..." -ForegroundColor Yellow
try {
    npm publish | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao publicar"
    }
    Write-Host "✓ Publicado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Falha ao publicar no NPM!" -ForegroundColor Red
    Set-Location ".."
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host ""

# Conclusão
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    PUBLICAÇÃO CONCLUÍDA!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Versão: $version" -ForegroundColor White
Write-Host "Pacote: n8n-nodes-uadezap@$version" -ForegroundColor White
Write-Host "NPM: https://www.npmjs.com/package/n8n-nodes-uadezap" -ForegroundColor Blue
Write-Host ""

# Verificar publicação
Write-Host "[OPCIONAL] Verificando publicação..." -ForegroundColor Yellow
$publishedVersion = npm view n8n-nodes-uadezap version
Write-Host "✓ Versão publicada: $publishedVersion" -ForegroundColor Green
Write-Host ""

# Limpeza
Write-Host "Limpando arquivos temporários..." -ForegroundColor Yellow
Remove-Item "n8n-nodes-uadezap-*.tgz" -Force
Write-Host "✓ Limpeza concluída!" -ForegroundColor Green
Write-Host ""

# Voltar ao diretório original
Set-Location ".."

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    TUDO PRONTO! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para instalar no n8n:" -ForegroundColor White
Write-Host "1. Vá em Settings → Community Nodes" -ForegroundColor White
Write-Host "2. Digite: n8n-nodes-uadezap@$version" -ForegroundColor White
Write-Host "3. Instale e configure as credenciais" -ForegroundColor White
Write-Host ""
Read-Host "Pressione Enter para sair"
