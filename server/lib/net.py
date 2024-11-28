from jetson_inference import detectNet

net = detectNet(
    "ssd-mobilenet-v2",
    [
        "--model=models/yuki3/mb2-ssd-lite.onnx",
        "--labels=models/yuki3/labels.txt",
        "--input-blob=input_0",
        "--output-cvg=scores",
        "--output-bbox=boxes",
        "--threshold=0",
    ],
)
