async function upcomingAssignments(container) {
  var dashboardAssignments = document.createElement("div");
  dashboardAssignments.id = "upcoming-assignments-container";
  dashboardAssignments.innerHTML = "<h1>Upcoming Assignments</h1>"
  var upcomingAssignments = document.createElement("table");
  upcomingAssignments.id = 'upcoming-assignments'
  upcomingAssignments.innerHTML = "Loading...";
  dashboardAssignments.append(upcomingAssignments);
  container.prepend(dashboardAssignments);

  var courses = await fetch('/api/v1/users/self/favorites/courses?include[]=term&exclude[]=enrollment', {
    headers: CANVAS_HEADERS
  });
  courses = await courses.json();
  var upcoming = [];

  var count = 0;

  function ready() {
    // sort upcoming
    upcoming.sort((a, b) => {
      return a.dueDate.unix() - b.dueDate.unix()
    })

    upcomingAssignments.innerHTML = '<tr><th>Name</th><th>Course</th><th>Due Date</th></tr>';
    for (var assignment of upcoming) {
      var row = document.createElement('tr');
      row.innerHTML += `<td><a href="${assignment.htmlUrl}">${assignment.name}</a></td>`
      row.innerHTML += `<td><div>${assignment.courseName}</div></td>`
      row.innerHTML += `<td><div>${assignment.dueDate.format('MMM DD')}</div></td>`
      upcomingAssignments.append(row);
    }
  }

  for (var course of courses) {
    (() => {
      var courseName = course.name.slice(0);
      fetch('/api/v1/courses/' + course.id + '/assignments?bucket=future', {
        headers: CANVAS_HEADERS
      }).then(function (response) {
        return response.json();
      }).then(function (assignments) {
        // parse the assignments
        for (var assignment of assignments) {
          if (!assignment.due_at) continue;
          // var dueDate = Date.parse(assignment.due_at);
          var dueDate = moment(assignment.due_at);
          if (dueDate.isBefore(moment().add(7, 'days'))) // 7 days from now
            upcoming.push({
              id: assignment.id,
              name: assignment.name,
              htmlUrl: assignment.html_url,
              courseName: courseName,
              dueDate: dueDate,
            })
        }

        count++;
        if (count === courses.length)
          ready();
      });
    })();
  }
}

function initializeDashboard(container) {
  var dashboardGrades = document.createElement("div");
  dashboardGrades.id = "dashboard-grades";

  container.prepend(dashboardGrades);

  function placeButton() {
    dashboardGrades.innerHTML = "<h1 id='grades-title'>Grades</h1>" + '<a href="/grades" class="Button button-sidebar-wide">View Grades</a>';
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
        chrome.storage.sync.get({
          gradesEnabled: true
        }, function (items) {
          if (items.gradesEnabled)
            dashboardGrades.innerHTML = "<h1 id='grades-title'>Grades</h1>" + match[0] + dashboardGrades.innerHTML;
        });
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

      function addTags() {
        var cards = document.getElementsByClassName("ic-DashboardCard");
        for (var card of cards) {
          var value = courses[card.getAttribute('aria-label')];
          var gradeTag = document.createElement('div');
          gradeTag.classList.add('grade-tag');
          gradeTag.innerHTML = value
          card.append(gradeTag);
          console.log(card.getAttribute('aria-label'), value);
        }
      }

      chrome.storage.sync.get({
        gradeTagsEnabled: true
      }, function (items) {
        if (items.gradeTagsEnabled) addTags()
      });
    }).catch(placeButton)
}

if (window.location.pathname === "/") {
  var dashboardAddons = document.createElement("div");
  dashboardAddons.id = "dashboard-addons";

  document.getElementById("content").prepend(dashboardAddons);
  upcomingAssignments(dashboardAddons);
  initializeDashboard(dashboardAddons);
}