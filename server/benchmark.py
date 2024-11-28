import base64
import time

import cv2
import numpy as np

from server.lib.socket import process_image

if __name__ == "__main__":
    array = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
    image = base64.b64encode(cv2.imencode(".jpg", array)[1]).decode("utf-8")

    start = time.time()
    for _ in range(100):
        process_image(image)
    end = time.time()

    print(f"Time: {end - start:.6f} s")
    print(f"Avg: {(end - start) / 100:.6f} s")
    print(f"FPS: {100 / (end - start):.6f}")
