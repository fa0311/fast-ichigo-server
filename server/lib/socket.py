import asyncio
import base64
from time import time

import cv2
import jetson
import jetson.utils
import numpy as np
import socketio
from aiohttp import web

from server.lib.model import Detection, DetectionExt, DetectionResult
from server.lib.net import net

sio = socketio.AsyncServer(async_mode="aiohttp", cors_allowed_origins="*")
app = web.Application()
sio.attach(app)


@sio.event
async def connect(sid, environ):
    print("[INFO] Connect to client", sid)


@sio.event
def disconnect(sid):
    print("disconnect ", sid)


@sio.on("send_frame")
async def send_frame(sid, data):
    task[sid] = data


task: dict[str, str] = {}


async def background_task(app):
    task = asyncio.create_task(process_image_loop())
    yield
    task.cancel()


async def process_image_loop():
    while True:
        item = list(task.items())
        for sid, data in item:
            processed_data = process_image(data)
            if processed_data:
                asyncio.ensure_future(
                    sio.emit("processed_frame", processed_data, to=sid)
                )
            del task[sid]
        await asyncio.sleep(1 / 20)


app.cleanup_ctx.append(background_task)


def process_image(data):
    try:
        image_data = base64.b64decode(data)
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = jetson.utils.cudaFromNumpy(frame)
        output = net.Detect(img, overlay="box,labels,conf")

        detections = [
            DetectionExt(
                class_name=net.GetClassDesc(detection.ClassID),
                detection=Detection.from_detection(detection),
            )
            for detection in output
        ]

        processed_frame = jetson.utils.cudaToNumpy(img)
        _, buffer = cv2.imencode(".jpg", processed_frame)
        processed_base64 = base64.b64encode(buffer).decode("utf-8")

        response = DetectionResult(
            detections=detections,
            base64=processed_base64,
            time=time(),
        )
        return response.model_dump(by_alias=True)

    except Exception as e:
        print(f"Error processing image: {e}")
        return None
