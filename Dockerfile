# Dockerfile - raiz (uadezap-local)
FROM node:22.16.0-alpine

WORKDIR /app

# Instalar ffmpeg para transcodificação quando necessário
RUN apk add --no-cache ffmpeg

# Copiar manifests primeiro para melhor cache
COPY package*.json ./

RUN npm install --production

# Copiar código
COPY . .

# Porta padrão usada pelo server.js
EXPOSE 3000

# Variáveis opcionais podem ser passadas via docker run ou compose (.env)
# API_KEY, CONFIG_SESSION_PHONE_VERSION, PORT

CMD ["npm", "start"]


