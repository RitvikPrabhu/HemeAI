import ultralytics
from ultralyticsplus import YOLO, render_result
import json
from flask import Flask, request, render_template
import os

app = Flask(__name__, template_folder='./')

# Serve static files
app.static_folder = './'
app.config['UPLOAD_FOLDER'] = './'

model = YOLO('CBCWeights.pt')

# set model parameters
model.overrides['conf'] = 0.25  # NMS confidence threshold
model.overrides['iou'] = 0.45  # NMS IoU threshold
model.overrides['agnostic_nms'] = False  # NMS class-agnostic
model.overrides['max_det'] = 1000  # maximum number of detections per image

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/milestone1.html')
def milestone():
    return render_template('/milestone1.html')

@app.route('/metrics', methods=['POST'])
def get_metrics():
    print('Received a POST request to /metrics')
    # print(request.files)
    app.logger.info('Received a request to /metrics')

    image_file = request.files['image']

    # save the file to a location on your server
    image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(image)

    results = model.predict(image, stream=True)
    blood_count = {"RBC":0, "WBC":0, "Platelets":0}

    for r in results:
        for c in r.boxes.cls:
            if model.names[int(c)] in blood_count.keys():
                blood_count[model.names[int(c)]] += 1

    results = {"RBC": blood_count['RBC']/sum(blood_count.values()),
                "WBC":blood_count['WBC']/sum(blood_count.values()),
                "Platelets": blood_count['Platelets']/sum(blood_count.values())}
    os.remove(image)
    return json.dumps(results)

@app.route('/image', methods=['POST'])
def get_image():
    app.logger.info('Received a request to /image')

    image_file = request.files['image']

    # save the file to a location on your server
    image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(image)

    results = model.predict(image)
    
    render = render_result(model=model, image=image, result=results[0])
    
    os.remove(image)
    

if __name__ == '__main__':
    app.run(debug=True)