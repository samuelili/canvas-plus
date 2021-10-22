import ReactDOM from "react-dom";
import React from "react";
import Extension from "../inject";

import '../css/tabs.css';

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
    instance: Extension.INSTANCE
  }, newState => {
    Extension.state = newState;
    createTabs();
  })
}

const Tabs = ({courses, courseIds}) => {
  return (
    <>
      {courseIds.map(courseId => {
        const course = courses[courseId];
        return (
          <a href={`/courses/${course.id}`} key={course.id}
             className={"tabs-course " + (window.location.pathname.split('/')[2] === course.id ? "selected" : " ")}>
            {course.name}
          </a>
        );
      })}
      <div className="tabs-course tabs-dropdown-button">☰</div>
      <div className="tabs-dropdown">
        <a href="/courses">All Courses</a>
        <a href="#" className="settings">Settings</a>
      </div>
    </>
  );
}

function createTabs() {
  let courseIds = Extension.state.courseIds;
  let courses = Extension.state.courses;

  console.log('Creating tabs with', courseIds, courses);
  document.body.classList.add('tabs-enabled');
  let topBarCourses = document.createElement("div");
  topBarCourses.id = "tabs-courses";
  // need to shift page down if in conversations
  if (window.location.pathname.split('/')[1].startsWith('conversations'))
    document.getElementById('main').style.top = '50px';

  document.getElementById("wrapper").prepend(topBarCourses);
  ReactDOM.render(
    <Tabs courses={courses} courseIds={courseIds}/>,
    topBarCourses
  );
}

export default function tabsInit() {
  if (!sessionStorage.getItem('courses')) {
    getTabs();
  } else if (Extension.state.settings.tabsEnabled) {
    createTabs();
  }
  // } else
  //   settingsButton();
}