// server.js - Uadezap API (Evolution-like) - Versão Corrigida
require('dotenv').config();
const express = require('express');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode');
const axios = require('axios');
const app = express();

// === Configuração do servidor ===
app.use(express.json({ limit: '10mb' }));
app.use('/auth', express.static('auth_info_baileys_local'));

// === Variáveis globais ===
let sock = null;
let qrCodeData = null;

// Armazena IDs de mensagens já processadas (evita duplicatas)
const processedMessages = new Set();

// Contador para limpar o console
let logCount = 0;
const LOG_LIMIT = 10;

// Função de log personalizada que limpa o console a cada 10 logs
function customLog(...args) {
    console.log(...args);
    logCount++;
    if (logCount >= LOG_LIMIT) {
        console.clear();
        logCount = 0;
        console.log('--- Console limpo (a cada 10 logs) ---');
    }
}

// === Carregar Baileys com import() dinâmico (ES Module) ===
let makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser;

(async () => {
    try {
        const baileys = await import('@whiskeysockets/baileys');
        makeWASocket = baileys.makeWASocket;
        useMultiFileAuthState = baileys.useMultiFileAuthState;
        DisconnectReason = baileys.DisconnectReason;
        jidNormalizedUser = baileys.jidNormalizedUser;
        customLog('✅ Baileys carregado com sucesso');
    } catch (err) {
        console.error('❌ Falha ao carregar @whiskeysockets/baileys:', err.message);
        console.error('💡 Instale com: npm install @whiskeysockets/baileys');
    }
})();
// ==========================================================

// === CONFIGURAÇÕES ===
const API_KEY = process.env.API_KEY || 'minha123senha';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || null;
const VERSION = '1.0.1';

