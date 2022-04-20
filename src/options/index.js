import ReactDOM from "react-dom";
import React from "react";
import Root from "./js/Root";

document.getElementById('bad-button').addEventListener('click', () => {
    chrome.runtime.sendMessage({
        action: "RESET",
    })
    setTimeout(function() {
        window.close();
    }, 1000);
});

ReactDOM.render(
    <Root/>,
    document.getElementById('root')
);