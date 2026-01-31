# Dockerfile - raiz (uadezap-local)
FROM node:18-alpine

WORKDIR /app

# Dependências do sistema
RUN apk add --no-cache ffmpeg

# Cache inteligente
COPY package*.json ./
RUN npm install --production

# Código
COPY . .

# Porta padrão (EasyPanel + Docker)
EXPOSE 8080

# Variáveis:
# API_KEY
# CONFIG_SESSION_PHONE_VERSION
# PORT=8080
CMD ["npm", "start"]
