from typing import List, Tuple

from pydantic import BaseModel, Field


class Detection(BaseModel):
    center: Tuple[float, float] = Field(alias="Center")
    class_id: int = Field(alias="ClassID")
    confidence: float = Field(alias="Confidence")
    height: float = Field(alias="Height")
    instance: int = Field(alias="Instance")
    left: float = Field(alias="Left")
    roi: Tuple[float, float, float, float] = Field(alias="ROI")
    right: float = Field(alias="Right")
    top: float = Field(alias="Top")
    track_frames: int = Field(alias="TrackFrames")
    track_id: int = Field(alias="TrackID")
    track_lost: int = Field(alias="TrackLost")
    track_status: int = Field(alias="TrackStatus")
    width: float = Field(alias="Width")

    @classmethod
    def from_detection(cls, detection):
        return cls(
            **{
                (value.alias or key): getattr(detection, (value.alias or key))
                for key, value in cls.model_fields.items()
            }
        )


class DetectionExt(BaseModel):
    detection: Detection
    class_name: str


class DetectionResult(BaseModel):
    detections: List[DetectionExt]
    base64: str
    time: float
