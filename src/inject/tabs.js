async function initialTabs() {
  document.body.classList.add('tabs-enabled');
  let topBarCourses = document.createElement("div");
  topBarCourses.id = "tabs-courses";

  // need to shift page down if in conversations
  if (window.location.pathname.split('/')[1].startsWith('conversations'))
    document.getElementById('main').style.top = '50px';

  document.getElementById("wrapper").prepend(topBarCourses);

  function addElements(courses) {
    sessionStorage.setItem('courses', JSON.stringify(courses));

    for (let course of courses) {
      let courseElement = document.createElement("a");
      courseElement.classList.add('tabs-course');
      if (window.location.pathname.split('/')[2] === course.id)
        courseElement.classList.add('selected');

      courseElement.href = "/courses/" + course.id;
      courseElement.innerText = course.name;

      topBarCourses.append(courseElement);
    }
  }

  if (sessionStorage.getItem('courses') === null) {
    let courses = await fetch('/api/v1/users/self/favorites/courses?include[]=term&exclude[]=enrollment', {
      headers: CANVAS_HEADERS
    });
    courses = await courses.json();

    // update chrome storage
    chrome.runtime.sendMessage({
      action: "SET_COURSES",
      courses,
      instance: INSTANCE
    })
    addElements(courses);
  } else {
    addElements(JSON.parse(sessionStorage.getItem('courses')));
  }
}

chrome.runtime.sendMessage({
  action: 'GET_SETTING',
  instance: INSTANCE,
  key: 'tabsEnabled'
}, enabled => {
  if (enabled) initialTabs();
});