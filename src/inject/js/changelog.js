export const updateMessage = {
    version: "0.3.8",
    firstMessage: "Thanks for installing Canvas+! Be sure to go to settings (on the top right in the dropdown) to customize your experience!",
    message: "This extension is under heavy development, if there are any issues please DM @samuelili",
    changes: ["Y'all the checkboxes to hide assignments work now ur welcome"],
}
const DEFAULT_VERSION = "0.0.0";

export default function changelog() {
    chrome.storage.sync.get({
        version: DEFAULT_VERSION
    }, function (items) {

        let version = items.version;

        const container = document.createElement("div");
        container.className = "canvas-plus-message";


        if (version !== updateMessage.version || version === DEFAULT_VERSION) {
            let message = `Version ${updateMessage.version}</br>` + updateMessage.message;
            if (version === DEFAULT_VERSION)
                message = updateMessage.firstMessage + " " + message;

            message += '</br>Changes</br>'
            for (let change of updateMessage.changes) {
                message += ` - ${change}</br>`;
            }

            container.innerHTML = `${message}</br><a>Hide</a>`

            document.body.append(container);

            container.lastChild.addEventListener('click', () => {
                container.style.display = 'none';

                chrome.storage.sync.set({
                    version: updateMessage.version,
                    messageHidden: true
                }, () => {
                    console.log('Updated sync version');
                });
            })
        }
    });
}