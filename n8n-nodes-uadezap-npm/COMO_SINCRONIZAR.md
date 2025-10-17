# 🔄 Como Sincronizar os Projetos

## 📋 Preparação

### 1. **Estrutura de Pastas**
Organize as pastas assim:
```
projeto/
├── n8n_local/          ← Projeto do Git
│   ├── package.json
│   ├── index.js
│   ├── dist/
│   └── ...
├── package/             ← Projeto local (n8n)
│   ├── package.json
│   ├── index.js
│   ├── dist/
│   └── ...
├── SINCRONIZAR_PROJETOS.bat
└── SINCRONIZAR_PROJETOS.ps1
```

### 2. **Copiar Projeto Git**
Se você ainda não tem a pasta `n8n_local`:
```bash
# Copie o projeto do Git para a pasta n8n_local
git clone [URL_DO_SEU_REPOSITORIO] n8n_local
```

## 🚀 Executar Sincronização

### Opção A: Windows CMD
```bash
SINCRONIZAR_PROJETOS.bat
```

### Opção B: PowerShell
```powershell
.\SINCRONIZAR_PROJETOS.ps1
```

## 🔧 O que o Script Faz

### 1. **Verifica Estrutura**
- ✅ Confirma se ambas as pastas existem
- ✅ Verifica arquivos principais

### 2. **Compara Arquivos**
- 📋 `package.json` - versões e configurações
- 📋 `index.js` - código principal
- 📋 `dist/` - arquivos compilados
- 📋 Outros arquivos importantes

### 3. **Sincroniza do Local para Git**
- 📤 Copia `package/dist/` → `n8n_local/dist/`
- 📤 Copia `package/package.json` → `n8n_local/package.json`
- 📤 Copia `package/index.js` → `n8n_local/index.js`
- 📤 Copia outros arquivos necessários

### 4. **Sincroniza do Git para Local**
- 📥 Copia `n8n_local/src/` → `src/` (se existir)
- 📥 Copia `n8n_local/nodes/` → `nodes/` (se existir)
- 📥 Copia `n8n_local/credentials/` → `credentials/` (se existir)
- 📥 Copia outros arquivos únicos

### 5. **Relatório Final**
- 📊 Mostra diferenças encontradas
- 📊 Lista arquivos copiados
- 📊 Versão atual do projeto

## 📋 Após a Sincronização

### 1. **Verificar no Git**
```bash
cd n8n_local
git status
git add .
git commit -m "Sincronização com projeto local"
git push
```

### 2. **Testar Localmente**
```bash
# Testar o nó
node TESTAR_NODE.cjs

# Se tudo OK, publicar
cd package
npm publish
```

### 3. **Atualizar no n8n**
- Desinstalar versão anterior
- Instalar nova versão
- Testar no n8n

## ⚠️ Problemas Comuns

### Erro: "Pasta n8n_local não encontrada"
**Solução:** Crie a pasta e copie o projeto do Git para ela

### Erro: "Arquivos diferentes"
**Solução:** O script vai sincronizar automaticamente

### Conflitos de Versão
**Solução:** O script usa a versão do projeto local como referência

## 💡 Dicas

1. **Execute sempre** antes de publicar
2. **Verifique** o relatório de diferenças
3. **Teste** após sincronização
4. **Faça commit** das mudanças no Git
5. **Mantenha** ambos os projetos atualizados

## 🎯 Fluxo Recomendado

1. **Desenvolver** no projeto local
2. **Testar** com `TESTAR_NODE.cjs`
3. **Sincronizar** com `SINCRONIZAR_PROJETOS.ps1`
4. **Commitar** no Git
5. **Publicar** no NPM
6. **Atualizar** no n8n

---

**🚀 Agora você pode manter ambos os projetos sincronizados facilmente!**
