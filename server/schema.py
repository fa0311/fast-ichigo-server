import fastapi
import uvicorn

from server.lib.model import DetectionResult

app = fastapi.FastAPI()


@app.get("/model")
def model() -> DetectionResult:
    pass


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
