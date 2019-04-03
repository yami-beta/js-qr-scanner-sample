import React, { useState, MouseEvent } from "react";
import { QRScanner } from "./QRScanner";

const App: React.FC<{}> = () => {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowScanner(prev => !prev);
  };

  return (
    <div>
      <h1>QR Scanner</h1>
      <div>
        <p>
          <button onClick={handleClick}>カメラを起動</button>
        </p>
      </div>
      {showScanner && <QRScanner />}
    </div>
  );
};

export { App };
