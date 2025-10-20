# Uadezap API: Integração WhatsApp para n8n, Delphi e automações modernas

Link online com status/endpoints: https://uadezap-uadezapapi.xv2gsb.easypanel.host

## Por que a Uadezap API?
Uadezap API é um serviço HTTP em Node.js + Express, usando Baileys para conversar com o WhatsApp Web. Foi pensada para ser simples de operar, confiável no dia a dia e fácil de integrar com ferramentas low‑code (n8n) e sistemas legados (Delphi).

- Operação simples: iniciar, escanear QR, usar
- Confiável: validações, logs claros e fallbacks
- Plugável: HTTP puro, node próprio para n8n e pull para Delphi
- Deploy facilitado com Docker/Easypanel

Ambiente online: [Uadezap API Live](https://uadezap-uadezapapi.xv2gsb.easypanel.host)

## Arquitetura em alto nível
- Node.js 22 + Express
- @whiskeysockets/baileys (sessão WhatsApp Web)
- Sessão persistida via `auth_info_baileys_local/`
- Webhook opcional (`N8N_WEBHOOK_URL`)
- Buffer em memória para leitura via `/get-messages`
- Deploy containerizado (Easypanel)

Fluxo resumido:
1. Iniciar servidor → escanear QR em `/qrcode`
2. Enviar mensagens via endpoints `/send-*`
3. Receber via `/get-messages` (polling) e/ou webhook

## Endpoints principais
- GET: `/status`, `/connect`, `/qrcode`, `/get-messages`
- POST: `/send-text`, `/send-image`, `/send-video`, `/send-audio`, `/send-document`, `/send-location`, `/send-contact`, `/send-buttons`, `/send-list`
- Autenticação: header obrigatório `x-api-key`

## Exemplos rápidos
Texto:
```bash
curl -X POST 'https://SEU_HOST/send-text' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: SUA_API_KEY' \
  -d '{"number":"55DDDNUMERO","message":"Olá 👋"}'
```

Lista simples:
```bash
curl -X POST 'https://SEU_HOST/send-list' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: SUA_API_KEY' \
  -d '{"number":"55DDDNUMERO","listTitle":"Menu","listDescription":"Escolha:","listItems":[{"id":"op1","title":"Opção 1"}]}'
```

Botões (com fallback interno):
```bash
curl -X POST 'https://SEU_HOST/send-buttons' \
  -H 'Content-Type: application/json' \
  -H 'x-api-key: SUA_API_KEY' \
  -d '{"number":"55DDDNUMERO","text":"Escolha:","buttons":[{"id":"op1","displayText":"Sim"},{"id":"op2","displayText":"Não"}]}'
```

## Integração com n8n
- Use o node HTTP Request (POST + headers) ou o node “Uadezap” do pacote n8n‑nodes‑uadezap.
- Configure `N8N_WEBHOOK_URL` para receber `messages.upsert` com payload detalhado (texto e metadados de mídia; base64 quando aplicável).

## Integração com Delphi
- Faça polling em `GET /get-messages` para buscar novas mensagens e respostas.
- Dispare com `POST /send-text` e correlatos.

Menu universal por texto (compatível com qualquer cliente WhatsApp):
```
📋 Menu de Opções
───────────────
1) Informações sobre produtos
2) Suporte técnico
3) Falar com atendente
4) Pedidos e entregas
5) Reclamações
6) Elogios
7) Trabalhe conosco
8) Parcerias
9) Financeiro
10) Resumo Setores (PCM)

Digite o número da opção desejada.
```

## Decisões e trade‑offs
- Botões/Listas: variações de app/versão podem limitar a renderização; implementamos fallbacks, mas o formato mais robusto é menu por texto.
- Buffer em memória: simplicidade e baixo acoplamento; para alto volume, considerar Redis/DB e workers.

## Deploy e segurança
- Docker/Easypanel; variáveis: `API_KEY`, `PORT`, `N8N_WEBHOOK_URL`, `CONFIG_SESSION_PHONE_VERSION`.
- Use HTTPS por trás de proxy reverso; todas as rotas mutáveis exigem `x-api-key`.

## Roadmap
- Persistência opcional (Redis/DB)
- Métricas/telemetria
- Testes E2E com contas Business

## Licença
MIT.

Referências: [Uadezap API Live](https://uadezap-uadezapapi.xv2gsb.easypanel.host) • Publicação: [Medium](https://medium.com/)
