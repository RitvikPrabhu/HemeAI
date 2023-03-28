# This docker file will containerize this app.  It will be able to use python and run the app.py.
# It will download package dependencies for ultralytics and be able to use it.  The requirements.txt is used
# to download different packages that are needed for the code such as Flask, ultralytics and other packages that are needed
# for these packages.  This is then exported to port 5000.

FROM python:3.7.4

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev

ADD https://ultralytics.com/assets/Arial.ttf /root/.config/Ultralytics/

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip install -r requirements.txt

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY . /app
EXPOSE 5000

ENTRYPOINT [ "python" ]

CMD ["app.py"]
