# 📱 Manual de Uso - Nó Uadezap para n8n

## 🚀 Instalação

### 1. Instalar o Pacote
No n8n, vá em **Settings** → **Community Nodes** → **Install** e digite:
```
n8n-nodes-uadezap
```

### 2. Configurar Credenciais
1. Crie uma nova credencial do tipo **Uadezap API**
2. Preencha:
   - **API Key**: Sua chave da API Uadezap
   - **URL**: URL do seu servidor Uadezap (ex: `https://localhost:3000`)

---

## 📋 Operações Disponíveis

### 1. 📝 **Enviar Texto**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Text
- **Phone Number**: `5511999999999` (com código do país)
- **Message**: `Olá! Esta é uma mensagem de teste.`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Message: Olá! Como posso ajudá-lo hoje?
```

---

### 2. 🖼️ **Enviar Imagem**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Image
- **Phone Number**: `5511999999999`
- **Image URL**: `https://exemplo.com/imagem.jpg`
- **Image Caption**: `Legenda da imagem`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Image URL: https://exemplo.com/produto.jpg
Image Caption: Confira nosso novo produto!
```

---

### 3. 📄 **Enviar Documento**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Document
- **Phone Number**: `5511999999999`
- **Document URL**: `https://exemplo.com/documento.pdf`
- **Document Caption**: `Descrição do documento`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Document URL: https://exemplo.com/catalogo.pdf
Document Caption: Catálogo completo de produtos
```

---

### 4. 🎵 **Enviar Áudio**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Audio
- **Phone Number**: `5511999999999`
- **Audio URL**: `https://exemplo.com/audio.mp3`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Audio URL: https://exemplo.com/mensagem-voz.mp3
```

---

### 5. 🎥 **Enviar Vídeo**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Video
- **Phone Number**: `5511999999999`
- **Video URL**: `https://exemplo.com/video.mp4`
- **Video Caption**: `Legenda do vídeo`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Video URL: https://exemplo.com/demo.mp4
Video Caption: Demonstração do produto
```

---

### 6. 📍 **Enviar Localização**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Location
- **Phone Number**: `5511999999999`
- **Latitude**: `-23.5505`
- **Longitude**: `-46.6333`
- **Location Name**: `São Paulo, SP`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Latitude: -23.5505
Longitude: -46.6333
Location Name: Nossa loja em São Paulo
```

---

### 7. 👤 **Enviar Contato**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Contact
- **Phone Number**: `5511999999999`
- **Contact Name**: `João Silva`
- **Contact Phone**: `5511888888888`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Contact Name: Suporte Técnico
Contact Phone: 5511888888888
```

---

### 8. 🔘 **Enviar Botão**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Button
- **Phone Number**: `5511999999999`
- **Button Text**: `Acessar Site`
- **Button URL**: `https://meusite.com`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Button Text: Ver Catálogo
Button URL: https://meusite.com/catalogo
```

---

### 9. 📋 **Enviar Lista**

**Configuração:**
- **Resource**: Message
- **Operation**: Send List
- **Phone Number**: `5511999999999`
- **List Title**: `Escolha uma opção`
- **List Description**: `Selecione o que deseja fazer`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
List Title: Menu Principal
List Description: Escolha uma das opções abaixo
```

---

### 10. 📧 **Enviar Template**

**Configuração:**
- **Resource**: Message
- **Operation**: Send Template
- **Phone Number**: `5511999999999`
- **Template Name**: `meu_template`
- **Template Parameters**: `João,12345`

**Exemplo de Uso:**
```
Phone Number: 5511999999999
Template Name: boas_vindas
Template Parameters: Maria,empresa_xyz
```

---

## 🔧 Configuração Avançada

### Usando Variáveis do n8n
Você pode usar expressões do n8n em todos os campos:

```
Phone Number: {{ $json.telefone }}
Message: Olá {{ $json.nome }}, seu pedido {{ $json.pedido }} foi confirmado!
Image URL: {{ $json.imagem_url }}
```

### Workflow de Exemplo
1. **Webhook** - Recebe dados
2. **Uadezap** - Envia mensagem
3. **Email** - Confirma envio

---

## ⚠️ Troubleshooting

### Erro: "No such file or directory"
**Solução:** Reinstale o pacote:
1. Desinstale: `npm uninstall n8n-nodes-uadezap`
2. Reinstale: `npm install n8n-nodes-uadezap@latest`

### Erro: "Invalid phone number"
**Solução:** Use o formato correto:
- ✅ `5511999999999` (Brasil)
- ❌ `11999999999` (sem código do país)

### Erro: "API Key invalid"
**Solução:** Verifique se a API Key está correta nas credenciais

---

## 📞 Formato de Números de Telefone

### Brasil
- **Formato**: `55` + `DDD` + `Número`
- **Exemplo**: `5511999999999` (São Paulo)
- **Exemplo**: `5521987654321` (Rio de Janeiro)

### Outros Países
- **Argentina**: `54` + `DDD` + `Número`
- **México**: `52` + `DDD` + `Número`
- **EUA**: `1` + `DDD` + `Número`

---

## 🎯 Dicas de Uso

1. **Sempre teste** com seu próprio número primeiro
2. **Use URLs públicas** para mídias (imagens, vídeos, etc.)
3. **Mantenha mensagens curtas** para melhor legibilidade
4. **Configure webhooks** para receber confirmações
5. **Use templates** para mensagens padronizadas

---

## 📚 Exemplos Práticos

### E-commerce
```
Template: pedido_confirmado
Parameters: {{ $json.cliente }},{{ $json.pedido }},{{ $json.valor }}
```

### Suporte
```
Message: Olá {{ $json.nome }}! Seu chamado #{{ $json.ticket }} foi aberto.
```

### Marketing
```
Image URL: {{ $json.imagem_promocao }}
Image Caption: 🎉 Oferta especial! Válida até {{ $json.data_fim }}
```

---

**💡 Precisa de ajuda?** Consulte a documentação da API Uadezap ou abra uma issue no GitHub!