// Função para reconexão automática
async function connectToWhatsApp() {
    if (sock) {
        customLog('⚠️ Já existe uma conexão ativa');
        return;
    }

    try {
        customLog('🔄 Iniciando conexão com WhatsApp...');
        const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys_local');

        sock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            syncFullHistory: false,
            markOnlineOnConnect: true,
            browser: ['Uadezap API', 'Chrome', '1.0.2'],
            connectTimeoutMs: 60_000,
            keepAliveIntervalMs: 30_000,
            retryRequestDelayMs: 250,
            maxMsgRetryCount: 5,
            defaultQueryTimeoutMs: 0,
            keepAlive: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                return {
                    conversation: "Mensagem não encontrada"
                }
            }
        });

        sock.ev.on('connection.update', ({ qr, connection, lastDisconnect }) => {
            if (qr) {
                customLog('📱 QR Code gerado - Escaneie com WhatsApp');
                QRCode.toDataURL(qr, (err, url) => {
                    if (!err) qrCodeData = url;
                });
            }

            if (connection === 'open') {
                customLog('✅ WhatsApp conectado com sucesso!');
                customLog('📱 Dispositivo: ' + (sock.user?.deviceType || 'Desconhecido'));
                customLog('👤 Usuário: ' + (sock.user?.name || 'Desconhecido'));
                qrCodeData = null;
            }

            if (connection === 'close') {
                const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                customLog('🔌 Conexão fechada. Motivo: ' + (lastDisconnect?.error?.message || 'Desconhecido'));
                
                if (shouldReconnect) {
                    customLog('🔁 Reconectando em 3 segundos...');
                    setTimeout(() => {
                        sock = null;
                        qrCodeData = null;
                        customLog('🔄 Iniciando nova conexão...');
                        connectToWhatsApp().catch(err => customLog('❌ Erro na reconexão:', err.message));
                    }, 3000);
                } else {
                    customLog('❌ Sessão expirada. Faça login novamente.');
                }
            }

            if (connection === 'connecting') {
                customLog('🔄 Conectando ao WhatsApp...');
            }
        });

        sock.ev.on('creds.update', saveCreds);

        // === RECEBIMENTO DE MENSAGENS ===
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            customLog(`🔔 Evento messages.upsert - Tipo: ${type}, Mensagens: ${messages.length}`);
            
            // Processar apenas notificações de novas mensagens
            if (type !== 'notify') {
                customLog(`⚠️ Ignorando evento do tipo: ${type}`);
                return;
            }
            
            for (const msg of messages) {
                customLog(`📨 Processando mensagem:`, {
                    hasKey: !!msg.key,
                    fromMe: msg.key?.fromMe,
                    messageId: msg.key?.id,
                    pushName: msg.pushName,
                    messageType: Object.keys(msg.message || {})
                });

                if (!msg.key || msg.key.fromMe) {
                    customLog(`⚠️ Mensagem ignorada - fromMe: ${msg.key?.fromMe}`);
                    continue;
            }

            const messageId = msg.key.id;
            if (!messageId || processedMessages.has(messageId)) {
                    customLog(`⚠️ Mensagem ignorada - ID já processado: ${messageId}`);
                    continue;
            }
            processedMessages.add(messageId);

                // Limpar cache de mensagens processadas se ficar muito grande
                if (processedMessages.size > 2000) {
                    processedMessages.clear();
                }

            // Ignora mensagens de sistema
            const systemKeys = Object.keys(msg.message || {});
            const ignoredTypes = [
                'protocolMessage',
                'senderKeyDistributionMessage',
                    'ephemeralSetting',
                    'reactionMessage',
                    'pollCreationMessage',
                    'pollUpdateMessage'
            ];
            if (systemKeys.some(k => ignoredTypes.includes(k))) {
                    continue;
            }

            const from = jidNormalizedUser(msg.key.remoteJid);
            const pushName = msg.pushName || 'Desconhecido';
            const timestamp = msg.messageTimestamp;

                // Filtrar mensagens promocionais de grupos e comunidades
                const isGroup = from.includes('@g.us');
                const isCommunity = from.includes('@newsletter');
                
                if (isGroup || isCommunity) {
                    // Verificar se é mensagem promocional baseada em padrões comuns
                    const textContent = msg.message?.conversation || 
                                     msg.message?.extendedTextMessage?.text || 
                                     msg.message?.imageMessage?.caption || 
                                     '';
                    
                    const promotionalPatterns = [
                        /promoção/i,
                        /oferta/i,
                        /desconto/i,
                        /cupom/i,
                        /black friday/i,
                        /cyber monday/i,
                        /liquidação/i,
                        /venda/i,
                        /compre agora/i,
                        /aproveite/i,
                        /não perca/i,
                        /últimas unidades/i,
                        /frete grátis/i,
                        /entrega grátis/i,
                        /cashback/i,
                        /cash back/i,
                        /parcelamento/i,
                        /até \d+% de desconto/i,
                        /\d+% off/i,
                        /compre \d+ por \d+/i,
                        /levando \d+ por \d+/i,
                        /compre \d+ leve \d+/i
                    ];
                    
                    const isPromotional = promotionalPatterns.some(pattern => pattern.test(textContent));
                    
                    if (isPromotional) {
                        customLog(`🚫 Mensagem promocional ignorada de ${isGroup ? 'grupo' : 'comunidade'}: ${from}`);
                        continue;
                    }
                }

            let messageData = {
                from,
                pushName,
                timestamp,
                    type: 'incoming',
                deviceType: msg.key.id.includes('BAE5') ? 'android' : 'web'
            };

                // 1. Texto (incluindo mensagens do Desktop)
            if (msg.message?.conversation) {
                messageData.type = 'text';
                messageData.text = msg.message.conversation;
            } else if (msg.message?.extendedTextMessage?.text) {
                messageData.type = 'text';
                messageData.text = msg.message.extendedTextMessage.text;
                } else if (msg.message?.ephemeralMessage?.message?.conversation) {
                    // Mensagens do WhatsApp Desktop
                    messageData.type = 'text';
                    messageData.text = msg.message.ephemeralMessage.message.conversation;
                } else if (msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text) {
                    // Texto estendido do Desktop
                    messageData.type = 'text';
                    messageData.text = msg.message.ephemeralMessage.message.extendedTextMessage.text;
            }

            // 2. Imagem
            else if (msg.message?.imageMessage) {
                const img = msg.message.imageMessage;
                messageData.type = 'image';
                messageData.mimetype = img.mimetype;
                messageData.caption = img.caption || '';
                messageData.text = img.caption || '';
                messageData.height = img.height;
                messageData.width = img.width;
                } else if (msg.message?.ephemeralMessage?.message?.imageMessage) {
                    // Imagem do Desktop
                    const img = msg.message.ephemeralMessage.message.imageMessage;
                    messageData.type = 'image';
                    messageData.mimetype = img.mimetype;
                    messageData.caption = img.caption || '';
                    messageData.text = img.caption || '';
                    messageData.height = img.height;
                    messageData.width = img.width;
            }

            // 3. Vídeo
            else if (msg.message?.videoMessage) {
                const video = msg.message.videoMessage;
                messageData.type = 'video';
                messageData.mimetype = video.mimetype;
                messageData.caption = video.caption || '';
                messageData.text = video.caption || '';
                messageData.seconds = video.seconds;
                messageData.gifPlayback = !!video.gifPlayback;
                } else if (msg.message?.ephemeralMessage?.message?.videoMessage) {
                    // Vídeo do Desktop
                    const video = msg.message.ephemeralMessage.message.videoMessage;
                    messageData.type = 'video';
                    messageData.mimetype = video.mimetype;
                    messageData.caption = video.caption || '';
                    messageData.text = video.caption || '';
                    messageData.seconds = video.seconds;
                    messageData.gifPlayback = !!video.gifPlayback;
            }

            // 4. Áudio
            else if (msg.message?.audioMessage) {
                const audio = msg.message.audioMessage;
                messageData.type = 'audio';
                messageData.mimetype = audio.mimetype;
                messageData.seconds = audio.seconds;
                messageData.ptt = !!audio.ptt;
                } else if (msg.message?.ephemeralMessage?.message?.audioMessage) {
                    // Áudio do Desktop
                    const audio = msg.message.ephemeralMessage.message.audioMessage;
                    messageData.type = 'audio';
                    messageData.mimetype = audio.mimetype;
                    messageData.seconds = audio.seconds;
                    messageData.ptt = !!audio.ptt;
            }

            // 5. Documento (PDF, etc.)
            else if (msg.message?.documentMessage) {
                const doc = msg.message.documentMessage;
                messageData.type = 'document';
                messageData.mimetype = doc.mimetype;
                messageData.fileName = doc.fileName;
                messageData.fileLength = doc.fileLength?.toString();
                messageData.pageCount = doc.pageCount;
                } else if (msg.message?.ephemeralMessage?.message?.documentMessage) {
                    // Documento do Desktop
                    const doc = msg.message.ephemeralMessage.message.documentMessage;
                    messageData.type = 'document';
                    messageData.mimetype = doc.mimetype;
                    messageData.fileName = doc.fileName;
                    messageData.fileLength = doc.fileLength?.toString();
                    messageData.pageCount = doc.pageCount;
            }

            // 6. Sticker
            else if (msg.message?.stickerMessage) {
                const sticker = msg.message.stickerMessage;
                messageData.type = 'sticker';
                messageData.mimetype = sticker.mimetype;
                messageData.isAnimated = !!sticker.isAnimated;
                } else if (msg.message?.ephemeralMessage?.message?.stickerMessage) {
                    // Sticker do Desktop
                    const sticker = msg.message.ephemeralMessage.message.stickerMessage;
                    messageData.type = 'sticker';
                    messageData.mimetype = sticker.mimetype;
                    messageData.isAnimated = !!sticker.isAnimated;
            }

            // 7. Contato
            else if (msg.message?.contactMessage) {
                const contact = msg.message.contactMessage;
                messageData.type = 'contact';
                messageData.displayName = contact.displayName;
                messageData.vcard = contact.vcard;
                } else if (msg.message?.ephemeralMessage?.message?.contactMessage) {
                    // Contato do Desktop
                    const contact = msg.message.ephemeralMessage.message.contactMessage;
                    messageData.type = 'contact';
                    messageData.displayName = contact.displayName;
                    messageData.vcard = contact.vcard;
            }

            // 8. Localização
            else if (msg.message?.locationMessage) {
                const loc = msg.message.locationMessage;
                messageData.type = 'location';
                messageData.degreesLatitude = loc.degreesLatitude;
                messageData.degreesLongitude = loc.degreesLongitude;
                messageData.name = loc.name || '';
                messageData.address = loc.address || '';
                } else if (msg.message?.ephemeralMessage?.message?.locationMessage) {
                    // Localização do Desktop
                    const loc = msg.message.ephemeralMessage.message.locationMessage;
                    messageData.type = 'location';
                    messageData.degreesLatitude = loc.degreesLatitude;
                    messageData.degreesLongitude = loc.degreesLongitude;
                    messageData.name = loc.name || '';
                    messageData.address = loc.address || '';
            }

            // 9. Lista ou Botão (respostas)
            else if (msg.message?.listResponseMessage || msg.message?.buttonsResponseMessage) {
                const list = msg.message.listResponseMessage;
                const button = msg.message.buttonsResponseMessage;
                messageData.type = list ? 'list_response' : 'button_response';
                messageData.selectedDisplayText = list?.title || button?.selectedDisplayText;
                messageData.selectedId = list?.singleSelectReply?.selectedRowId || button?.selectedButtonId;
            }

            // 10. Sem tipo suportado
                if (!messageData.type || messageData.type === 'incoming') {
                    continue; // Ignora completamente
                }

                customLog('📩 Recebido:', {
                    from: messageData.from,
                    pushName: messageData.pushName,
                    text: messageData.text || messageData.caption || '[Mídia]',
                    timestamp: messageData.timestamp,
                    type: messageData.type
                });

            // Envia para webhook
            if (N8N_WEBHOOK_URL) {
                try {
                    await axios.post(N8N_WEBHOOK_URL, messageData, {
                        timeout: 5000,
                        headers: { 'Content-Type': 'application/json' }
                    });
                        customLog(`✅ Enviado para webhook: ${from}`);
                } catch (err) {
                    console.error('❌ Falha no webhook:', err.message);
                    }
                }
            }
        });

    } catch (err) {
        customLog('❌ Erro ao conectar:', err.message);
        sock = null;
        qrCodeData = null;
    }
}

