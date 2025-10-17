# Comandos para resolver o problema do N8N

## 1. Limpar cache do NPM
npm cache clean --force

## 2. Desinstalar versão anterior
npm uninstall n8n-nodes-uadezap

## 3. Instalar versão específica corrigida
npm install n8n-nodes-uadezap@0.1.19

## 4. Verificar se os arquivos estão presentes
ls -la node_modules/n8n-nodes-uadezap/dist/nodes/Uadezap/

## 5. Reiniciar N8N
# Se usando Docker:
docker-compose restart

# Se usando PM2:
pm2 restart n8n

# Se usando systemd:
sudo systemctl restart n8n
