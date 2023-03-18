import ultralytics
from ultralyticsplus import YOLO, render_result
import sys

# def metrics(arg):
#     return arg

def metrics(image):
    model = YOLO('CBCWeights.pt')

    # set model parameters
    model.overrides['conf'] = 0.25  # NMS confidence threshold
    model.overrides['iou'] = 0.45  # NMS IoU threshold
    model.overrides['agnostic_nms'] = False  # NMS class-agnostic
    model.overrides['max_det'] = 1000  # maximum number of detections per image

    results = model.predict(image, stream=True)
    blood_count = {"RBC":0, "WBC":0, "Platelets":0}

    for r in results:
        for c in r.boxes.cls:
            if model.names[int(c)] in blood_count.keys():
                blood_count[model.names[int(c)]] += 1

    # print(blood_count)

    results = [blood_count['RBC']/sum(blood_count.values()), blood_count['WBC']/sum(blood_count.values()), blood_count['Platelets']/sum(blood_count.values())]
    
    return results

def main(argv):
    output = metrics(argv)
    print(output)
    return output

if __name__ == "__main__":
   main(sys.argv[1])