async function initialTabs() {
  document.body.classList.add('tabs-enabled');
  let topBarCourses = document.createElement("div");
  topBarCourses.id = "tabs-courses";

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
    let updated = {};
    let courseIds = [];
    for (let course of courses) {
      courseIds.push(course.id)
      updated[course.id] = {
        name: course.name,
        custom: ""
      }
    }
    updated.courseIds = courseIds;

    chrome.storage.sync.set(updated, function () {
      console.log('Set courses in extension storage');
    });
    addElements(courses);
  } else {
    addElements(JSON.parse(sessionStorage.getItem('courses')));
  }
}

chrome.storage.sync.get({
  tabsEnabled: true
}, items => {
  if (items.tabsEnabled) initialTabs();
});