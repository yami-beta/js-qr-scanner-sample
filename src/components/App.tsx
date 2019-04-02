import React, { useEffect, useState, useRef } from "react";

const App: React.FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<Error>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(mediaStream => {
        const video = videoRef.current;
        if (!video) {
          return;
        }
        video.srcObject = mediaStream;
        video.onloadeddata = event => {
          video.play();
        };
      })
      .catch(error => {
        setCameraError(error);
      });
  }, [videoRef]);

  return (
    <div>
      <h1>Hello World</h1>
      {cameraError && (
        <div>
          <p>Error</p>
          <pre>{cameraError.message}</pre>
        </div>
      )}
      {!cameraError && <video ref={videoRef} />}
    </div>
  );
};

export { App };
