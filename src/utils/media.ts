import { useEffect, useRef, useState } from "react";

const useMediaDevice = (): HTMLVideoElement => {
  const [_, setStream] = useState<MediaStream | undefined>(undefined);
  const videoElement = useRef<HTMLVideoElement>(document.createElement("video"));
  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.current.srcObject = stream;
      videoElement.current.muted = true;
      await videoElement.current.play();
      setStream(stream);
    })();
  }, []);
  return videoElement.current;
};

export { useMediaDevice };
