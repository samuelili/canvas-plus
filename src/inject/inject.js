var CANVAS_HEADERS = {
  accept: "application/json, text/javascript, application/json+canvas-string-idss"
};

function waitForReady(callback) {
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      callback();
    }
  }, 10);
}

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
      .then(function (courses) {
        // update chrome storage
        var updated = {};
        var courseIds = [];
        for (var course of courses) {
          courseIds.push(course.id)
          updated[course.id] = {
            name: course.name,
            custom: ""
          }
        }
        updated.courseIds = courseIds;

        chrome.storage.sync.set(updated, function() {
          console.log('Set courses in extension storage');
        });
        addElements(courses);
      });
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

      var parser = new DOMParser();
      var table = parser.parseFromString(match[0], "text/xml")

      var courseElements = table.getElementsByClassName("course");
      var percentElements = table.getElementsByClassName("percent");

      var courses = {};

      for (var i = 0; i < courseElements.length; i++) {
        courses[courseElements[i].querySelector('a').innerHTML.replace('&amp;', '&')] = percentElements[i].innerHTML.replace(/(\r\n|\n|\r)/gm, "");
      }
      console.log('Got grades', courses);

      var cards = document.getElementsByClassName("ic-DashboardCard");
      for (var card of cards) {
        var value = courses[card.getAttribute('aria-label')];
        var gradeTag = document.createElement('div');
        gradeTag.classList.add('grade-tag');
        gradeTag.innerHTML = value
        card.append(gradeTag);
        console.log(card.getAttribute('aria-label'), value);
      }
    }).catch(placeButton)
}

chrome.extension.sendMessage({}, function (response) {
  console.log("Initializing Better Canvas");
  initializeTopBar();

  if (window.location.pathname === "/") {
    initializeDashboard();
  }
});

// _.a.ajaxJSON(ENV.grades_for_student_url,"GET",{grading_period_id:n,enrollment_id:r},a=>{let e,n=_()(this).closest("tr").children(".percent")