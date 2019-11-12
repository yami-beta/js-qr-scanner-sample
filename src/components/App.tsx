/** @jsx jsx */
import React, { Fragment } from "react";
import { Global, css, jsx } from "@emotion/core";
import { Header } from "./Header";
import { QRScanner } from "./QRScanner";

const App: React.FC<{}> = () => {
  return (
    <Fragment>
      <Global styles={globalStyle} />
      <div>
        <Header text="QR Scanner" />
        <div css={contentAreaStyle}>
          <QRScanner />
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

export { App };
