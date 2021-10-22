import Extension from "../inject";

function initializeCustomLink() {
  let id = window.location.pathname.split('/')[2]
  if (!Object.keys(Extension.state.courses).includes(id)) return;
  let custom = Extension.state.courses[id].custom;
  console.log("Got course link", id, Extension.state.courses);

  if (custom !== "") {
    console.log('Got custom link', custom);
    let buttonContainer = document.getElementById('course_show_secondary');

    let button = document.createElement('a');
    button.className = "btn button-sidebar-wide";
    button.href = custom;
    button.target = '_blank';

    button.innerHTML = '<i class="icon-link"></i> Custom Link';
    buttonContainer.prepend(button);
  }
}

export default function customInit() {
  if (window.location.pathname.split('/')[1] === 'courses')
    initializeCustomLink()
}