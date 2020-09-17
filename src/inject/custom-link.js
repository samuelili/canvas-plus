function initializeCustomLink() {

  let id = window.location.pathname.split('/')[2]
  chrome.runtime.sendMessage({
    action: "GET_COURSES",
    instance: INSTANCE
  }, courses => {
    if (!Object.keys(courses).includes(id)) return;
    let custom = courses[id].custom;

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
  })
}

if (window.location.pathname.split('/')[1] === 'courses')
  initializeCustomLink()