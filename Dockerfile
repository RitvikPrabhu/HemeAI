# This docker file will containerize this app.  It will be able to use python and run the app.py.
# It will download package dependencies for ultralytics and be able to use it.  The requirements.txt is used
# to download different packages that are needed for the code such as Flask, ultralytics and other packages that are needed
# for these packages.  This is then exported to port 5000.

# FROM python:3.8.13

# RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
# RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
# RUN python get-pip.py

# RUN apt-get update -y && \
#     apt-get install -y python3-pip python-dev && \
#     apt-get install -y nodejs && \
#     apt-get install -y ffmpeg libsm6 libxext6

# ADD https://ultralytics.com/assets/Arial.ttf /root/.config/Ultralytics/


# # # We copy just the requirements.txt first to leverage Docker cache
# COPY ./requirements.txt requirements.txt
# RUN pip install -r requirements.txt


# COPY ./webpage /app

# WORKDIR /app

# WORKDIR /app/webpage/frontend
# RUN npm install
# CMD ["bash", "-c", "python /app/webpage/backend/app.py & npm run dev"]

FROM node:alpine3.11 AS frontend
RUN mkdir /app
WORKDIR /app
COPY ./webpage /app
WORKDIR /app/webpage/frontend
RUN npm install
RUN npm run build

FROM python:3.8.13
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python get-pip.py
RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev && \
    apt-get install -y ffmpeg libsm6 libxext6

COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN mkdir /app
WORKDIR /app
COPY --from=frontend /app/build /app/static
COPY ./webpage/backend /app/

CMD ["sh", "-c", "python app.py & npm run start"]