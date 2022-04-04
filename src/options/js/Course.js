import React, {useState} from 'react';
import {Button, Card, Form, Input, List, Typography} from "antd";
import {
    CaretDownOutlined,
    CaretUpOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeOutlined,
    PlusOutlined
} from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";

const Course = ({course, updateCourse, index, highestIndex, swapCourse, visible, toggleVisibility}) => {
    const [customLinkModalVisible, setCustomLinkModalVisible] = useState(false);

    return (
        <Card title={<>
            <Typography.Text editable={{
                icon: <EditOutlined/>,
                tooltip: 'Click to edit custom name',
                onChange: s => updateCourse({...course, displayName: s}),
            }}>{course.displayName}</Typography.Text>
            {course.displayName !== course.name ? (<>
                <br/>
                <Typography.Text style={{fontSize: 12}} type={"secondary"}>{course.name}</Typography.Text>
            </>) : <></>}
        </>} style={{marginBottom: 8}} extra={<>
            {index !== 0 ?
                <Button size={"small"} icon={<CaretUpOutlined/>} shape={"circle"}
                        onClick={() => swapCourse(index, index - 1)} style={{marginRight: 4}}/> : <></>}
            {index !== highestIndex ?
                <Button size={"small"} icon={<CaretDownOutlined/>} shape={"circle"}
                        onClick={() => swapCourse(index, index + 1)} style={{marginRight: 4}}/> : <></>}
            <Button size={"small"} icon={visible ? <EyeOutlined/> : <EyeInvisibleOutlined/>} shape={"circle"}
                    onClick={toggleVisibility}/>
        </>}>
            <List header={"Custom Links"}
                  footer={<Button type="primary" size="small" icon={<PlusOutlined/>}
                                  onClick={() => setCustomLinkModalVisible(true)}>New</Button>}>
                {Object.keys(course.customLinks).map((customLinkName) => (
                    <List.Item key={customLinkName}>
                        <Typography.Text editable={{
                            icon: <EditOutlined/>,
                            tooltip: 'Click to edit name',
                            onChange: s => {
                                let cpy = {...course};
                                cpy.customLinks[s] = cpy.customLinks[customLinkName];
                                delete cpy.customLinks[customLinkName];

                                updateCourse(cpy);
                            },
                        }}>{customLinkName}</Typography.Text> : <Typography.Text editable={{
                        icon: <EditOutlined/>,
                        tooltip: 'Click to edit link',
                        onChange: s => {
                            let cpy = {...course};
                            cpy.customLinks[customLinkName] = s;

                            updateCourse(cpy);
                        },
                    }}>{course.customLinks[customLinkName]}</Typography.Text>
                    </List.Item>
                ))}
            </List>

            <Modal title={"New Custom Link"} visible={customLinkModalVisible} onOk={() => {
                setCustomLinkModalVisible(false)
            }} onCancel={() => {
                setCustomLinkModalVisible(false)
            }}
                   footer={[
                       <Button onClick={() => setCustomLinkModalVisible(false)}>
                           Cancel
                       </Button>,
                       <Button form={"custom-link-form"} key={"submit"} htmlType={"submit"} type={"primary"}>
                           Ok
                       </Button>
                   ]}>
                <Form
                    name="custom-link-form"
                    onFinish={values => {
                        setCustomLinkModalVisible(false);

                        let cpy = {...course};
                        cpy.customLinks[values.name] = values.link;

                        updateCourse(cpy);
                    }}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{required: true, message: 'Please input a name!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Link"
                        name="link"
                        rules={[{required: true, message: 'Please input a link!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default Course;