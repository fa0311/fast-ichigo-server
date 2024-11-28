const getCanvasBase64 = (
  canvas: HTMLCanvasElement,
  type: string = "image/jpeg",
  quality: number = 0.8
): Promise<string> => {
  return new Promise<string>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = (reader.result as string).split(",")[1];
            resolve(base64data);
          };
          reader.readAsDataURL(blob);
        }
      },
      type,
      quality
    );
  });
};

export { getCanvasBase64 };
