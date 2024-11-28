import fastapi

from server.lib.model import DetectionResult

fapp = fastapi.FastAPI()


@fapp.post("/model")
async def model() -> DetectionResult:
    pass
