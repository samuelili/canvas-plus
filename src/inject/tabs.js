async function getTabs() {
  let courses = await fetch('/api/v1/users/self/favorites/courses?include[]=total_scores', {
    headers: CANVAS_HEADERS
  });
  courses = await courses.json();

  console.log(courses);

  sessionStorage.setItem('courses', "true");
  chrome.runtime.sendMessage({
    action: "SET_COURSES",
    courses,
    instance: INSTANCE
  }, newState => {
    state = newState;
    createTabs();
  })
}

function createTabs() {
  let courseIds = state.courseIds;
  let courses = state.courses;

  console.log('Creating tabs with', courseIds, courses);
  document.body.classList.add('tabs-enabled');
  let topBarCourses = document.createElement("div");
  topBarCourses.id = "tabs-courses";

  // need to shift page down if in conversations
  if (window.location.pathname.split('/')[1].startsWith('conversations'))
    document.getElementById('main').style.top = '50px';

  document.getElementById("wrapper").prepend(topBarCourses);

  for (let courseId of courseIds) {
    let course = courses[courseId];
    console.log('Adding tab', courseId);
    let courseElement = document.createElement("a");
    courseElement.classList.add('tabs-course');
    if (window.location.pathname.split('/')[2] === course.id)
      courseElement.classList.add('selected');

    courseElement.href = "/courses/" + course.id;
    courseElement.innerText = course.name;

    topBarCourses.append(courseElement);
  }

  /*
  Need to inject the hamburger dropdown
   */
  let $dropdown = $(`<div class="tabs-dropdown">
            <a href="/courses">All Courses</a>
            <a href="#" class="settings">Settings</a>
        </div>`);
  // add hidden classes
  for (let hiddenCourseId of state.hiddenCourseIds) {
    let course = courses[hiddenCourseId];
    $dropdown.prepend(`
        <a href="/courses/${course.id}">${course.name}</a>
        `)
  }

  let $dropdownButton = $(`<div class="tabs-course tabs-dropdown-button">☰</div>`);

  $dropdownButton.on('click', () => {
    $dropdown.toggleClass('active');
  });

  $dropdown.find('.settings').on('click', () =>
    chrome.runtime.sendMessage({action: "OPTIONS"}));

  $dropdown.click(() => $dropdown.removeClass('active'));

  topBarCourses.append($dropdownButton[0]);
  topBarCourses.append($dropdown[0]);
}

function tabsInit() {
  if (!sessionStorage.getItem('courses')) {
    getTabs();
  } else if (state.settings.tabsEnabled) {
    createTabs();
  } else
    settingsButton();
}