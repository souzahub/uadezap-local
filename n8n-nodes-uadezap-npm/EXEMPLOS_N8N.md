🔘 EXEMPLOS DE USO DO COMPONENTE N8N UADEZAP

📋 CONFIGURAÇÃO INICIAL:
1. Instale o pacote: npm install n8n-nodes-uadezap
2. Configure as credenciais:
   - API Key: sua123chave
   - URL: http://localhost:3000

📋 EXEMPLO 1: ENVIO DE TEXTO SIMPLES
Operação: Send Text
Parâmetros:
- Phone Number: 5521999999999
- Message: Olá! Esta é uma mensagem de teste do N8N.

📋 EXEMPLO 2: ENVIO DE IMAGEM COM LEGENDA
Operação: Send Image
Parâmetros:
- Phone Number: 5521999999999
- Image: https://example.com/imagem.jpg
- Caption: Esta é uma imagem enviada via N8N

📋 EXEMPLO 3: ENVIO DE BOTÕES INTERATIVOS
Operação: Send Button
Parâmetros:
- Phone Number: 5521999999999
- Text: Escolha uma das opções abaixo:
- Header Text: Menu Principal
- Footer Text: Responda com um dos botões
- Buttons (Collection):
  Botão 1:
    - Button ID: produtos
    - Display Text: Ver Produtos
  Botão 2:
    - Button ID: suporte
    - Display Text: Suporte Técnico
  Botão 3:
    - Button ID: contato
    - Display Text: Falar com Atendente

📋 EXEMPLO 4: ENVIO DE LISTA DE OPÇÕES
Operação: Send List
Parâmetros:
- Phone Number: 5521999999999
- List Title: Produtos Disponíveis
- List Description: Escolha um produto da nossa lista:
- List Items (Collection):
  Item 1:
    - Item ID: smartphone
    - Item Title: Smartphone Android
    - Item Description: Smartphone com 128GB de armazenamento
  Item 2:
    - Item ID: notebook
    - Item Title: Notebook Intel i7
    - Item Description: Notebook com 16GB RAM e SSD 512GB
  Item 3:
    - Item ID: tablet
    - Item Title: Tablet 10"
    - Item Description: Tablet com tela HD e 64GB

📋 EXEMPLO 5: ENVIO DE LOCALIZAÇÃO
Operação: Send Location
Parâmetros:
- Phone Number: 5521999999999
- Latitude: -22.9068
- Longitude: -43.1729
- Name: Rio de Janeiro
- Address: Centro, Rio de Janeiro - RJ

📋 EXEMPLO 6: ENVIO DE CONTATO
Operação: Send Contact
Parâmetros:
- Phone Number: 5521999999999
- Contact Name: João Silva
- Contact Phone: 5521888888888

📋 EXEMPLO 7: ENVIO DE DOCUMENTO
Operação: Send Document
Parâmetros:
- Phone Number: 5521999999999
- Document: https://example.com/documento.pdf
- Caption: Documento importante para você

📋 EXEMPLO 8: ENVIO DE TEMPLATE
Operação: Send Template
Parâmetros:
- Phone Number: 5521999999999
- Template Name: confirmacao_pedido
- Template Parameters: João Silva,R$ 299,90,12345

🚀 FLUXO DE TRABALHO N8N SUGERIDO:

1. **Trigger** (Webhook/Manual)
2. **Uadezap Node** (Send Text) - Enviar mensagem inicial
3. **Wait** - Aguardar resposta
4. **Uadezap Node** (Send Button) - Enviar opções
5. **Switch** - Processar resposta do botão
6. **Uadezap Node** (Send List) - Enviar lista de produtos
7. **Uadezap Node** (Send Contact) - Enviar contato do vendedor

⚠️ IMPORTANTE:
- Sempre teste com números reais do WhatsApp
- Verifique se o servidor Uadezap está rodando
- Confirme se as credenciais estão corretas
- Use números com código do país (ex: 5521999999999)

✅ FUNCIONALIDADES IMPLEMENTADAS:
- ✅ Envio de texto
- ✅ Envio de imagem com legenda
- ✅ Envio de vídeo com legenda
- ✅ Envio de áudio
- ✅ Envio de documento com legenda
- ✅ Envio de localização com nome e endereço
- ✅ Envio de contato
- ✅ Envio de botões interativos (até 3)
- ✅ Envio de lista de opções (até 10 itens)
- ✅ Envio de template com parâmetros

🎯 VERSÃO ATUAL: 0.1.18
📅 ÚLTIMA ATUALIZAÇÃO: Compatível com API Uadezap v1.0.1
