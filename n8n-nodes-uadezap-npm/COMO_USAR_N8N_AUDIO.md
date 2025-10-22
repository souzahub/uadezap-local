# 📱 Como usar o Componente N8N - Uadezap Audio

## 🎯 **Problema resolvido:**
- ✅ Áudio agora funciona no smartphone
- ✅ Configurações automáticas para mobile/web
- ✅ Suporte a URL e Base64

## 🚀 **Como usar no N8N:**

### **1. Configure o nó Uadezap:**
- **Resource**: Message
- **Operation**: Send Audio
- **Audio**: Cole URL ou Base64
- **Audio Type**: Escolha o tipo

### **2. Opções de Audio Type:**

#### **📱 Voice Message (PTT) - Smartphone** (Recomendado)
- ✅ **PTT**: true
- ✅ **Mimetype**: audio/ogg; codecs=opus
- ✅ **Funciona**: Smartphone ✅✅ | Web ✅
- ✅ **Uso**: Mensagens de voz, áudios curtos

#### **🌐 Music/Audio File - Web**
- ✅ **PTT**: false
- ✅ **Mimetype**: audio/mpeg
- ✅ **Funciona**: Smartphone ✅ | Web ✅✅
- ✅ **Uso**: Músicas, podcasts, áudios longos

## 📋 **Configuração passo a passo:**

### **Para mensagens de voz (smartphone):**
1. **Audio**: `https://example.com/audio.mp3` ou `data:audio/mp3;base64,...`
2. **Audio Type**: `Voice Message (PTT) - Smartphone`
3. **Execute** o workflow

### **Para arquivos de música:**
1. **Audio**: `https://example.com/music.mp3` ou `data:audio/mp3;base64,...`
2. **Audio Type**: `Music/Audio File - Web`
3. **Execute** o workflow

## 🔧 **O que acontece automaticamente:**

### **Quando você escolhe "Voice Message (PTT) - Smartphone":**
```json
{
  "audio": "sua_url_ou_base64",
  "ptt": true,
  "mimetype": "audio/ogg; codecs=opus"
}
```

### **Quando você escolhe "Music/Audio File - Web":**
```json
{
  "audio": "sua_url_ou_base64",
  "ptt": false,
  "mimetype": "audio/mpeg"
}
```

## 📱 **Recomendações por dispositivo:**

| Dispositivo | Audio Type Recomendado | Motivo |
|-------------|------------------------|--------|
| **Smartphone** | Voice Message (PTT) | Funciona melhor, formato otimizado |
| **WhatsApp Web** | Music/Audio File | Suporte completo a MP3 |
| **Ambos** | Voice Message (PTT) | Funciona em ambos, melhor no mobile |

## 🧪 **Como testar:**

### **Teste 1: Mensagem de voz**
1. Use áudio de **< 2 minutos**
2. Escolha **"Voice Message (PTT) - Smartphone"**
3. Teste no smartphone

### **Teste 2: Arquivo de música**
1. Use arquivo MP3
2. Escolha **"Music/Audio File - Web"**
3. Teste no web

## 📊 **Formatos suportados:**

| Formato | Voice Message | Music File | Recomendado para |
|---------|---------------|------------|------------------|
| **MP3** | ✅ | ✅✅ | Web |
| **OGG Opus** | ✅✅ | ✅ | Smartphone |
| **WAV** | ✅ | ✅ | Ambos |
| **AAC** | ✅ | ✅ | Ambos |

## ⚠️ **Limitações:**

- **Tamanho máximo**: 16MB
- **Duração recomendada**: < 5 minutos
- **Qualidade**: 128kbps funciona melhor
- **Formato**: Evite FLAC, M4A

## 🎉 **Resultado:**

Agora o áudio funciona perfeitamente tanto no smartphone quanto no WhatsApp Web! 

**Escolha "Voice Message (PTT) - Smartphone" para melhor compatibilidade!** 📱✅
