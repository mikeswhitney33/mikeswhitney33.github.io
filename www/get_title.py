import io
import cv2 as cv
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pytesseract
from scanner import scan

def plotter(img, new=True):
    if new: plt.figure(figsize=(12,12))
    plt.imshow(img, cmap='gray')
    plt.show()
    pass

def get_bounding_box(img, hthresh=1000, vthresh=100):
    """
    get_bounding_box
    takes in a numpy array and returns a bounding boxed version of the image (cropped)

    parameters:
    img -- the input image
    hthresh -- the min length of horizontal lines
    vthresh -- the min length of vertical lines

    returns the cropped image around our desired bounding box.
    """
    edges = cv.Canny(img, 50, 150, apertureSize=3)
#     plotter(edges)
    lines = cv.HoughLinesP(edges, 1, np.pi/180, 120, minLineLength=170, maxLineGap=20)
#     print(lines)

    xs = []
    ys = []
#     plt.figure(figsize=(12,12))
    for line in lines:
        x1, y1, x2, y2 = line[0]
#         plt.plot([x1,x2], [y1,y2])
        if abs(y2 - y1) > vthresh or abs(x2 - x1) > hthresh:
            xs.append(x1)
            xs.append(x2)
            ys.append(y1)
            ys.append(y2)
#     plotter(img, new=False)
    minx = min(xs)
    miny = min(ys)
    maxx = max(xs)
    maxy = max(ys)

#     plotter(img[miny:maxy, minx:maxx])
    return img[miny:maxy, minx:maxx]

def img2pandas(img):
    import string
    out = pytesseract.image_to_data(img)
    for i in string.punctuation:
        if i in '()_': continue
        out = out.replace(i, '')
    out = out.replace('‘','').replace('"', '').replace("'", '').replace('\t\t', '\t')
#     print(out)
    stream = io.StringIO(out)
    df = pd.read_csv(stream, delimiter='\t', encoding='iso-8859-1')
#     display(df)
    return df

def get_title(title_block):
    expected_start = ['reply', 'defendant', 'counterclaim', 'memorandum', 'application', 'summons', 'motion', 'notice', 'complaint', 'answer', 'decree', 'order']
    expected_end = ['case', 'caseno', 'civil', 'number', 'judge', 'no']

    df = img2pandas(title_block)
    width, height = df[['width', 'height']].values[0] # get document size
    df = df[df.text.notna()]                            # remove rows without text
    right_half = df[df.left > width*0.45]
    title = []
    record = False
    start_line = None
    for i,row in right_half.iterrows():
        if (record is False) and (row.text.lower() in expected_start):
            record = True
            start_line = row.line_num
        elif (record) and (row.text.lower() in expected_end):
            break
        elif start_line and (row.line_num > start_line+2):
            break
        if record:
            title.append(row.text)
    if title == '':
        return ''
    else:
        form_type = title[0]
        if form_type.lower() not in ['summons', 'motion', 'complaint']:
            for i in ['summons', 'motion', 'complaint']:
                if i in title:
                    form_type = i
                    break
            else:
                return ""
        return ' '.join(title).title() + '\n' + title[0].lower()

def parse_file(filename):
    img = cv.imread(filename)
    try:
        scanned = scan(img)
    except Exception as e:
#         print("fail to scan", e)
#         print(img.shape)
        scanned = img[:,:,0]

    try:
#         print(scanned.shape)
        h,w = scanned.shape
        title_block = get_bounding_box(scanned, int(0.6*w), int(0.1*h))
    except Exception as e:
#         print("fail to bound title", e)
        h,w = scanned.shape
        block_top = int(0.3*h)
        block_bot = int(0.6*h)

        title_block = scanned[block_top:block_bot]

    try:
        title = get_title(title_block)
    except Exception as e:
        title = "PARSING ERROR"
#         print("failed to read title", e)
#         raise Exception("Unable to parse title!")

    return title

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("imagename", type=str)
    args = parser.parse_args()

    imagename = args.imagename
    title = parse_file(imagename)
    print(title)

