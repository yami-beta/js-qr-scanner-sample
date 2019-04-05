/** @jsx jsx */
import React, { useState, Fragment, MouseEvent } from "react";
import { Global, css, jsx } from "@emotion/core";
import { Header } from "./Header";
import { QRScanner } from "./QRScanner";

const App: React.FC<{}> = () => {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowScanner(prev => !prev);
  };

  return (
    <Fragment>
      <Global styles={globalStyle} />
      <div>
        <Header text="QR Scanner" />
        <div css={contentAreaStyle}>
          <div css={buttonListStyle}>
            <button
              css={showScanner ? stopButtonStyle : buttonStyle}
              onClick={handleClick}
            >
              {showScanner ? "カメラを停止する" : "カメラを起動する"}
            </button>
          </div>

          {showScanner && <QRScanner />}
        </div>
      </div>
    </Fragment>
  );
};

const globalStyle = css`
  body {
    color: rgba(0, 0, 0, 0.87);
  }
`;

const contentAreaStyle = css`
  padding: 10px;
`;
const buttonListStyle = css`
  display: flex;
  justify-content: center;
  padding: 10px 0;
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

export { App };
