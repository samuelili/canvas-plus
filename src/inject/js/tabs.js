import ReactDOM from "react-dom";
import React, {useEffect, useState} from "react";

import '../css/tabs.css';
import classnames from "classnames";
import Extension, {ExtensionWrapper} from "./Extension";

async function fetchTabs() {
    let courses = await fetch('/api/v1/users/self/favorites/courses?include[]=total_scores', {
        headers: CANVAS_HEADERS
    });
    courses = await courses.json();

    chrome.runtime.sendMessage({
        action: "SET_COURSES",
        courses,
        instance: Extension.INSTANCE_NAME
    }, instance => {
        Extension.instance = instance;
        Extension.update();
    });
}

const Tabs = ({instance}) => {
    const {courses, courseIds} = instance;
    // const [courses, setCourses] = useState(instance);
    // const [courseIds, setCourseIds] = useState([]);
    const [active, setActive] = useState(false);

    useEffect(fetchTabs, []);

    return (
        <>
            {courseIds.map(courseId => {
                const course = courses[courseId];
                return (
                    <a href={`/courses/${course.id}`} key={course.id}
                       className={"tabs-course " + (window.location.pathname.split('/')[2] === course.id ? "selected" : " ")}>
                        {course.displayName}
                    </a>
                );
            })}
            <div className="tabs-course tabs-dropdown-button" onClick={() => setActive(!active)}>☰</div>
            <div className={classnames({
                "tabs-dropdown": true,
                "active": active
            })}>
                <a href="/courses">All Courses</a>
                <a href={'#'} className="settings"
                   onClick={() => chrome.runtime.sendMessage({action: "OPTIONS"})}>Settings</a>
            </div>
        </>
    );
}

export default function tabsInit() {
    document.body.classList.add('tabs-enabled');
    let topBarCourses = document.createElement("div");
    topBarCourses.id = "tabs-courses";

    // need to shift page down if in conversations
    if (window.location.pathname.split('/')[1].startsWith('conversations'))
        document.getElementById('main').style.top = '50px';

    document.getElementById("wrapper").prepend(topBarCourses);
    ReactDOM.render(
        <ExtensionWrapper>
            <Tabs/>
        </ExtensionWrapper>,
        topBarCourses
    );
    //   settingsButton();
}