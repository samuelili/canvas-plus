const updateMessage = {
  version: "0.1.1.2",
  firstMessage: "Thanks for installing Canvas+! Be sure to go to settings to customize your experience!",
  message: "This extension is under heavy development, if there are any issues please DM @samuelili",
  changes: ["Modified settings page", "Support for multiple Canvases", "Fixed custom links not working"],
}
const DEFAULT_VERSION = "0.0.0";
const INSTANCE = window.location.hostname.split('.')[0];


window.CANVAS_HEADERS = {
  accept: "application/json, text/javascript, application/json+canvas-string-ids"
};

const settingsSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" class='ic-icon-svg menu-item__icon svg-icon-help' viewBox=\"0 0 2000 2000\" version=\"1.1\">\n" +
  "    <path d=\"M960 1120c-88.4 0-160-71.6-160-160s71.6-160 160-160 160 71.6 160 160-71.6 160-160 160zm160-960H800l-93.76 187.44-198.8-66.24L281.2 507.44l66.24 198.8L160 800v320l187.44 93.76-66.24 198.8 226.24 226.24 198.8-66.24L800 1760h320l93.76-187.44 198.8 66.24 226.24-226.24-66.24-198.8L1760 1120V800l-187.44-93.76 66.24-198.8-226.24-226.24-198.8 66.24L1120 160zM960 1280c176.48 0 320-143.52 320-320s-143.52-320-320-320-320 143.52-320 320 143.52 320 320 320zm61.12-960l49.52 99.04 62 124.08 131.68-43.84 105.04-35.04 86.4 86.4-35.04 105.04-43.84 131.68 124.08 62 99.04 49.52v122.24l-99.04 49.52-124.08 62 43.84 131.68 35.04 105.04-86.4 86.4-105.04-35.04-131.68-43.84-62 124.08-49.52 99.04H898.88l-49.52-99.04-62-124.08-131.68 43.84-105.04 35.04-86.4-86.4 35.04-105.04 43.84-131.68-124.08-62-99.04-49.52V898.88l99.04-49.52 124.08-62-43.84-131.68-35.04-105.04 86.4-86.4 105.04 35.04 131.68 43.84 62-124.08L898.88 320h122.24z\" stroke=\"none\" stroke-width=\"1\" fill-rule=\"evenodd\"/>\n" +
  "</svg>"

console.log("Initializing Canvas Plus");

function waitForReady(callback) {
  let readyStateCheckInterval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      callback();
    }
  }, 10);
}

// inject the settings button
function settingsButton() {
  let button = document.createElement('li');
  button.className = "menu-item ic-app-header__menu-list-item";

  button.innerHTML = "<a href=\"#\" class=\"ic-app-header__menu-list-link\">" +
    "              <div class=\"menu-item-icon-container\" aria-hidden=\"true\">" +
    settingsSvg +
    "              </div>" +
    "              <div class=\"menu-item__text\">" +
    "                Canvas+" +
    "              </div>" +
    "            </a>"

  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({action: "OPTIONS"});
  });

  document.getElementById('menu').append(button);
}

function changeLog(version) {
  const container = document.createElement("div");
  container.className = "canvas-plus-message";

  if (version !== updateMessage.version || version === DEFAULT_VERSION) {
    let message = updateMessage.message;
    if (version === DEFAULT_VERSION)
      message = updateMessage.firstMessage + " " + message;

    message += '</br>Changes</br>'
    for (let change of updateMessage.changes) {
      message += ` - ${change}</br>`;
    }

    container.innerHTML = `${message}</br><a>Hide</a>`

    document.body.append(container);

    chrome.storage.sync.set({
      version: updateMessage.version,
      messageHidden: false
    }, () => {
      console.log('Updated sync version');
    });

    container.lastChild.addEventListener('click', () => {
      container.style.display = 'none';
      chrome.storage.sync.set({
        messageHidden: true
      });
    })
  }

}

chrome.runtime.sendMessage({
  action: 'REGISTER_INSTANCE',
  instance: INSTANCE
});

chrome.storage.sync.get({
  version: DEFAULT_VERSION
}, function (items) {
  changeLog(items.version);
});

settingsButton();