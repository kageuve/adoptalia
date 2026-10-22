# syntax=docker/dockerfile:1
FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS base
WORKDIR /app
COPY package.json package-lock.json ./
FROM base AS development
RUN --mount=type=cache,target=/root/.npm npm ci
COPY --chown=node:node . .
USER node
CMD ["npm", "run", "dev"]
FROM base AS production
ENV NODE_ENV=production
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node . .
RUN mkdir -p public/uploads/imagenes public/uploads/perfiles && chown -R node:node public/uploads
USER node
EXPOSE 3000
CMD ["node", "server.js"]
