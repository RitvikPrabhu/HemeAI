FROM node:alpine3.11
RUN mkdir /app
WORKDIR /app
COPY ./webpage/frontend /app/
RUN npm install
RUN npm run dev

# COPY frontend/ .
# ENV NUXT_HOST=0.0.0.0
# ENV NUXT_PORT=3000
# CMD ["npm", "start"]