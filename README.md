## Steps to run the project

1) Clone the repo
2) Install the required libraries using the command `pip install -r requirements.txt`. It is recommended that this is done in its own environment.
3) Navigate to `website/frontend` and run the command `npm install` (Ensure that Node.js is installed. Resources for this can be found here: https://nodejs.org/en/download) 
4) Build the website using the command `npm run build`
5) Start the server and frontend using the command `npm run start`
6) Navigate to `http://localhost:3000` to access the website.

## Milestone 1

In milestone 1, we train a pretrained model called YOLOv8 to identify and classify the blood cells found in a blood sample. Furthermore, we identify the ratios of all the blood cells. 

This aspect of the project can be found under the directory `Milestone1_AutoCBC`. `Data_prepare.ipynb` prepares the data to be used by YOLOv8. The model is trained and tested in `AutoId_and_count_colab.ipynb`.

## Milestone 2

In milestone 2, we train multiple pretrained models (YOLOv8, RetinaNet and Resnet-50) to identify abnormalities in the shape of the cells in the sample and use this information to identify the diseases that the patient may have.

This aspect of the project can be found under the directory `Milestone2_DiseaseDetect`. Each model has their own directory with a single iPython Notebook that does the training and testing of the models.

## Website 

The code for this aspect of the project can be found in the `webpage` directory. The server side code is stored under `backend` and the frontend code is stored in `frontend`. The framework used for the server is called Flask and the framework used for the frontend is called NextJS.

## Running the project using Docker

We have enabled containerization capabilities for the project. To create a docker image, follow the following steps:

1) Install Docker Desktop (Resources for this step can be found here: https://docs.docker.com/desktop/install/mac-install/ (for MacOS) and https://docs.docker.com/desktop/install/windows-install/ (for Windows)
2) Navigate to the home directory on the CLI (the directory where `Dockerfile` can be found).
3) Run the command `docker build -t hemeai .` to build the image with the name `hemeai`
4) Run a container using the command `docker run -d -p 3000:3000 -p 5000:5000 hemeai`. This will run a container in detached mode and has mapped ports 3000 and 5000 to your machine's ports 3000 and 5000.
5) Navigate to `http://localhost:3000` to access the website.


