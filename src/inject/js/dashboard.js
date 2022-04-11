import React, {useEffect, useState} from 'react';
import ReactDOM from "react-dom";
import moment from "moment";
import Card from "../../components/Card";
import {CANVAS_HEADERS} from "../constants";

import '../css/dashboard.css';
import Extension, {ExtensionWrapper} from "./Extension";

const Grades = ({grades}) => {
    const courseIds = Extension.instance.courseIds;

    return (
        <Card title={"Grades"} id={"dashboard-grades"} style={{marginTop: 16}}>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {Object.keys(grades).length > 0 ? courseIds.map(courseId => (
                    <tr key={courseId}>
                        <td>
                            <a href={`/courses/${courseId}/grades`}>
                                {Extension.instance.courses[courseId].displayName}
                            </a>
                        </td>
                        <td className={"assignments-score"}>
                            <div>{grades[courseId].score === 'N/A' ? 'N/A' : grades[courseId].score + '%'}</div>
                        </td>
                    </tr>
                )) : <></>}
                </tbody>
            </table>
        </Card>
    );
}

const UpcomingAssignments = ({courses}) => {
    const [assignments, setAssignments] = useState([]);

    // TODO rewrite with promise.all
    useEffect(async () => {
        if (courses.length === 0) return; // if courses is still empty, don't run

        let upcoming = [];
        let count = 0;
        for (let course of courses) {
            let courseName = course.name.slice(0);
            fetch('/api/v1/courses/' + course.id + '/assignments?bucket=future', {
                headers: CANVAS_HEADERS
            }).then(function (response) {
                return response.json();
            }).then(function (assignments) {
                // parse the assignments
                for (let assignment of assignments) {
                    if (!assignment.due_at) continue;
                    // let dueDate = Date.parse(assignment.due_at);
                    let dueDate = moment(assignment.due_at);
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
        }

        function ready() {
            // sort upcoming
            upcoming.sort((a, b) => {
                return a.dueDate.unix() - b.dueDate.unix()
            })

            setAssignments(upcoming);
        }
    }, [courses]);

    return (
        <Card title={"Upcoming Assignments"} style={{marginTop: 16}}>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th className={"UpcomingAssignments-course"}>Course</th>
                    <th>Due Date</th>
                </tr>
                </thead>
                <tbody>
                {assignments.map(assignment => (
                    <tr key={assignment.name}>
                        <td><a href={assignment.htmlUrl}>{assignment.name}</a></td>
                        <td className={"UpcomingAssignments-course"}>
                            <div>{assignment.courseName}</div>
                        </td>
                        <td>
                            <div>{assignment.dueDate.format('MMM DD')}</div>
                        </td>
                        <td className="assignments-checkbox">
                            <div><input type="checkbox"/></div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Card>
    );
}

export const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [grades, setGrades] = useState({});
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // also insert spacer
        let tabSpacer = document.createElement("div");
        tabSpacer.style = "height: 54px";

        document.getElementById("dashboard_header_container").prepend(tabSpacer);

        // also remove padding from #content
        document.getElementById("content").style.paddingTop = "0";
    }, []);

    useEffect(async () => {
        let courses = await fetch('/api/v1/users/self/favorites/courses?include[]=term&include[]=current_grading_period_scores&include[]=total_scores&exclude[]=enrollment', {
            headers: CANVAS_HEADERS
        });
        courses = await courses.json();

        let grades = {};

        courses.forEach((course) => {
            let enrollment = course.enrollments[0];
            if (enrollment.type === "student") {
                if (enrollment.current_period_computed_current_score || enrollment.computed_current_score)
                    grades[course.id] = {
                        score: enrollment.current_period_computed_current_score || enrollment.computed_current_score,
                        name: course.name
                    };
                else {
                    grades[course.id] = {
                        score: "N/A",
                        name: course.name
                    }
                }
            }
        });
        // updated courses in state
        // chrome.runtime.sendMessage({
        //     action: "SET_COURSES",
        //     courses: courses,
        //     instance: Extension.INSTANCE_NAME
        // }, () => {
        //     console.log('Set courses');
        // })

        setCourses(courses);
        setGrades(grades);
    }, []);

    return (
        <>
            {visible ? <>
                <Grades grades={grades}/>
                <UpcomingAssignments courses={courses}/></> : <></>}
            <button type={"button"} className={"btn"} style={{height: 38, marginTop: 16}} onClick={() => setVisible(!visible)}>{visible ? "Hide" : "Show"}</button>
        </>
    )
}

export function dashboardInit() {
    if (window.location.pathname === "/") {
        let dashboardAddons = document.createElement("div");
        dashboardAddons.id = "dashboard-addons";

        document.getElementById("dashboard_header_container").prepend(dashboardAddons);
        ReactDOM.render(
            <ExtensionWrapper>
                <Dashboard/>
            </ExtensionWrapper>,
            dashboardAddons
        );
    }
}