// === MIDDLEWARE DE AUTENTICAÇÃO ===
const auth = (req, res, next) => {
    const key = req.headers['x-api-key'] || req.query.api_key;
    if (!makeWASocket) return res.status(500).json({ error: 'API ainda carregando...' });
    if (!key || key !== API_KEY) {
        return res.status(401).json({ error: 'Acesso negado. Chave API inválida.' });
    }
    next();
};

// === ROTAS ===

// Página inicial
app.get('/', (req, res) => {
        res.send(`
        <!doctype html>
            <html lang="pt-BR">
            <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Uadezap API v${VERSION}</title>
                <style>
                    :root {
                    --bg: #0b1220;
                    --card: #111a2b;
                    --text: #e6edf3;
                    --muted: #9fb0c3;
                    --primary: #4f46e5;
                    --primary-600: #4338ca;
                    --border: #22304a;
                    --ok: #22c55e;
                    --warn: #f59e0b;
                }
                html[data-theme="light"] {
                    --bg: #f6f7fb;
                    --card: #ffffff;
                    --text: #0b1220;
                    --muted: #536174;
                    --primary: #4f46e5;
                    --primary-600: #4338ca;
                    --border: #e5e7eb;
                    --ok: #16a34a;
                    --warn: #d97706;
                }
                * { box-sizing: border-box; }
                    body {
                        margin: 0;
                    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
                    background: radial-gradient(1200px 600px at 90% -10%, rgba(79,70,229,0.25), transparent 60%),
                                radial-gradient(800px 400px at -10% 10%, rgba(16,185,129,0.18), transparent 60%),
                                var(--bg);
                    color: var(--text);
                }
                .container { max-width: 980px; margin: 0 auto; padding: 24px; }
                .nav {
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 12px; padding: 16px 0;
                }
                .brand { display: flex; align-items: center; gap: 10px; font-weight: 700; }
                .chip { font-size: 12px; padding: 4px 8px; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); }
                .actions { display: flex; gap: 10px; align-items: center; }
                .btn {
                    appearance: none; 
                    border: 1px solid var(--border); 
                    background: var(--card); 
                    color: var(--text);
                    padding: 10px 14px; 
                    border-radius: 10px; 
                    cursor: pointer; 
                        text-decoration: none;
                    font-weight: 600;
                    box-shadow: 0 1px 0 rgba(255,255,255,0.02) inset, 0 10px 30px rgba(0,0,0,0.15);
                    transition: transform .06s ease, background .2s ease, border-color .2s ease;
                    display: inline-flex;
                        align-items: center;
                        justify-content: center;
                }
                .btn:hover { 
                    transform: translateY(-1px); 
                    border-color: var(--primary); 
                }
                .btn-primary { 
                    background: linear-gradient(180deg, var(--primary), var(--primary-600)); 
                    border-color: transparent; 
                    color: #fff; 
                }
                .grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
                    gap: 20px; 
                    margin-top: 24px; 
                }
                .card { 
                    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)), var(--card); 
                    border: 1px solid var(--border); 
                    border-radius: 16px; 
                    padding: 24px; 
                }
                .muted { 
                    color: var(--muted); 
                    font-size: 14px;
                }
                .kvs { 
                    display: grid; 
                    grid-template-columns: 120px 1fr; 
                    gap: 8px 16px; 
                    margin-top: 16px; 
                    font-size: 14px; 
                }
                .badge { 
                    display: inline-flex; 
                        align-items: center;
                    gap: 6px; 
                    font-size: 12px; 
                    padding: 6px 10px; 
                    border-radius: 999px; 
                    border: 1px solid var(--border); 
                }
                .dot { 
                    width: 8px; 
                    height: 8px; 
                    border-radius: 999px; 
                    display: inline-block; 
                }
                .dot.ok { background: var(--ok); }
                .dot.warn { background: var(--warn); }
                .footer { 
                    margin-top: 32px; 
                    font-size: 12px; 
                    color: var(--muted); 
                        text-align: center;
                    }
                .toggle { 
                    display: inline-flex; 
                    align-items: center; 
                    gap: 8px; 
                }
                h2 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                code {
                    background: rgba(255,255,255,0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 13px;
                }
                @media (max-width: 768px) {
                    .container { padding: 16px; }
                    .nav { flex-direction: column; gap: 16px; align-items: stretch; }
                    .actions { justify-content: center; }
                    .grid { grid-template-columns: 1fr; gap: 16px; }
                    .kvs { grid-template-columns: 100px 1fr; gap: 6px 12px; }
                    .btn { padding: 12px 16px; font-size: 14px; }
                    }
                </style>
            <script>
                (function() {
                    const saved = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const theme = saved || (prefersDark ? 'dark' : 'light');
                    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
                    window.__toggleTheme = function() {
                        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                        const next = isLight ? 'dark' : 'light';
                        if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
                        else document.documentElement.removeAttribute('data-theme');
                        localStorage.setItem('theme', next);
                        const btn = document.getElementById('theme-label');
                        if (btn) btn.textContent = next === 'light' ? 'Modo escuro' : 'Modo claro';
                    }
                    document.addEventListener('DOMContentLoaded', function() {
                        const btn = document.getElementById('theme-label');
                        if (btn) btn.textContent = (document.documentElement.getAttribute('data-theme') === 'light') ? 'Modo escuro' : 'Modo claro';
                    });
                })();
            </script>
            </head>
            <body>
                <div class="container">
                <div class="nav">
                    <div class="brand">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.203 2 11.39c0 2.829 1.372 5.36 3.56 7.062L4.5 22l3.86-1.274A10.3 10.3 0 0 0 12 20.78c5.523 0 10-4.203 10-9.39C22 6.203 17.523 2 12 2Z" stroke="currentColor" stroke-width="1.3"/>
                            <path d="M8.5 9.5c0-.552.53-1 1.185-1h.79c.329 0 .64.12.87.335l.322.298c.29.268.298.703.017.98l-.47.463a.9.9 0 0 0-.263.64v.07c0 .497.43.9.96.9h.86c.655 0 1.185.448 1.185 1s-.53 1-1.185 1H10c-1.38 0-2.5-1.007-2.5-2.25V9.5Z" fill="currentColor"/>
                        </svg>
                        Uadezap API
                        <span class="chip">v${VERSION}</span>
                </div>
                    <div class="actions">
                        <button class="btn" onclick="__toggleTheme()"><span id="theme-label">Alternar tema</span></button>
                        <a class="btn" href="/status">Status JSON</a>
                        <a class="btn btn-primary" href="/connect">Conectar</a>
                    </div>
                </div>

                <div class="grid">
                    <div class="card">
                        <h2>Status</h2>
                        <div class="muted">Situação do WhatsApp e ambiente</div>
                        <div style="margin-top: 16px; display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                            <span class="badge">
                                <span class="dot ${sock ? 'ok' : 'warn'}"></span>
                                ${sock ? 'Conectado' : 'Desconectado'}
                            </span>
                            <span class="badge">
                                <span class="dot ok"></span>
                                Node ${process.version}
                            </span>
                        </div>
                        <div class="kvs">
                            <div class="muted">Porta</div>
                            <div>${process.env.PORT || 3000}</div>
                            <div class="muted">QR Code</div>
                            <div>${qrCodeData ? 'Disponível' : (sock ? '—' : 'Aguardando')}</div>
                        </div>
                        <div style="margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap;">
                            <a class="btn" href="/qrcode">Ver QR Code</a>
                            <a class="btn" href="/connect">${sock ? 'Reconectar' : 'Iniciar conexão'}</a>
                        </div>
                    </div>
                    <div class="card">
                        <h2>Como usar</h2>
                        <div class="muted">Endpoints rápidos</div>
                        <div class="kvs">
                            <div class="muted">GET</div>
                            <div><code>/connect</code> — inicia a sessão</div>
                            <div class="muted">GET</div>
                            <div><code>/qrcode</code> — exibe o QR code</div>
                            <div class="muted">GET</div>
                            <div><code>/status</code> — status em JSON</div>
                            <div class="muted">POST</div>
                            <div><code>/send-text</code> — enviar texto</div>
                            <div class="muted">POST</div>
                            <div><code>/send-image</code> — enviar imagem</div>
                            <div class="muted">POST</div>
                            <div><code>/send-video</code> — enviar vídeo</div>
                            <div class="muted">POST</div>
                            <div><code>/send-audio</code> — enviar áudio</div>
                            <div class="muted">POST</div>
                            <div><code>/send-document</code> — enviar PDF</div>
                            <div class="muted">POST</div>
                            <div><code>/send-location</code> — enviar localização</div>
                        </div>
                    </div>
                </div>

                <div class="footer">© 2025 Uadezap • Baileys • Easypanel Ready _ desenvolvido por LuanSouza de SIqueira - 2025</div>
            </div>
            </body>
            </html>
        `);
});

