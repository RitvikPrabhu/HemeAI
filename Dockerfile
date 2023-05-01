# This is the front end part of the code where it installs npm as well as anything the frontend requires
# and builds the necessary parts of the website

FROM node:latest AS frontend-build
WORKDIR /usr/local/app
COPY webpage/frontend/package.json webpage/frontend/package-lock.json ./
RUN npm install && rm -rf /root/.npm
COPY webpage/frontend ./
RUN npm run build

# This is the backend portion which uses node:latest and installs python3 and its dependencies including
# pip.  The backend also installs all the required packages for app.py such as Flask and ultralytics.
# FROM python:3.8.13
FROM node:latest

# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install -y curl && \
    apt-get install -y python3 &&\
    apt-get clean

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py &&\
    python3 get-pip.py &&\
    apt-get update -y && \
    apt-get install -y python3-pip python-dev && \
    # apt-get install -y nodejs && \
    apt-get install -y ffmpeg libsm6 libxext6 &&\
    apt-get clean

# RUN apk add --update --no-cache curl python3-dev py3-pip && \
# curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
# python3 get-pip.py && \
# apk add --no-cache ffmpeg libsm6 libxext6 && \
# rm -rf /var/cache/apk/*

COPY ./requirements.txt requirements.txt 
RUN pip install -r requirements.txt --no-cache-dir  && \
     rm -rf /root/.cache
# RUN rm -rf /usr/local/lib/python3.9/dist-packages/nvidia/cudnn && \
#     rm -rf /usr/local/lib/python3.9/dist-packages/nvidia &&\
#  RUN  rm -rf /root/.cache
    
# This part of the code combines the frontend and backend portion to create a
# multistaged dockerfile in order for the website to work.  As well as start
# the server.

# RUN mkdir /app &&\
#     mkdir /app/.next
WORKDIR /app/
COPY ./webpage/backend /app/backend
WORKDIR /app/frontend
COPY webpage/frontend/*.json webpage/frontend/*.js webpage/frontend/*.pt ./
COPY webpage/frontend/public ./public
RUN npm install --production && rm -rf /root/.npm
COPY --from=frontend-build /usr/local/app/.next ./.next
EXPOSE 3000
EXPOSE 5000

CMD ["npm", "start"]
