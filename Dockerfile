# This docker file will containerize this app.  It will be able to use python and run the app.py.
# It will download package dependencies for ultralytics and be able to use it.  The requirements.txt is used
# to download different packages that are needed for the code such as Flask, ultralytics and other packages that are needed
# for these packages.  This is then exported to port 5000.

FROM python:3.8.13

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
RUN python get-pip.py

RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev && \
    apt-get install -y nodejs && \
    apt-get install -y ffmpeg libsm6 libxext6

ADD https://ultralytics.com/assets/Arial.ttf /root/.config/Ultralytics/

# Install Node.js and npm

# RUN apt-get update && apt-get install -y nodejs

# # We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt
# RUN pip install --no-cache-dir --force-reinstall pillow
# RUN pip install --upgrade pillow

COPY . /app

WORKDIR /app


# RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y


WORKDIR /app/webpage/frontend
# RUN npm install -g pm2
RUN npm install
# RUN npm run build
# CMD ["pm2-runtime", "npm", "--", "run", "dev"]
CMD ["bash", "-c", "python /app/webpage/backend/app.py & npm run dev"]

#docker run -p 5000:5000 -p 3000:5000 hemeai

# WORKDIR /app/webpage//backend
# CMD ["python", "app.py"]

# WORKDIR /app/webpage/frontend



# ENTRYPOINT FLASK_APP=/

# ENTRYPOINT [ "python" ]



# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
