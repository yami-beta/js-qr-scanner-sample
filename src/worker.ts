import jsQR from "jsqr";

self.addEventListener("message", e => {
  const decoded = jsQR(e.data.data, e.data.width, e.data.height);
  if (decoded) {
    postMessage(decoded.data);
  } else {
    postMessage(null);
  }
});
