# Correção do Envio de Áudio no N8N - Uadezap Node

## 🎯 **Problema identificado:**

O áudio enviado pelo N8N abria no WhatsApp Web mas não no celular porque faltava o parâmetro `ptt` (Push-to-Talk) que define se é:
- **Áudio de voz** (PTT=true) - funciona melhor no celular
- **Música/arquivo** (PTT=false) - funciona melhor no web

## ✅ **Correção aplicada:**

### **1. Campo "Audio" unificado (igual Evolution API):**
- **URL do áudio**: `https://example.com/audio.mp3`
- **Base64**: `data:audio/mp3;base64,SUQZBAAAAAAAI1RTUOUAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//uQxAADEvGW+keswALJOCCFgyX5AhVQ0yeBomTJk7sgQjLJkyZMIIEEIMIECBMnZ507JkyAACCBAgQIRd2eTJkydkAAQIEMu+xiER3P2956dnnkwAondptGdyZO0zwGu2IIGEMMzDyZNn2Mc8nZ6ffdh/4IZ7smnz03TiH1yiD0nB9IHrj3ZRB6QPXCH1BCU7CHKQ0QQe4g+iDIKuzJT0EIFOH+IHdTuCHIeXcAbE/UE2Ms6C/MfKaWUy2Zxxq1TRpW1aOsjHhUHXZ59QGLghqMFSISYk3gpZGz4DwUOZBJUIBK5uLZVQU6a01z02Uk0kD60XqnFbmqhaYUfzmTjFJxGcXi+S7b2GoQUpNHMnMLRsSLpIjKKBKaNrrljvJ24ROINFKRgwMERCjRJnzAYEbJk2jBCQYFp6dFalLoChWhQ2X50IDP1IOU+wnGcqnc29vaGl8072Xcyu9ouZxDnNMj0ZodSic/Scpqle3uWTmVjdKDnGKCzz08ZgU4w+stNJuflkmZe7rFSs6gyZdkeVrJijr...`

### **2. Novo campo "Audio Type":**
- **Voice Message (PTT)** - Padrão, funciona melhor no celular
- **Music/Audio File** - Para arquivos de música/áudio

### **3. Lógica atualizada:**
```javascript
case 'sendAudio':
    requestData.audio = this.getNodeParameter('audioUrl', i);
    const audioType = this.getNodeParameter('audioType', i, 'voice');
    requestData.ptt = (audioType === 'voice'); // true para voice, false para music
    break;
```

## 🚀 **Como usar (igual Evolution API):**

### **Para áudio de voz (recomendado para celular):**
1. Selecione **"Send Audio"** no nó Uadezap
2. No campo **"Audio"**, cole:
   - **URL**: `https://example.com/audio.mp3`
   - **Base64**: `data:audio/mp3;base64,SUQZBAAAAAAAI1RTUOUAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//uQxAADEvGW+keswALJOCCFgyX5AhVQ0yeBomTJk7sgQjLJkyZMIIEEIMIECBMnZ507JkyAACCBAgQIRd2eTJkydkAAQIEMu+xiER3P2956dnnkwAondptGdyZO0zwGu2IIGEMMzDyZNn2Mc8nZ6ffdh/4IZ7smnz03TiH1yiD0nB9IHrj3ZRB6QPXCH1BCU7CHKQ0QQe4g+iDIKuzJT0EIFOH+IHdTuCHIeXcAbE/UE2Ms6C/MfKaWUy2Zxxq1TRpW1aOsjHhUHXZ59QGLghqMFSISYk3gpZGz4DwUOZBJUIBK5uLZVQU6a01z02Uk0kD60XqnFbmqhaYUfzmTjFJxGcXi+S7b2GoQUpNHMnMLRsSLpIjKKBKaNrrljvJ24ROINFKRgwMERCjRJnzAYEbJk2jBCQYFp6dFalLoChWhQ2X50IDP1IOU+wnGcqnc29vaGl8072Xcyu9ouZxDnNMj0ZodSic/Scpqle3uWTmVjdKDnGKCzz08ZgU4w+stNJuflkmZe7rFSs6gyZdkeVrJijr...`
3. Escolha **"Voice Message (PTT)"** em Audio Type
4. Execute o workflow

### **Para música/arquivo de áudio:**
1. Selecione **"Send Audio"** no nó Uadezap
2. No campo **"Audio"**, cole URL ou base64
3. Escolha **"Music/Audio File"** em Audio Type
4. Execute o workflow

## 📱 **Diferenças:**

| Tipo | PTT | WhatsApp Web | Celular | Uso recomendado |
|------|-----|--------------|---------|------------------|
| Voice Message | true | ✅ | ✅✅ | Notas de voz, áudios curtos |
| Music/Audio | false | ✅✅ | ✅ | Músicas, podcasts, áudios longos |

## 🔧 **Arquivos modificados:**

- `n8n-nodes-uadezap-npm/package/dist/nodes/Uadezap/Uadezap.node.js`
  - Campo "Audio" unificado (URL + Base64)
  - Adicionado campo `audioType`
  - Adicionada lógica para `ptt`
  - Mantida compatibilidade com versões anteriores

## 📋 **Para atualizar:**

1. **Reinstale** o pacote N8N:
   ```bash
   cd n8n-nodes-uadezap-npm
   npm pack
   ```

2. **No N8N**, reinstale o nó Uadezap

3. **Teste** com ambos os tipos de áudio

## 🎉 **Resultado:**

Agora os áudios enviados pelo N8N funcionarão corretamente tanto no WhatsApp Web quanto no celular, funcionando igual à Evolution API - aceitando tanto URL quanto base64 no mesmo campo!
