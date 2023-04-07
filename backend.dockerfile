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
COPY ./webpage/backend /app/

CMD ["python", "app.py"]