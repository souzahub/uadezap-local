# Uadezap API (Evolution-like)

# Pegar Versao atual do Navegador
F12 no navegado e digite: window.Debug.VERSION

Este projeto implementa uma API para integração com o WhatsApp, utilizando a biblioteca `@whiskeysockets/baileys`. Ele visa fornecer funcionalidades semelhantes às APIs de WhatsApp existentes, como a Evolution API, permitindo o envio e recebimento de mensagens, além de oferecer uma interface web para gerenciar a conexão e visualizar o status.

## Funcionalidades Principais

*   **Conexão e Gerenciamento do WhatsApp**:
    *   Utiliza `@whiskeysockets/baileys` para gerenciar a conexão com o WhatsApp.
    *   Geração de QR Code para autenticação inicial.
    *   Reconexão automática em caso de desconexão (exceto logout manual).
    *   Armazenamento de credenciais (`auth_info_baileys_local`).
*   **Envio de Mensagens**:
    *   Suporte para diversos tipos de mídia: texto, imagem, vídeo, áudio (PTT), documento, localização, sticker, contato.
    *   API RESTful para fácil integração.
*   **Recebimento de Mensagens**:
    *   Captura e armazenamento de mensagens recebidas.
    *   Filtro de mensagens promocionais em grupos e comunidades.
    *   Envio de mensagens recebidas para um webhook configurável (ex: n8n).
    *   Endpoint para o Delphi buscar mensagens pendentes.
*   **Autenticação**:
    *   Utiliza `API_KEY` para proteger os endpoints da API.
*   **Interface Web**:
    *   Página inicial (`/`) para exibir o status da conexão, a versão da API, a porta e a data do último ligamento do servidor.
    *   Página de QR Code (`/qrcode`) para facilitar a leitura.
    *   Endpoint de status em JSON (`/status`).
*   **Logs Personalizados**:
    *   Sistema de log que limpa o console periodicamente para melhor visibilidade.

## Configuração

O projeto utiliza variáveis de ambiente para configuração. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```dotenv
PORT=3000
API_KEY=minha123senha_segura
N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/seu-webhook-id # Opcional: URL do seu webhook (ex: n8n)
```

*   `PORT`: Porta em que o servidor Express será executado. (Padrão: 3000)
*   `API_KEY`: Chave de API para autenticar as requisições aos endpoints protegidos. **Mude para uma chave forte e segura!** (Padrão: `minha123senha`)
*   `N8N_WEBHOOK_URL`: (Opcional) A URL do seu webhook para onde as mensagens recebidas serão enviadas. Se não for definido ou estiver incorreto, as mensagens continuarão sendo processadas internamente, mas não serão enviadas externamente.

## Como Rodar o Projeto

1.  **Clone o Repositório** (se ainda não o fez):
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd uadezap-local
    ```

2.  **Instale as Dependências**:
    ```bash
    npm install
    ```

3.  **Crie o arquivo `.env`**:
    Siga as instruções na seção [Configuração](#configuração) para criar seu arquivo `.env`.

4.  **Inicie o Servidor**:
    ```bash
    node server.js
    ```
    Ou, para rodar em modo de desenvolvimento com `nodemon` (se instalado):
    ```bash
    nodemon server.js
    ```

5.  **Acesse a Interface Web**:
    Abra seu navegador e acesse `http://localhost:PORT/` (substitua `PORT` pela porta configurada no seu `.env`, padrão 3000).

## Endpoints da API

Todos os endpoints `POST` exigem a chave de API (definida em `API_KEY`) no header `x-api-key` ou como parâmetro de query `api_key`.

---

### `GET /`

*   **Descrição**: Página inicial da API, exibe o status da conexão, a versão e informações do servidor.
*   **Autenticação**: Não requer.

### `GET /status`

*   **Descrição**: Retorna o status da API em formato JSON.
*   **Autenticação**: Não requer.
*   **Resposta de Exemplo**:
    ```json
    {
        "status": "connected",
        "qr": false,
        "version": "1.0.1",
        "node_version": "v20.11.0",
        "port": 3000,
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot",
        "instanceDevice": "android"
    }
    ```

### `GET /connect`

*   **Descrição**: Inicia a conexão com o WhatsApp. Se já estiver conectado, retorna o status. Pode forçar uma nova sessão com `?force=1`.
*   **Autenticação**: Não requer.
*   **Query Parameters**:
    *   `force`: `1` para forçar uma nova sessão e gerar um novo QR Code.
*   **Resposta de Exemplo**:
    ```json
    {
        "status": "connecting",
        "qrcode": true
    }
    ```

### `GET /qrcode`

*   **Descrição**: Exibe o QR Code para conexão em uma página HTML. A página se atualiza automaticamente.
*   **Autenticação**: Não requer.

### `POST /send-text`

*   **Descrição**: Envia uma mensagem de texto para um número.
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**:
    ```json
    {
        "number": "5522999999999",
        "message": "Olá, este é um teste!"
    }
    ```
*   **Campos**:
    *   `number` (string, **obrigatório**): Número do destinatário (apenas dígitos, sem '+').
    *   `message` (string, **obrigatório**): O texto da mensagem a ser enviada.
*   **Resposta de Exemplo**:
    ```json
    {
        "success": true,
        "to": "5522999999999@s.whatsapp.net",
        "message": "Olá, este é um teste!",
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot"
    }
    ```

### `POST /send-image`

*   **Descrição**: Envia uma imagem para um número. Suporta URL direta ou base64.
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**:
    ```json
    {
        "number": "5522999999999",
        "image": "https://example.com/sua-imagem.jpg",
        "caption": "Imagem de teste"
    }
    ```
    Ou (base64):
    ```json
    {
        "number": "5522999999999",
        "image": "data:image/jpeg;base64,...",
        "caption": "Imagem de teste em base64"
    }
    ```
