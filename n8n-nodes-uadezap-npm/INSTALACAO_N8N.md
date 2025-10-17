# 🔧 Guia de Instalação - n8n-nodes-uadezap

## ⚠️ Problema Resolvido na Versão 0.1.12

O erro "ENOENT: no such file or directory" foi corrigido na versão **0.1.12**.

---

## 🚀 Instalação Correta

### 1. **Desinstalar Versão Anterior (se houver)**
```bash
# No terminal do n8n
npm uninstall n8n-nodes-uadezap
```

### 2. **Instalar Versão Corrigida**
No n8n:
1. Vá em **Settings** → **Community Nodes**
2. Clique em **Install**
3. Digite: `n8n-nodes-uadezap@0.1.12`
4. Marque a caixa de confirmação
5. Clique em **Install**

### 3. **Verificar Instalação**
Após a instalação, você deve ver:
- ✅ Nó **Uadezap** disponível na lista de nós
- ✅ Credencial **Uadezap API** disponível

---

## 🔄 Atualização Manual (se necessário)

Se ainda houver problemas, faça a instalação manual:

### Via Terminal (Docker)
```bash
# Acesse o container do n8n
docker exec -it n8n_container_name bash

# Instale o pacote
npm install n8n-nodes-uadezap@0.1.12

# Reinicie o n8n
exit
docker restart n8n_container_name
```

### Via Terminal (Instalação Local)
```bash
# Navegue até a pasta do n8n
cd /caminho/para/n8n

# Instale o pacote
npm install n8n-nodes-uadezap@0.1.12

# Reinicie o n8n
npm run start
```

---

## ✅ Verificação da Instalação

### 1. **Verificar Arquivos**
Os seguintes arquivos devem existir:
```
~/.n8n/nodes/node_modules/n8n-nodes-uadezap/
├── dist/
│   ├── nodes/Uadezap/
│   │   ├── Uadezap.node.js ✅
│   │   └── uadezap.svg ✅
│   └── credentials/
│       └── UadezapApi.credentials.js ✅
├── index.js ✅
└── package.json ✅
```

### 2. **Testar no n8n**
1. Crie um novo workflow
2. Adicione um nó **Uadezap**
3. Configure as credenciais
4. Teste uma operação simples

---

## 🐛 Troubleshooting

### Erro: "Package could not be loaded"
**Solução:**
```bash
# Desinstalar
npm uninstall n8n-nodes-uadezap

# Instalar versão específica
npm install n8n-nodes-uadezap@0.1.12
```

### Erro: "No such file or directory"
**Solução:**
1. Verifique se está usando a versão 0.1.12
2. Reinstale o pacote
3. Reinicie o n8n

### Nó não aparece na lista
**Solução:**
1. Verifique se a instalação foi bem-sucedida
2. Reinicie o n8n
3. Limpe o cache do navegador

---

## 📋 Checklist de Instalação

- [ ] ✅ n8n está rodando
- [ ] ✅ Versão 0.1.12 instalada
- [ ] ✅ Arquivos presentes em `dist/`
- [ ] ✅ Nó Uadezap aparece na lista
- [ ] ✅ Credencial Uadezap API disponível
- [ ] ✅ Teste básico funcionando

---

## 🎯 Próximos Passos

Após a instalação bem-sucedida:

1. **Configure as credenciais** (API Key e URL)
2. **Teste com seu número** primeiro
3. **Consulte o manual de uso** (`MANUAL_USO_UADEZAP.md`)
4. **Crie seus workflows** de automação

---

**💡 Dica:** Se ainda houver problemas, verifique os logs do n8n para mais detalhes do erro.
