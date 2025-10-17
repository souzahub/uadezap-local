# Teste rápido da API Uadezap

## 1. Teste de Status
curl -X GET http://localhost:3000/status \
  -H "x-api-key: minha123senha"

## 2. Teste de Envio de Texto
curl -X POST http://localhost:3000/send-text \
  -H "x-api-key: minha123senha" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5522999569035",
    "message": "Teste de API"
  }'

## 3. Verificar se o WhatsApp está conectado
- Acesse: http://localhost:3000/status
- Deve mostrar: "status": "connected"
