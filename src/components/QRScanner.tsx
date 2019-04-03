import React, { useEffect, useState, useRef } from "react";

const QRScanner: React.FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const [cameraError, setCameraError] = useState<Error>();
  const [qrData, setQrData] = useState<string | undefined>(undefined);

  useEffect(() => {
    let timer: any;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(mediaStream => {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        video.srcObject = mediaStream;
        video.addEventListener("loadedmetadata", event => {
          const canvas = canvasRef.current;
          if (!canvas) {
            return;
          }

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          timer = setInterval(() => {
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              return;
            }
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }, 1000);
        });
        video.addEventListener("loadeddata", event => {
          video.play();
        });
      })
      .catch(error => {
        setCameraError(error);
      });

    return () => {
      clearInterval(timer);
    };
  }, [videoRef, canvasRef]);

  useEffect(() => {
    let timer: any;
    const worker = new Worker("worker.js");
    worker.addEventListener("message", event => {
      if (event.data) {
        setQrData(event.data);
        return;
      }
      timer = setTimeout(() => {
        sendWorker();
      }, 1000);
    });

    const sendWorker = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      worker.postMessage(imageData);
    };

    sendWorker();

    return () => {
      clearTimeout(timer);
    };
  }, [canvasRef]);
  return (
    <div>
      {cameraError && (
        <div>
          <p>Error</p>
          <pre>{cameraError.message}</pre>
        </div>
      )}
      {!cameraError && <video ref={videoRef} width={640} height={480} />}
      {qrData && (
        <div>
          <h2>Result</h2>
          <pre>
            <code>{qrData}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export { QRScanner };