// Status em JSON
app.get('/status', (req, res) => {
    res.json({
        status: sock ? 'connected' : 'disconnected',
        qr: !!qrCodeData,
        version: VERSION,
        node_version: process.version,
        port: process.env.PORT || 3000
    });
});

// Conectar ao WhatsApp
app.get('/connect', async (req, res) => {
    // Forçar nova sessão
    if (req.query.force === '1') {
        sock = null;
        qrCodeData = null;
        customLog('🔄 Nova sessão forçada via ?force=1');
    }

    if (!makeWASocket) {
        return res.status(500).json({ error: 'Baileys não carregado.' });
    }
    if (sock) return res.json({ status: 'already connected' });

    try {
        await connectToWhatsApp();
        res.json({ status: 'connecting', qrcode: !!qrCodeData });
    } catch (err) {
        customLog('❌ Erro no /connect:', err.message);
        res.status(500).json({ error: 'Erro ao iniciar conexão', details: err.message });
    }
});

// Mostrar QR Code
app.get('/qrcode', (req, res) => {
    if (!makeWASocket) {
        return res.status(500).send('<h3>❌ API carregando... Aguarde.</h3>');
    }
    res.type('html');
    const hasQr = !!qrCodeData;
    const connected = !!sock;
    res.send(`
        <!doctype html>
        <html lang="pt-BR">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>QR Code • Uadezap</title>
            <meta http-equiv="refresh" content="5" />
            <style>
                :root { --bg:#0b1220; --card:#111a2b; --text:#e6edf3; --muted:#9fb0c3; --primary:#4f46e5; --border:#22304a; }
                html[data-theme="light"] { --bg:#f6f7fb; --card:#ffffff; --text:#0b1220; --muted:#536174; --primary:#4f46e5; --border:#e5e7eb; }
                body{ margin:0; background:var(--bg); color:var(--text); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
                .container{ max-width:860px; margin:0 auto; padding:24px; }
                .nav{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:16px 0; }
                .btn{ appearance:none; border:1px solid var(--border); background:var(--card); color:var(--text); padding:10px 14px; border-radius:10px; cursor:pointer; text-decoration:none; font-weight:600; }
                .grid{ display:grid; grid-template-columns: 1fr; gap:16px; }
                .card{ background:var(--card); border:1px solid var(--border); border-radius:16px; padding:18px; }
                .muted{ color:var(--muted); }
                .qrwrap{ display:flex; align-items:center; justify-content:center; min-height:300px; }
                </style>
            <script>
                (function(){
                    const saved = localStorage.getItem('theme');
                    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const theme = saved || (prefersDark ? 'dark' : 'light');
                    if (theme === 'light') document.documentElement.setAttribute('data-theme','light');
                    window.__toggleTheme = function(){
                        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
                        const next = isLight ? 'dark' : 'light';
                        if (next === 'light') document.documentElement.setAttribute('data-theme','light'); else document.documentElement.removeAttribute('data-theme');
                        localStorage.setItem('theme', next);
                        const btn = document.getElementById('theme-label');
                        if (btn) btn.textContent = next === 'light' ? 'Modo escuro' : 'Modo claro';
                    }
                    document.addEventListener('DOMContentLoaded', function(){
                        const btn = document.getElementById('theme-label');
                        if (btn) btn.textContent = (document.documentElement.getAttribute('data-theme') === 'light') ? 'Modo escuro' : 'Modo claro';
                    });
                })();
            </script>
            </head>
            <body>
                <div class="container">
                <div class="nav">
                    <div style="font-weight:700; display:flex; align-items:center; gap:10px;">Uadezap • QR Code</div>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <button class="btn" onclick="__toggleTheme()"><span id="theme-label">Alternar tema</span></button>
                        <a class="btn" href="/">Início</a>
                        <a class="btn" href="/connect">Conectar</a>
                </div>
                </div>
                <div class="grid">
                    <div class="card">
                        <div class="muted">Status: ${connected ? 'Conectado' : (hasQr ? 'Aguardando leitura' : 'Aguardando conexão')}</div>
                        <div class="qrwrap">
                            ${hasQr ? `<img src="${qrCodeData}" width="320" height="320" style="border-radius:12px; border:1px solid var(--border)" />` : `<div class="muted">${connected ? 'Nenhum QR Code disponível' : 'Vá para /connect para gerar o QR Code.'}</div>`}
                        </div>
                        <div class="muted">A página atualiza automaticamente a cada 5 segundos.</div>
                    </div>
                </div>
                <div style="margin-top: 26px; font-size: 12px; color: var(--muted);">© 2025 Uadezap • Baileys • Easypanel Ready _ desenvolvido por LuanSouza de SIqueira - 2025</div>
            </div>
            </body>
            </html>
        `);
});

