# FROM python:3.8.13
FROM node:latest

# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install -y curl && \
    apt-get install -y python3

RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python3 get-pip.py
RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev && \
    # apt-get install -y nodejs && \
    apt-get install -y ffmpeg libsm6 libxext6

COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

RUN mkdir /app
RUN mkdir /app/.next
COPY ./webpage /app/
WORKDIR /app/frontend
RUN npm install
RUN npm run build
EXPOSE 3000
EXPOSE 5000

CMD ["npm", "start"]