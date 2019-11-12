/** @jsx jsx */
import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  MouseEvent
} from "react";
import { css, jsx } from "@emotion/core";
import Modal from "react-modal";

Modal.setAppElement("#root");

const QRScanner: React.FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [facingMode, setFacingMode] = useState<string>("user");
  const [cameraError, setCameraError] = useState<Error>();
  const [qrData, setQrData] = useState<string | undefined>(undefined);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowScanner(prev => !prev);
  };

  useEffect(() => {
    if (!showScanner) {
      return;
    }

    const video = videoRef.current;
    let timer: any;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode } })
      .then(mediaStream => {
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
  }, [facingMode, showScanner]);

  const [stopWorker, setStopWorker] = useState(false);

  useEffect(() => {
    if (!showScanner) {
      return;
    }
    let timer: any;
    const canvas = canvasRef.current;
    const worker = new Worker("worker.js");
    worker.addEventListener("message", event => {
      if (event.data) {
        setQrData(event.data);
        setStopWorker(true);
      }
      if (stopWorker) {
        return;
      }
      timer = setTimeout(() => {
        sendWorker();
      }, 500);
    });

    const sendWorker = () => {
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
  }, [showScanner, stopWorker]);

  const handleRadio = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.currentTarget.value) {
      return;
    }
    setFacingMode(event.currentTarget.value);
  };

  const handleClickCopy = (event: MouseEvent<HTMLButtonElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }
    textarea.select();
    document.execCommand("copy");
  };

  return (
    <div css={qrScannerStyle}>
      <div css={buttonListStyle}>
        <button
          css={showScanner ? stopButtonStyle : buttonStyle}
          onClick={handleClick}
        >
          {showScanner ? "カメラを停止する" : "カメラを起動する"}
        </button>
      </div>

      {cameraError && (
        <div css={errorListStyle}>
          <div css={errorMessageStyle}>
            <p css={errorTextStyle}>Error</p>
            <pre css={errorTextStyle}>{cameraError.message}</pre>
          </div>
        </div>
      )}

      <div css={selectFacingAreaStyle}>
        <div css={facingModeItemStyle}>
          <label>
            <input
              type="radio"
              name="facingMode"
              value="user"
              checked={facingMode === "user"}
              onChange={handleRadio}
            />
            <span>フロントカメラ</span>
          </label>
        </div>
        <div css={facingModeItemStyle}>
          <label>
            <input
              type="radio"
              name="facingMode"
              value="environment"
              checked={facingMode === "environment"}
              onChange={handleRadio}
            />
            <span>背面カメラ</span>
          </label>
        </div>
      </div>

      <div css={cameraAreaStyle}>
        <video ref={videoRef} autoPlay playsInline css={videoStyle} />
      </div>

      <Modal isOpen={!!qrData}>
        <div css={resultAreaStyle}>
          <h2 css={resultH2Style}>Result</h2>
          <textarea
            css={resultTextAreaStyle}
            defaultValue={qrData}
            ref={textareaRef}
          />
          <button onClick={handleClickCopy}>Copy</button>
          <button
            onClick={() => {
              setQrData(undefined);
              setStopWorker(false);
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

const qrScannerStyle = css`
  padding: 10px 0;
`;

const buttonListStyle = css`
  display: flex;
  justify-content: center;
  padding: 0 0 10px;
`;
const buttonStyle = css`
  padding: 0.5em;
  outline: none;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(0, 120, 212, 1);
  border: none;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 120, 212, 0.8);
  }
`;
const stopButtonStyle = css`
  ${buttonStyle};
  background-color: rgba(232, 17, 35, 1);
  &:hover {
    background-color: rgba(232, 17, 35, 0.8);
  }
`;
const cameraAreaStyle = css`
  padding: 10px;
  border: 1px solid rgba(0, 0, 0, 0.54);
`;

const videoStyle = css`
  width: 100%;
  max-height: 50vh;
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

const selectFacingAreaStyle = css`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;
const facingModeItemStyle = css`
  padding: 0 0.5em 0 0;
  & > label {
    cursor: pointer;
  }
  span {
    padding: 0 0 0 0.5em;
  }
`;

const resultAreaStyle = css`
  padding: 20px 0;
`;
const resultH2Style = css`
  margin: 0;
  padding: 0 0 10px;
`;
const resultTextAreaStyle = css`
  width: 100%;
  min-height: 4em;
  padding: 5px;
`;

export { QRScanner };
