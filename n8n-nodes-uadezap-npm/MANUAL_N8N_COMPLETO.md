# 📱 Uadezap N8N Node - Documentação Completa

## 🎯 Visão Geral
Este é o componente N8N para integração com a API Uadezap. Ele permite enviar mensagens do WhatsApp através do N8N usando todas as funcionalidades disponíveis no projeto principal.

## 🔧 Instalação
```bash
npm install n8n-nodes-uadezap
```

## ⚙️ Configuração

### 1. Credenciais
Configure as credenciais da API Uadezap:
- **API Key**: Sua chave de API (ex: `minha123senha`)
- **URL**: URL do seu servidor Uadezap (ex: `http://localhost:3000`)

### 2. Operações Disponíveis

#### 📝 **Send Text** - Envio de Texto
- **Phone Number**: Número do destinatário (ex: `5521999999999`)
- **Message**: Texto da mensagem

#### 🖼️ **Send Image** - Envio de Imagem
- **Phone Number**: Número do destinatário
- **Image**: URL da imagem ou base64
- **Caption**: Legenda da imagem (opcional)

#### 🎥 **Send Video** - Envio de Vídeo
- **Phone Number**: Número do destinatário
- **Video**: URL do vídeo ou base64
- **Caption**: Legenda do vídeo (opcional)

#### 🎵 **Send Audio** - Envio de Áudio
- **Phone Number**: Número do destinatário
- **Audio**: URL do áudio ou base64

#### 📄 **Send Document** - Envio de Documento
- **Phone Number**: Número do destinatário
- **Document**: URL do documento ou base64
- **Caption**: Legenda do documento (opcional)

#### 📍 **Send Location** - Envio de Localização
- **Phone Number**: Número do destinatário
- **Latitude**: Coordenada de latitude
- **Longitude**: Coordenada de longitude
- **Name**: Nome do local (opcional)
- **Address**: Endereço do local (opcional)

#### 👤 **Send Contact** - Envio de Contato
- **Phone Number**: Número do destinatário
- **Contact Name**: Nome do contato
- **Contact Phone**: Telefone do contato

#### 🔘 **Send Button** - Envio de Botões Interativos
- **Phone Number**: Número do destinatário
- **Text**: Texto principal da mensagem
- **Buttons**: Coleção de botões (máximo 3)
  - **Button ID**: ID único do botão
  - **Display Text**: Texto exibido no botão (máx 25 caracteres)
- **Header Text**: Título da mensagem (opcional)
- **Footer Text**: Rodapé da mensagem (opcional)

#### 📋 **Send List** - Envio de Lista
- **Phone Number**: Número do destinatário
- **List Title**: Título da lista
- **List Description**: Descrição da lista
- **List Items**: Coleção de itens (máximo 10)
  - **Item ID**: ID único do item
  - **Item Title**: Título do item (máx 24 caracteres)
  - **Item Description**: Descrição do item (máx 72 caracteres)

#### 📧 **Send Template** - Envio de Template
- **Phone Number**: Número do destinatário
- **Template Name**: Nome do template
- **Template Parameters**: Parâmetros do template (separados por vírgula)

## 🚀 Exemplos de Uso

### Exemplo 1: Envio de Texto
```json
{
  "number": "5521999999999",
  "message": "Olá! Esta é uma mensagem de teste."
}
```

### Exemplo 2: Envio de Botões
```json
{
  "number": "5521999999999",
  "text": "Escolha uma opção:",
  "headerText": "Menu Principal",
  "footerText": "Responda com um dos botões",
  "buttons": [
    {
      "id": "opcao1",
      "displayText": "Ver Produtos"
    },
    {
      "id": "opcao2",
      "displayText": "Suporte"
    }
  ]
}
```

### Exemplo 3: Envio de Lista
```json
{
  "number": "5521999999999",
  "listTitle": "Produtos",
  "listDescription": "Escolha um produto:",
  "listItems": [
    {
      "id": "produto1",
      "title": "Smartphone",
      "description": "Smartphone Android 128GB"
    },
    {
      "id": "produto2",
      "title": "Notebook",
      "description": "Notebook Intel i7 16GB"
    }
  ]
}
```

## 🔄 Compatibilidade
- ✅ **N8N**: Versão 1.0+
- ✅ **Node.js**: Versão 20.15+
- ✅ **API Uadezap**: Versão 1.0.1+

## 📋 Mapeamento de Endpoints
| Operação N8N | Endpoint API |
|---|---|
| `sendText` | `/send-text` |
| `sendImage` | `/send-image` |
| `sendVideo` | `/send-video` |
| `sendAudio` | `/send-audio` |
| `sendDocument` | `/send-document` |
| `sendLocation` | `/send-location` |
| `sendContact` | `/send-contact` |
| `sendButton` | `/send-buttons` |
| `sendList` | `/send-list` |
| `sendTemplate` | `/send-template` |

## ⚠️ Limitações
- **Botões**: Máximo 3 botões por mensagem
- **Lista**: Máximo 10 itens por lista
- **Texto do botão**: Máximo 25 caracteres
- **Título do item**: Máximo 24 caracteres
- **Descrição do item**: Máximo 72 caracteres

## 🐛 Solução de Problemas

### Erro de Conexão
- Verifique se a URL da API está correta
- Confirme se a API Key está válida
- Teste a conectividade com `/status`

### Erro de Parâmetros
- Verifique se todos os campos obrigatórios estão preenchidos
- Confirme se os formatos dos dados estão corretos
- Verifique as limitações de caracteres

## 📞 Suporte
- **Desenvolvedor**: Luan Souza de Siqueira
- **Email**: luansouza.ti29@gmail.com
- **Versão**: 0.1.18

---
*Desenvolvido com ❤️ para integração WhatsApp via N8N*
