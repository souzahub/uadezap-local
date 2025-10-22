# 📦 Passo a Passo para Publicar no NPM

## 🚀 Guia Rápido de Publicação

### 1. **Verificar Login no NPM**
```bash
npm whoami
```
Se não estiver logado:
```bash
npm login
```

### 2. **Atualizar Versão**
Editar o arquivo `package/package.json` e alterar a versão:
```json
{
  "version": "0.1.12"  // ← Incrementar aqui
}
```

### 3. **Testar o Pacote**
```bash
cd package
npm pack
```
Verificar se todos os arquivos estão incluídos:
```bash
tar -tzf n8n-nodes-uadezap-0.1.12.tgz
```

### 4. **Publicar no NPM**
```bash
npm publish
```

### 5. **Verificar Publicação**
```bash
npm view n8n-nodes-uadezap version
```

---

## 📋 **Checklist Rápido**

- [ ] ✅ Login no NPM (`npm whoami`)
- [ ] ✅ Versão atualizada no `package.json`
- [ ] ✅ Teste do pacote (`npm pack`)
- [ ] ✅ Publicação (`npm publish`)
- [ ] ✅ Verificação (`npm view n8n-nodes-uadezap version`)

---

## 🔄 **Tipos de Versão**

- **Patch (0.1.11 → 0.1.12)**: Correções de bugs
- **Minor (0.1.11 → 0.2.0)**: Novas funcionalidades
- **Major (0.1.11 → 1.0.0)**: Mudanças que quebram compatibilidade

---

## ⚠️ **Problemas Comuns**

### Erro: "Version already exists"
- Incrementar a versão no `package.json`

### Erro: "Not logged in"
- Fazer login: `npm login`

### Erro: "Permission denied"
- Verificar se você é o owner do pacote

---

## 🎯 **Comandos Essenciais**

```bash
# Verificar versão atual
npm view n8n-nodes-uadezap version

# Ver todas as versões
npm view n8n-nodes-uadezap versions

# Instalar a versão mais recente
npm install n8n-nodes-uadezap@latest
```

---

**💡 Dica:** Sempre teste com `npm pack` antes de publicar!

### codigo completo
npm whoami
cd package
npm pack
npm publish