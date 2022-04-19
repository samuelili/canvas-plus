import React from 'react';
import {Button, Card, Col, List, Row, Switch, Typography} from "antd";
import Course from "./Course";
import {DeleteOutlined} from "@ant-design/icons";

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

    const removeHiddenAssignment = i => {
        let cpy = {...instance};
        cpy.hiddenAssignments.splice(i, 1);

        updateInstance(cpy);
    }

    return (
        <>
            <Row>
                <Typography.Title level={2}>
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
                    <Typography.Title level={2}>
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
                    <Typography.Title level={4}>
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

            {instance.hiddenCourseIds.length === 0 ?
                <Card style={{width: 300, textAlign: "center", margin: "16px 0"}}>
                    You have no hidden courses! :)
                </Card> : <></>}

            <Row style={{marginBottom: 8}}>
                <Col xs={24}>
                    <Typography.Title level={2}>
                        Hidden Assignments
                    </Typography.Title>
                    Unhide assignments here
                </Col>
            </Row>

            {instance.hiddenAssignments.length !== 0 ?
                <List>
                    {instance.hiddenAssignments.map((assignment, i) => (
                        <List.Item style={{display: 'flex'}} extra={<Button icon={<DeleteOutlined/>} type={"danger"} onClick={() => removeHiddenAssignment(i)}/>}>
                            {assignment.name}
                        </List.Item>
                    ))}
                </List> : <Card style={{width: 300, textAlign: "center", margin: "16px 0"}}>
                    You have no hidden assignments! :)
                </Card>}
        </>
    );
}

export default Instance;