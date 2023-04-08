FROM node:alpine3.11
RUN mkdir /app
WORKDIR /app
COPY ./webpage/frontend /app/
RUN npm install
# RUN npm run build

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV PROXY_API=$PROXY_API
ENV PROXY_LOGIN=$PROXY_LOGIN
# RUN npm start

# COPY frontend/ .
# ENV NUXT_HOST=0.0.0.0
# ENV NUXT_PORT=3000
CMD ["npm", "run", "dev"]
# CMD ["npm", "start"]