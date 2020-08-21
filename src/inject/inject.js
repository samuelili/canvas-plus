var CANVAS_HEADERS = {
  accept: "application/json, text/javascript, application/json+canvas-string-idss"
};

function initializeTopBar() {
  var topBarCourses = document.createElement("div");
  topBarCourses.id = "top-bar-courses";

  document.getElementById("wrapper").prepend(topBarCourses);

  function addElements(courses) {
    sessionStorage.setItem('courses', JSON.stringify(courses));

    for (var course of courses) {
      var courseElement = document.createElement("a");
      courseElement.classList.add('top-bar-course');
      if (window.location.pathname.split('/')[2] === course.id)
        courseElement.classList.add('selected');

      courseElement.href = "/courses/" + course.id;
      courseElement.innerText = course.name;

      topBarCourses.append(courseElement);
    }
  }

  if (sessionStorage.getItem('courses') === null) {
    fetch('/api/v1/users/self/favorites/courses?include[]=term&exclude[]=enrollment', {
      headers: CANVAS_HEADERS
    })
      .then(function (response) {
        return response.json();
      })
      .then(addElements);
  } else {
    addElements(JSON.parse(sessionStorage.getItem('courses')));
  }
}

function initializeDashboard() {
  var dashboardAddons = document.createElement("div");
  dashboardAddons.id = "dashboard-addons";

  document.getElementById("content").prepend(dashboardAddons);

  function placeButton() {
    dashboardAddons.innerHTML = "<h1 id='grades-title'>Grades</h1>" + '<a href="/grades" class="Button button-sidebar-wide">View Grades</a>'
  }

  // {grading_period_id:n,enrollment_id:r}
  fetch('/grades')
    .then(function (response) {
      return response.text()
    })
    .then(function (grades) {
      let regex = /(<table)(.*?)(table>)/gs
      let match = grades.match(regex)
      if (match !== null)
        dashboardAddons.innerHTML = "<h1 id='grades-title'>Grades</h1>" + match[0];
      else placeButton();
    }).catch(placeButton)
}

chrome.extension.sendMessage({}, function (response) {
  console.log("Initializing Better Canvas");
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading

      // ----------------------------------------------------------

      // initializeTopBar();
    }
  }, 10);
  initializeTopBar();

  if (window.location.pathname === "/") {
    initializeDashboard();
  }
});

// _.a.ajaxJSON(ENV.grades_for_student_url,"GET",{grading_period_id:n,enrollment_id:r},a=>{let e,n=_()(this).closest("tr").children(".percent")