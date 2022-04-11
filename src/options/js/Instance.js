import React from 'react';
import {Card, Col, Row, Switch, Typography} from "antd";
import Course from "./Course";

const Instance = ({
                      instance, updateInstance = () => {
    }
                  }) => {
    const toggleSetting = key => {
        let cpy = {...instance};
        cpy.settings[key] = !cpy.settings[key];
        updateInstance(cpy);
    }

    const updateCourse = course => {
        let cpy = {...instance}
        cpy.courses[course.id] = course;
        updateInstance(cpy);
    }

    const swapCourse = (i1, i2) => {
        let cpy = {...instance};

        let temp = cpy.courseIds[i1];
        cpy.courseIds[i1] = cpy.courseIds[i2];
        cpy.courseIds[i2] = temp;

        updateInstance(cpy);
    }

    const toggleVisibility = (courseId, visible) => {
        let cpy = {...instance};

        if (visible) {
            cpy.courseIds.splice(cpy.courseIds.indexOf(courseId), 1);
            cpy.hiddenCourseIds.push(courseId);
        } else {
            cpy.hiddenCourseIds.splice(cpy.hiddenCourseIds.indexOf(courseId), 1);
            cpy.courseIds.push(courseId);
        }

        updateInstance(cpy);
    }

    return (
        <>
            <Row>
                <Typography.Title level={3}>
                    Features
                </Typography.Title>
            </Row>
            <Row gutter={[8, 8]} style={{marginBottom: 8}}>
                <Col flex={'320px'}>
                    <Card style={{height: '100%'}} title={"Tabs"} size={"small"} extra={
                        <Switch checked={instance.settings.tabsEnabled} onClick={() => toggleSetting('tabsEnabled')}/>
                    }>
                        Tabs appear at the top of your Canvas screen and allow for quick navigation between course
                        pages.
                    </Card>
                </Col>

                <Col flex={'320px'}>
                    <Card style={{height: '100%'}} title={"Custom Links"} size={"small"}>
                        Custom links appear at each course page and allow you to add a link that appears on each page
                        (on
                        the top right hand corner). Putting in a Zoom link that is the same everytime is particularly
                        useful
                        and saves you extra clicks to wherever it is usually posted!
                    </Card>
                </Col>

                <Col flex={'320px'}>
                    <Card style={{height: '100%'}} title={"Dashboard Grades"} size={"small"} extra={
                        <Switch checked={instance.settings.gradesEnabled}
                                onClick={() => toggleSetting('gradesEnabled')}/>
                    }>
                        Puts a table on the dashboard that shows your grades! Stay up to date ;)
                    </Card>
                </Col>

                <Col flex={'320px'}>
                    <Card style={{height: '100%'}} title={"Dashboard Upcoming Assignments"} size={"small"} extra={
                        <Switch checked={instance.settings.upcomingAssignmentsEnabled}
                                onClick={() => toggleSetting('upcomingAssignmentsEnabled')}/>
                    }>
                        Puts a table on the dashboard that shows your upcoming assignments! Stay up to date ;)
                    </Card>
                </Col>
            </Row>
            <Row style={{marginBottom: 8}}>
                <Col xs={24}>
                    <Typography.Title level={3}>
                        Courses
                    </Typography.Title>
                    The order of courses listed here is the same as the order of courses in the
                    tabs!
                </Col>
            </Row>

            {instance.courseIds.map((courseId, index) => (
                <Row>
                    <Col xs={24}>
                        <Course course={instance.courses[courseId]} key={courseId} updateCourse={updateCourse}
                                swapCourse={swapCourse}
                                toggleVisibility={() => toggleVisibility(courseId, true)}
                                visible={true}
                                index={index} highestIndex={instance.courseIds.length - 1}/>
                    </Col>
                </Row>
            ))}

            <Row>
                <Col xs={24}>
                    <Typography.Title level={5}>
                        Hidden Courses
                    </Typography.Title>
                    The order of courses listed here is the same as the order of courses in the
                    tabs!
                </Col>
            </Row>

            {instance.hiddenCourseIds.map((courseId, index) => (
                <Row>
                    <Col xs={24}>
                        <Course course={instance.courses[courseId]} key={courseId} updateCourse={updateCourse}
                                swapCourse={swapCourse}
                                toggleVisibility={() => toggleVisibility(courseId, false)}
                                visible={false}
                                index={index} highestIndex={instance.courseIds.length - 1}/>
                    </Col>
                </Row>
            ))}
        </>
    );
}

export default Instance;