*   **Campos**:
    *   `number` (string, **obrigatório**): Número do destinatário.
    *   `image` (string, **obrigatório**): URL da imagem ou string base64 da imagem.
    *   `caption` (string, opcional): Legenda da imagem.
*   **Resposta de Exemplo**:
    ```json
    {
        "success": true,
        "to": "5522999999999@s.whatsapp.net",
        "type": "image",
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot"
    }
    ```

### `POST /send-video`

*   **Descrição**: Envia um vídeo para um número. Suporta URL direta ou base64.
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**:
    ```json
    {
        "number": "5522999999999",
        "video": "https://example.com/seu-video.mp4",
        "caption": "Vídeo de teste"
    }
    ```
*   **Campos**:
    *   `number` (string, **obrigatório**): Número do destinatário.
    *   `video` (string, **obrigatório**): URL do vídeo ou string base64 do vídeo.
    *   `caption` (string, opcional): Legenda do vídeo.
*   **Resposta de Exemplo**:
    ```json
    {
        "success": true,
        "to": "5522999999999@s.whatsapp.net",
        "type": "video",
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot"
    }
    ```

### `POST /send-audio`

*   **Descrição**: Envia um áudio para um número. Suporta URL direta ou base64. Pode ser enviado como PTT (Push To Talk).
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**:
    ```json
    {
        "number": "5522999999999",
        "audio": "https://example.com/seu-audio.mp3",
        "ptt": true
    }
    ```
*   **Campos**:
    *   `number` (string, **obrigatório**): Número do destinatário.
    *   `audio` (string, **obrigatório**): URL do áudio ou string base64 do áudio.
    *   `ptt` (boolean, opcional): `true` para enviar como áudio de voz (PTT), `false` para música. (Padrão: `false`).
*   **Resposta de Exemplo**:
    ```json
    {
        "success": true,
        "to": "5522999999999@s.whatsapp.net",
        "type": "audio",
        "ptt": true,
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot"
    }
    ```

### `POST /send-document`

*   **Descrição**: Envia um documento (PDF, DOCX, etc.) para um número. Suporta URL direta ou base64.
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**:
    ```json
    {
        "number": "5522999999999",
        "document": "https://example.com/seu-documento.pdf",
        "filename": "Relatorio.pdf",
        "caption": "Documento importante"
    }
    ```
*   **Campos**:
    *   `number` (string, **obrigatório**): Número do destinatário.
    *   `document` (string, **obrigatório**): URL do documento ou string base64 do documento.
    *   `filename` (string, opcional): Nome do arquivo a ser exibido. (Padrão: `documento.pdf`).
    *   `caption` (string, opcional): Legenda do documento.
*   **Resposta de Exemplo**:
    ```json
    {
        "success": true,
        "to": "5522999999999@s.whatsapp.net",
        "type": "document",
        "filename": "Relatorio.pdf",
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot"
    }
    ```

### `POST /send-location`

*   **Descrição**: Envia uma localização para um número.
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**:
    ```json
    {
        "number": "5522999999999",
        "latitude": "-22.9068",
        "longitude": "-43.1729",
        "name": "Cristo Redentor",
        "address": "Parque Nacional da Tijuca - Alto da Boa Vista, Rio de Janeiro - RJ"
    }
    ```
*   **Campos**:
    *   `number` (string, **obrigatório**): Número do destinatário.
    *   `latitude` (string/number, **obrigatório**): Latitude da localização.
    *   `longitude` (string/number, **obrigatório**): Longitude da localização.
    *   `name` (string, opcional): Nome do local.
    *   `address` (string, opcional): Endereço do local.
*   **Resposta de Exemplo**:
    ```json
    {
        "success": true,
        "to": "5522999999999@s.whatsapp.net",
        "type": "location",
        "latitude": "-22.9068",
        "longitude": "-43.1729",
        "instance": "5522999999999:58@s.whatsapp.net",
        "instanceName": "Uadezap Bot"
    }
    ```

### `POST /webhook-receive`

*   **Descrição**: Endpoint de teste para receber webhooks. Simplesmente loga o corpo da requisição.
*   **Autenticação**: Requer `API_KEY`.
*   **Corpo da Requisição (JSON)**: Qualquer JSON.
*   **Resposta de Exemplo**:
    ```json
    {
        "received": true
    }
    ```

### `GET /get-messages`

*   **Descrição**: Busca e retorna mensagens recebidas que ainda não foram processadas.
*   **Autenticação**: Requer `API_KEY`.
*   **Resposta de Exemplo**:
    ```json
    {
        "status": "success",
        "count": 1,
        "total_stored": 5,
        "messages": [
            {
                "number": "5522999999999",
                "message": "Mensagem de teste",
                "type": "text",
                "timestamp": 1678886400,
                "pushName": "Usuário Teste",
                "deviceType": "android"
            }
        ]
    }
    ```

### `GET /webhook-status`

*   **Descrição**: Retorna o status do webhook interno (mensagens armazenadas, processadas, etc.).
*   **Autenticação**: Requer `API_KEY`.
*   **Resposta de Exemplo**:
    ```json
    {
        "status": "active",
        "received_messages": 5,
        "unprocessed_messages": 1,
        "max_messages": 1000,
        "message_timeout_minutes": 5,
        "last_message": {
            "_id": "ABCD...",
            "from": "5522999999999@s.whatsapp.net",
            // ... outros detalhes da mensagem ...
        }
    }
    ```
