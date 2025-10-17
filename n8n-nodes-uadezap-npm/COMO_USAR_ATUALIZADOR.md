# 🚀 Como Usar o Atualizador Automático

## 📋 Passo a Passo Simples

### 1. **Alterar Versão**
Edite o arquivo `package/package.json` e mude apenas a versão:
```json
{
  "version": "0.1.14"  ← Mude apenas aqui
}
```

### 2. **Executar o Atualizador**

#### Opção A: Windows (CMD)
```bash
ATUALIZAR_NPM.bat
```

#### Opção B: PowerShell
```powershell
.\ATUALIZAR_NPM.ps1
```

### 3. **Pronto!** 🎉
O script fará tudo automaticamente:
- ✅ Verifica login no NPM
- ✅ Copia arquivos necessários
- ✅ Testa o pacote
- ✅ Publica no NPM
- ✅ Verifica a publicação
- ✅ Limpa arquivos temporários

---

## 🔧 O que o Script Faz

1. **Verifica** se você está logado no NPM
2. **Lê** a versão do `package.json`
3. **Copia** arquivos da pasta `dist` para `package/dist`
4. **Testa** o pacote com `npm pack`
5. **Publica** no NPM com `npm publish`
6. **Verifica** se a publicação foi bem-sucedida
7. **Limpa** arquivos temporários

---

## ⚠️ Requisitos

- ✅ Node.js instalado
- ✅ NPM configurado e logado
- ✅ Arquivos na pasta `dist` atualizados
- ✅ Versão no `package.json` incrementada

---

## 🐛 Problemas Comuns

### Erro: "Não logado no NPM"
**Solução:**
```bash
npm login
```

### Erro: "Versão já existe"
**Solução:**
Incremente a versão no `package.json`

### Erro: "Arquivos dist não encontrados"
**Solução:**
Verifique se a pasta `dist` existe e tem os arquivos

---

## 📁 Estrutura Necessária

```
projeto/
├── package/
│   ├── package.json ← Mude a versão aqui
│   ├── index.js
│   └── dist/ ← Criado automaticamente
├── dist/ ← Deve existir com os arquivos
│   ├── nodes/Uadezap/
│   └── credentials/
├── ATUALIZAR_NPM.bat ← Execute este
└── ATUALIZAR_NPM.ps1 ← Ou este
```

---

## 💡 Dicas

1. **Sempre teste** localmente antes de publicar
2. **Incremente** a versão corretamente (0.1.13 → 0.1.14)
3. **Mantenha** os arquivos `dist` atualizados
4. **Verifique** se a publicação foi bem-sucedida

---

**🎯 Agora é só alterar a versão e executar o script!**
