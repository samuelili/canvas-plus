import Extension from "./Extension";

function initializeCustomLink() {
    const instance = Extension.instance;

    let id = window.location.pathname.split('/')[2]
    if (!Object.keys(instance.courses).includes(id)) return;
    let customLinks = instance.courses[id].customLinks;
    console.log("Got course links", customLinks);

    if (Object.keys(customLinks).length !== 0) {
        for (let customLinkName of Object.keys(customLinks).reverse()) {
            console.log('Got custom link', customLinkName, customLinks[customLinkName]);
            let buttonContainer = document.getElementById('course_show_secondary');

            let button = document.createElement('a');
            button.className = "btn button-sidebar-wide";
            button.href = customLinks[customLinkName];
            button.target = '_blank';

            button.innerHTML = `<i class="icon-link"></i> ${customLinkName}`;
            buttonContainer.prepend(button);
        }
    }
}

export default function customInit() {
    if (window.location.pathname.split('/')[1] === 'courses')
        initializeCustomLink()
}