import time

# try:
#     from ultralyticsplus import YOLO, render_result
# except ImportError:
#     import ultralyticsplus
#     import ultralyticsplus.YOLO
#     import ultralyticsplus.render_result

import ultralytics
from ultralyticsplus import YOLO, render_result
import json
from flask import Flask, request, render_template, url_for, send_from_directory
import os
from flask_cors import CORS, cross_origin
from flask import send_file
import io
import zipfile

app = Flask(__name__)
cors = CORS(app)

# Serve static files
app.static_folder = './'
app.config['UPLOAD_FOLDER'] = './'

@app.route('/metrics-disease', methods=['POST'])
def disease_get_metrics():
    print('Received a POST request to /metrics')
    # print(request.files)
    app.logger.info('Received a request to /metrics-disease')

    model = YOLO('best.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    images = request.files.getlist('images[]')
    disease_blood_count = {"neutrophil": 0, "eosinophil": 0, "basophil": 0, "lymphocyte": 0, "monocyte": 0, "myelocyte": 0, "erythroblast": 0, "abnormal_rbc": 0, "band_neutrophil": 0, "segmented_neutrophil": 0}

    for image_file in images:
        # save the file to a location on your server
        image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
        image_file.save(image)

        image_results = model.predict(image, stream=True)
        
        print(model.names[0])
        
        for r in image_results:
            for c in r.boxes.cls:
                if model.names[int(c)] in disease_blood_count.keys():
                    disease_blood_count[model.names[int(c)]] += 1
                    
    neutrophil_ratio = disease_blood_count['neutrophil'] / sum(disease_blood_count.values())
    eosinophil_ratio = disease_blood_count['eosinophil'] / sum(disease_blood_count.values())
    basophil_ratio = disease_blood_count['basophil'] / sum(disease_blood_count.values())
    lymphocyte_ratio = disease_blood_count['lymphocyte'] / sum(disease_blood_count.values())
    monocyte_ratio = disease_blood_count['monocyte'] / sum(disease_blood_count.values())
    myelocyte_ratio = disease_blood_count['myelocyte'] / sum(disease_blood_count.values())
    erythroblast_ratio = disease_blood_count['erythroblast'] / sum(disease_blood_count.values())
    abnormal_rbc_ratio = disease_blood_count['abnormal_rbc'] / sum(disease_blood_count.values())
    band_neutrophil_ratio = disease_blood_count['band_neutrophil'] / sum(disease_blood_count.values())
    segmented_neutrophil_ratio = disease_blood_count['segmented_neutrophil'] / sum(disease_blood_count.values())
#    results = {"RBC": blood_count['RBC'] / sum(blood_count.values()) * 100,
#                       "WBC": blood_count['WBC'] / sum(blood_count.values()) * 100,
#                       "Platelets": blood_count['Platelets'] / sum(blood_count.values()) * 100}
    results = {"neutrophils": (neutrophil_ratio + band_neutrophil_ratio + segmented_neutrophil_ratio) * 100,
               "eosinophils": eosinophil_ratio * 100,
               "basophils": basophil_ratio * 100,
               "lymphocytes": lymphocyte_ratio * 100,
               "monocytes": monocyte_ratio * 100,
               "myelocytes": myelocyte_ratio * 100,
               "erythroblasts": erythroblast_ratio * 100,
               "abnormal_rbc": abnormal_rbc_ratio * 100}
    return json.dumps(results)

@app.route('/metrics-and-images-disease', methods=['POST'])
def disease_determine():
    print('Received a POST request to /metrics-and-images')
    app.logger.info('Received a request to /metrics-and-images')

    model = YOLO('best.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    images = request.files.getlist('images[]')
    disease_blood_count = {"neutrophils": 0, "eosinophils": 0, "basophils": 0, "lymphocytes": 0, "monocytes": 0, "myelocytes": 0, "erythroblasts": 0, "abnormal_rbc": 0, "band_neutrophils": 0, "segmented_neutrophils": 0}

    zipped_buffer = io.BytesIO()  # create a buffer to store zipped data
    with zipfile.ZipFile(zipped_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for image_file in images:
            # save the file to a location on your server
            image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image)

            image_results = model.predict(image, stream=True)

            for r in image_results:
                for c in r.boxes.cls:
                    if model.names[int(c)] in disease_blood_count.keys():
                        disease_blood_count[model.names[int(c)]] += 1

            # add the rendered image to the zip file
            for i, result in enumerate(image_results):
                render = render_result(model=model, image=image, result=result)
                render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                render.save(render_path)
                zip_file.write(render_path, arcname=render_filename)

            try:
                if os.path.isfile(image):
                    os.remove(image)
                for i in range(len(image_results)):
                    render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                    render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                    if os.path.isfile(render_path):
                        os.remove(render_path)
            except PermissionError:
                time.sleep(1)
                if os.path.isfile(image):
                    os.remove(image)
                for i in range(len(image_results)):
                    render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                    render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                    if os.path.isfile(render_path):
                        os.remove(render_path)

    zipped_buffer.seek(0)  # move the pointer to the beginning of the buffer
    neutrophil_ratio = disease_blood_count['neutrophils'] / sum(disease_blood_count.values())
    eosinophil_ratio = disease_blood_count['eosinophils'] / sum(disease_blood_count.values())
    basophil_ratio = disease_blood_count['basophils'] / sum(disease_blood_count.values())
    lymphocyte_ratio = disease_blood_count['lymphocytes'] / sum(disease_blood_count.values())
    monocyte_ratio = disease_blood_count['monocytes'] / sum(disease_blood_count.values())
    myelocyte_ratio = disease_blood_count['myelocytes'] / sum(disease_blood_count.values())
    erythroblast_ratio = disease_blood_count['erythroblasts'] / sum(disease_blood_count.values())
    abnormal_rbc_ratio = disease_blood_count['abnormal_rbc'] / sum(disease_blood_count.values())
    band_neutrophil_ratio = disease_blood_count['band_neutrophils'] / sum(disease_blood_count.values())
    segmented_neutrophil_ratio = disease_blood_count['segmented_neutrophils'] / sum(disease_blood_count.values())

    results = {"neutrophils": (neutrophil_ratio + band_neutrophil_ratio + segmented_neutrophil_ratio) * 100,
               "eosinophils": eosinophil_ratio * 100,
               "basophils": basophil_ratio * 100,
               "lymphocytes": lymphocyte_ratio * 100,
               "monocytes": monocyte_ratio * 100,
               "myelocytes": myelocyte_ratio * 100,
               "erythroblasts": erythroblast_ratio * 100,
               "abnormal_rbc": abnormal_rbc_ratio * 100}
    
    disease_arr = []
    
    result_char = ""
    
    #This is based on https://training.seer.cancer.gov/abstracting/procedures/clinical/hematologic/blood.html.  If there is anything to fix please do so.
    if (neutrophil_ratio < 0.01 & eosinophil_ratio > 0.01 & eosinophil_ratio < 0.03 & basophil_ratio < 0.01 &
        lymphocyte_ratio < 0.4 & lymphocyte_ratio > 0.2 & monocyte_ratio > 0.04 & monocyte_ratio < 0.08 &
        myelocyte_ratio == 0 & band_neutrophil_ratio < 0.05 & segmented_neutrophil_ratio < 0.6 & segmented_neutrophil_ratio > 0.4):
        disease_arr.append("healthy")
    elif basophil_ratio > 0.01:
        disease_arr.append("basophilia")
    elif eosinophil_ratio < 0.01 or eosinophil_ratio > 0.03:
        disease_arr.append("eosinophilia")
    response = {}
    return json.dumps(response)

@app.route('/images-disease', methods=['POST'])
def disease_get_image():
    print("howdy")
    app.logger.info('Received a request to /images-disease')

    image_files = request.files.getlist('images[]')

    model = YOLO('best.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    zipped_buffer = io.BytesIO()  # create a buffer to store zipped data
    with zipfile.ZipFile(zipped_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for image_file in image_files:
            # save the file to a location on your server
            image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image)

            image_results = model.predict(image)
            render = render_result(model=model, image=image, result=image_results[0])

            render_filename = f"{os.path.splitext(image_file.filename)[0]}_rendered.jpg"
            render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
            render.save(render_path)

            # add the rendered image to the zip file
            zip_file.write(render_path, arcname=render_filename)

            try:
                if os.path.isfile(image):
                    os.remove(image)
                if os.path.isfile(render_path):
                    os.remove(render_path)
            except PermissionError:
                time.sleep(1)
                if os.path.isfile(image):
                    os.remove(image)
                if os.path.isfile(render_path):
                    os.remove(render_path)

    zipped_buffer.seek(0)  # move the pointer to the beginning of the buffer
    return send_file(zipped_buffer, mimetype='application/zip', as_attachment=True, download_name='rendered_images.zip')

@app.route('/metrics-and-images-disease', methods=['POST'])
def disease_get_metrics_and_images():
    print('Received a POST request to /metrics-and-images')
    app.logger.info('Received a request to /metrics-and-images')

    model = YOLO('best.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    images = request.files.getlist('images[]')
    disease_blood_count = {"neutrophils": 0, "eosinophils": 0, "basophils": 0, "lymphocytes": 0, "monocytes": 0, "myelocytes": 0, "erythroblasts": 0, "abnormal_rbc": 0, "band_neutrophils": 0, "segmented_neutrophils": 0}

    zipped_buffer = io.BytesIO()  # create a buffer to store zipped data
    with zipfile.ZipFile(zipped_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for image_file in images:
            # save the file to a location on your server
            image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image)

            image_results = model.predict(image, stream=True)

            for r in image_results:
                for c in r.boxes.cls:
                    if model.names[int(c)] in disease_blood_count.keys():
                        disease_blood_count[model.names[int(c)]] += 1

            # add the rendered image to the zip file
            for i, result in enumerate(image_results):
                render = render_result(model=model, image=image, result=result)
                render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                render.save(render_path)
                zip_file.write(render_path, arcname=render_filename)

            try:
                if os.path.isfile(image):
                    os.remove(image)
                for i in range(len(image_results)):
                    render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                    render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                    if os.path.isfile(render_path):
                        os.remove(render_path)
            except PermissionError:
                time.sleep(1)
                if os.path.isfile(image):
                    os.remove(image)
                for i in range(len(image_results)):
                    render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                    render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                    if os.path.isfile(render_path):
                        os.remove(render_path)

    zipped_buffer.seek(0)  # move the pointer to the beginning of the buffer

    results = {"neutrophils": disease_blood_count['neutrophils'] / sum(disease_blood_count.values()) * 100,
               "eosinophils": disease_blood_count['eosinophils'] / sum(disease_blood_count.values()) * 100,
               "basophils": disease_blood_count['basophils'] / sum(disease_blood_count.values()) * 100,
               "lymphocytes": disease_blood_count['lymphocytes'] / sum(disease_blood_count.values()) * 100,
               "monocytes": disease_blood_count['monocytes'] / sum(disease_blood_count.values()) * 100,
               "myelocytes": disease_blood_count['myelocytes'] / sum(disease_blood_count.values()) * 100,
               "erythroblasts": disease_blood_count['erythroblasts'] / sum(disease_blood_count.values()) * 100,
               "abnormal_rbc": disease_blood_count['abnormal_rbc'] / sum(disease_blood_count.values()) * 100,
               "band_neutrophils": disease_blood_count['band_neutrophils'] / sum(disease_blood_count.values()) * 100,
               "segmented_neutrophils": disease_blood_count['segmented_neutrophils'] / sum(disease_blood_count.values()) * 100}

    response = {"metrics": results,
                "zipped_images": send_file(zipped_buffer,
                                           mimetype='application/zip',
                                           as_attachment=True,
                                           download_name='rendered_images.zip')}
    return json.dumps(response)

# Serve the Next.js application from the "/app" route
@app.route('/<path:path>/')
def serve_static(path):
    return send_from_directory('../backend/.next', path)

@app.route('/test', methods=['GET'])
def test():
    return "Hello World"

@app.route('/metrics-and-images', methods=['POST'])
def get_metrics_and_images():
    print('Received a POST request to /metrics-and-images')
    app.logger.info('Received a request to /metrics-and-images')

    model = YOLO('CBCWeights.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    images = request.files.getlist('images[]')
    blood_count = {"RBC": 0, "WBC": 0, "Platelets": 0}

    zipped_buffer = io.BytesIO()  # create a buffer to store zipped data
    with zipfile.ZipFile(zipped_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for image_file in images:
            # save the file to a location on your server
            image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image)

            image_results = model.predict(image, stream=True)

            for r in image_results:
                for c in r.boxes.cls:
                    if model.names[int(c)] in blood_count.keys():
                        blood_count[model.names[int(c)]] += 1

            # add the rendered image to the zip file
            for i, result in enumerate(image_results):
                render = render_result(model=model, image=image, result=result)
                render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                render.save(render_path)
                zip_file.write(render_path, arcname=render_filename)

            try:
                if os.path.isfile(image):
                    os.remove(image)
                for i in range(len(image_results)):
                    render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                    render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                    if os.path.isfile(render_path):
                        os.remove(render_path)
            except PermissionError:
                time.sleep(1)
                if os.path.isfile(image):
                    os.remove(image)
                for i in range(len(image_results)):
                    render_filename = f"{os.path.splitext(image_file.filename)[0]}_result{i}.jpg"
                    render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
                    if os.path.isfile(render_path):
                        os.remove(render_path)

    zipped_buffer.seek(0)  # move the pointer to the beginning of the buffer

    results = {"RBC": blood_count['RBC'] / sum(blood_count.values()) * 100,
               "WBC": blood_count['WBC'] / sum(blood_count.values()) * 100,
               "Platelets": blood_count['Platelets'] / sum(blood_count.values()) * 100}

    response = {"metrics": results,
                "zipped_images": send_file(zipped_buffer,
                                           mimetype='application/zip',
                                           as_attachment=True,
                                           download_name='rendered_images.zip')}
    return json.dumps(response)





@app.route('/metrics', methods=['POST'])
def get_metrics():
    print('Received a POST request to /metrics')
    # print(request.files)
    app.logger.info('Received a request to /metrics')

    model = YOLO('CBCWeights.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    images = request.files.getlist('images[]')
    blood_count = {"RBC": 0, "WBC": 0, "Platelets": 0}

    for image_file in images:
        # save the file to a location on your server
        image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
        image_file.save(image)

        image_results = model.predict(image, stream=True)
        

        for r in image_results:
            for c in r.boxes.cls:
                if model.names[int(c)] in blood_count.keys():
                    blood_count[model.names[int(c)]] += 1
    results = {"RBC": blood_count['RBC'] / sum(blood_count.values()) * 100,
                       "WBC": blood_count['WBC'] / sum(blood_count.values()) * 100,
                       "Platelets": blood_count['Platelets'] / sum(blood_count.values()) * 100}



    return json.dumps(results)



@app.route('/images', methods=['POST'])
def get_images():
    print("howdy")
    app.logger.info('Received a request to /images')

    image_files = request.files.getlist('images[]')

    model = YOLO('CBCWeights.pt')
    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    zipped_buffer = io.BytesIO()  # create a buffer to store zipped data
    with zipfile.ZipFile(zipped_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for image_file in image_files:
            # save the file to a location on your server
            image = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
            image_file.save(image)

            image_results = model.predict(image)
            render = render_result(model=model, image=image, result=image_results[0])

            render_filename = f"{os.path.splitext(image_file.filename)[0]}_rendered.jpg"
            render_path = os.path.join(app.config['UPLOAD_FOLDER'], render_filename)
            render.save(render_path)

            # add the rendered image to the zip file
            zip_file.write(render_path, arcname=render_filename)

            try:
                if os.path.isfile(image):
                    os.remove(image)
                if os.path.isfile(render_path):
                    os.remove(render_path)
            except PermissionError:
                time.sleep(1)
                if os.path.isfile(image):
                    os.remove(image)
                if os.path.isfile(render_path):
                    os.remove(render_path)

    zipped_buffer.seek(0)  # move the pointer to the beginning of the buffer
    return send_file(zipped_buffer, mimetype='application/zip', as_attachment=True, download_name='rendered_images.zip')

if __name__ == '__main__':
   app.run(debug=True, host='0.0.0.0')
#    app.run(debug=False)