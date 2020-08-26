window.CANVAS_HEADERS = {
  accept: "application/json, text/javascript, application/json+canvas-string-idss"
};

console.log("Initializing Canvas Plus");

function waitForReady(callback) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      callback();
    }
  }, 10);
}
