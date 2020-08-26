window.CANVAS_HEADERS = {
  accept: "application/json, text/javascript, application/json+canvas-string-idss"
};

console.log("Initializing Canvas Plus");

function waitForReady(callback) {
  let readyStateCheckInterval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      callback();
    }
  }, 10);
}
