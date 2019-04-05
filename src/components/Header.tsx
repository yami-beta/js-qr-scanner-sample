/** @jsx jsx */
import React from "react";
import { css, jsx } from "@emotion/core";

const Header: React.FC<{ text: string }> = ({ text }) => {
  return (
    <header css={headerStyle}>
      <h1 css={h1Style}>{text}</h1>
    </header>
  );
};

const headerStyle = css`
  display: flex;
  justify-content: center;
  padding: 10px;
  background-color: #384e77;
  color: #ffffff;
`;
const h1Style = css`
  margin: 0;
  font-weight: normal;
`;

export { Header };
