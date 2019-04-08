/** @jsx jsx */
import React, { useEffect, useState, useRef } from "react";
import { css, jsx } from "@emotion/core";

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

      // カメラの停止処理
      const video = videoRef.current;
      if (!video) {
        return;
      }
      const stream = video.srcObject as MediaStream | null;
      if (!stream) {
        return;
      }
      stream.getTracks().forEach(track => {
        track.stop();
      });
      video.srcObject = null;
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
    <div css={qrScannerStyle}>
      {cameraError && (
        <div css={errorListStyle}>
          <div css={errorMessageStyle}>
            <p css={errorTextStyle}>Error</p>
            <pre css={errorTextStyle}>{cameraError.message}</pre>
          </div>
        </div>
      )}

      <div css={cameraAreaStyle}>
        <video ref={videoRef} autoPlay playsInline css={videoStyle} />
      </div>

      {qrData && (
        <div css={resultAreaStyle}>
          <h2 css={resulth2Style}>Result</h2>
          <pre css={resultPreStyle}>{qrData}</pre>
        </div>
      )}
    </div>
  );
};

const qrScannerStyle = css`
  padding: 10px 0;
`;

const cameraAreaStyle = css`
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.54);
`;

const videoStyle = css`
  width: 100%;
`;

const errorListStyle = css`
  padding: 10px 0;
`;
const errorMessageStyle = css`
  padding: 10px;
  background-color: rgba(232, 17, 35, 0.2);
  border-radius: 5px;
`;
const errorTextStyle = css`
  margin: 0;
  padding: 0.5em 0;
`;

const resultAreaStyle = css`
  padding: 20px 0;
`;
const resulth2Style = css`
  margin: 0;
  padding: 0 0 10px;
`;
const resultPreStyle = css`
  white-space: pre-wrap;
  margin: 0;
  padding: 10px 0;
`;

export { QRScanner };
