import React, { useEffect, useRef } from "react";
import { DetectionResultFromJSON } from "./generated";
import { getCanvasBase64 } from "./utils/canvas";
import { useMediaDevice } from "./utils/media";
import { sendSocket, useSocket } from "./utils/socket";

const App: React.FC = () => {
  const cameraRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const socket = useSocket("ws://localhost:8765");
  const video = useMediaDevice();
  const isMounted = useRef(true);

  const pasteCenter = (ctx: CanvasRenderingContext2D) => {
    const [sw, sh, cw, ch] = [video.videoWidth, video.videoHeight, ctx.canvas.width, ctx.canvas.height];
    if (sw > sh) {
      ctx.drawImage(video, (sw - sh) / 2, 0, sh, sh, 0, 0, cw, cw);
    } else if (sw < sh) {
      ctx.drawImage(video, 0, (sh - sw) / 2, sw, sw, 0, 0, cw, cw);
    } else {
      ctx.drawImage(video, 0, 0, sw, sh, 0, 0, cw, ch);
    }
  };

  const pasteText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text, x, y);
  };

  useEffect(() => {
    if (socket) {
      socket.on("processed_frame", (obj) => {
        const detection = DetectionResultFromJSON(obj);
        if (imgRef.current) {
          imgRef.current.src = `data:image/jpeg;base64,${detection.base64}`;
        }
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d")!;
          ctx.beginPath();
          pasteCenter(ctx);
          detection.detections.forEach((detection) => {
            const [left, top, right, bottom] = detection.detection.rOI;
            ctx.rect(left, top, right - left, bottom - top);
            ctx.strokeStyle = "red";
            ctx.stroke();
            pasteText(ctx, `${detection.className} ${detection.detection.confidence.toFixed(2)}`, left, top - 10);
          });
          ctx.closePath();
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    isMounted.current = true;
    if (socket) {
      (async () => {
        while (isMounted.current) {
          const ctx = cameraRef.current!.getContext("2d")!;
          pasteCenter(ctx);
          pasteText(ctx, `${socket.id}`, 10, 50);
          const base64data = await getCanvasBase64(cameraRef.current!);
          sendSocket(socket, "send_frame", base64data);
          await new Promise((resolve) => setTimeout(resolve, 1000 / 20));
        }
      })();
    }
    return () => {
      isMounted.current = false;
    };
  }, [socket]);

  return (
    <div>
      <h1>React Camera App</h1>
      <canvas ref={canvasRef} style={{ marginTop: "10px" }} width={512} height={512} />
      <canvas ref={cameraRef} style={{ marginTop: "10px" }} width={512} height={512} />
      <img ref={imgRef} alt="Processed Frame" style={{ width: "512px", height: "512px", marginTop: "10px" }} />
    </div>
  );
};

export default App;