// Enviar mensagem de texto
app.post('/send-text', auth, async (req, res) => {
    const { number, message } = req.body;
    if (!sock) return res.status(500).json({ error: 'WhatsApp desconectado.' });
    if (!number || !message) return res.status(400).json({ error: 'Campos obrigatórios: number, message' });

    try {
        const id = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
        await sock.sendMessage(id, { text: message });
        customLog(`📤 Texto enviado para: ${id}`);
        res.json({ success: true, to: id, message });
    } catch (err) {
        customLog('❌ Erro ao enviar texto:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Enviar imagem
app.post('/send-image', auth, async (req, res) => {
    const { number, image, caption } = req.body;
    if (!sock) return res.status(500).json({ error: 'WhatsApp desconectado.' });
    if (!number || !image) return res.status(400).json({ error: 'Campos obrigatórios: number, image' });

    try {
        const id = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
        
        // Se image é uma URL, baixar a imagem
        let imageBuffer;
        if (image.startsWith('http')) {
            const response = await axios.get(image, { responseType: 'arraybuffer' });
            imageBuffer = Buffer.from(response.data);
        } else {
            // Se é base64, converter para buffer
            imageBuffer = Buffer.from(image.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64');
        }

        await sock.sendMessage(id, {
            image: imageBuffer,
            caption: caption || ''
        });
        customLog(`📤 Imagem enviada para: ${id}`);
        res.json({ success: true, to: id, type: 'image' });
    } catch (err) {
        customLog('❌ Erro ao enviar imagem:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Enviar vídeo
app.post('/send-video', auth, async (req, res) => {
    const { number, video, caption } = req.body;
    if (!sock) return res.status(500).json({ error: 'WhatsApp desconectado.' });
    if (!number || !video) return res.status(400).json({ error: 'Campos obrigatórios: number, video' });

    try {
        const id = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
        
        // Se video é uma URL, baixar o vídeo
        let videoBuffer;
        if (video.startsWith('http')) {
            const response = await axios.get(video, { responseType: 'arraybuffer' });
            videoBuffer = Buffer.from(response.data);
        } else {
            // Se é base64, converter para buffer
            videoBuffer = Buffer.from(video.replace(/^data:video\/[a-z]+;base64,/, ''), 'base64');
        }

        await sock.sendMessage(id, {
            video: videoBuffer,
            caption: caption || ''
        });
        customLog(`📤 Vídeo enviado para: ${id}`);
        res.json({ success: true, to: id, type: 'video' });
    } catch (err) {
        customLog('❌ Erro ao enviar vídeo:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Enviar áudio
app.post('/send-audio', auth, async (req, res) => {
    const { number, audio, ptt = false } = req.body;
    if (!sock) return res.status(500).json({ error: 'WhatsApp desconectado.' });
    if (!number || !audio) return res.status(400).json({ error: 'Campos obrigatórios: number, audio' });

    try {
        const id = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
        
        // Se audio é uma URL, baixar o áudio
        let audioBuffer;
        if (audio.startsWith('http')) {
            const response = await axios.get(audio, { responseType: 'arraybuffer' });
            audioBuffer = Buffer.from(response.data);
        } else {
            // Se é base64, converter para buffer
            audioBuffer = Buffer.from(audio.replace(/^data:audio\/[a-z]+;base64,/, ''), 'base64');
        }

        await sock.sendMessage(id, {
            audio: audioBuffer,
            ptt: ptt // true para áudio de voz, false para música
        });
        customLog(`📤 Áudio enviado para: ${id} (PTT: ${ptt})`);
        res.json({ success: true, to: id, type: 'audio', ptt });
    } catch (err) {
        customLog('❌ Erro ao enviar áudio:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Enviar documento (PDF, etc.)
app.post('/send-document', auth, async (req, res) => {
    const { number, document, filename, caption } = req.body;
    if (!sock) return res.status(500).json({ error: 'WhatsApp desconectado.' });
    if (!number || !document) return res.status(400).json({ error: 'Campos obrigatórios: number, document' });

    try {
        const id = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
        
        // Se document é uma URL, baixar o documento
        let documentBuffer;
        if (document.startsWith('http')) {
            const response = await axios.get(document, { responseType: 'arraybuffer' });
            documentBuffer = Buffer.from(response.data);
                        } else {
            // Se é base64, converter para buffer
            documentBuffer = Buffer.from(document.replace(/^data:application\/[a-z]+;base64,/, ''), 'base64');
        }

        await sock.sendMessage(id, {
            document: documentBuffer,
            fileName: filename || 'documento.pdf',
            caption: caption || ''
        });
        customLog(`📤 Documento enviado para: ${id} (${filename || 'documento.pdf'})`);
        res.json({ success: true, to: id, type: 'document', filename: filename || 'documento.pdf' });
    } catch (err) {
        customLog('❌ Erro ao enviar documento:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Enviar localização
app.post('/send-location', auth, async (req, res) => {
    const { number, latitude, longitude, name, address } = req.body;
    if (!sock) return res.status(500).json({ error: 'WhatsApp desconectado.' });
    if (!number || !latitude || !longitude) return res.status(400).json({ error: 'Campos obrigatórios: number, latitude, longitude' });

    try {
        const id = number.includes('@s.whatsapp.net') ? number : `${number}@s.whatsapp.net`;
        
        await sock.sendMessage(id, {
            location: {
                degreesLatitude: parseFloat(latitude),
                degreesLongitude: parseFloat(longitude),
                name: name || '',
                address: address || ''
            }
        });
        customLog(`📤 Localização enviada para: ${id} (${latitude}, ${longitude})`);
        res.json({ success: true, to: id, type: 'location', latitude, longitude });
    } catch (err) {
        customLog('❌ Erro ao enviar localização:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Webhook de teste
app.post('/webhook-receive', auth, (req, res) => {
    customLog('📤 Webhook recebido:', req.body);
    res.status(200).json({ received: true });
});

// === INICIAR SERVIDOR ===
const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => {
    customLog(`✅ Servidor rodando na porta ${PORT}`);
    customLog(`🔗 Acesse: http://localhost:${PORT}/connect`);
    
    // Iniciar conexão automática após 2 segundos
    setTimeout(() => {
        if (makeWASocket) {
            customLog('🚀 Iniciando conexão automática com WhatsApp...');
            connectToWhatsApp().catch(err => customLog('❌ Erro na conexão automática:', err.message));
        }
    }, 2000);
});

// Tratamento de erros
process.on('unhandledRejection', (err) => {
    console.error('❌ Erro não tratado:', err);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Exceção não capturada:', err);
    process.exit(1);
});