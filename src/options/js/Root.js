import React, {useEffect, useState} from 'react';

import 'antd/dist/antd.css';
import {Col, Row, Tabs, Typography} from "antd";
import Instance from "./Instance";

const Root = () => {
    const [state, setState] = useState({
        instances: [],
    });

    useEffect(() => {
        document.getElementById('bad-button').remove();

        chrome.runtime.sendMessage({
            action: 'GET'
        }, state => {
            console.log('Got state', state);
            setState(state);
        });
    }, []);

    const updateInstance = (instanceName, instance) => {
        let newState = {...state};
        newState[instanceName] = instance;
        setState(newState)

        chrome.runtime.sendMessage({
            action: 'SET',
            state
        }, () => {
            console.log('Updated Instance');
        })
    }

    return <div style={{width: '80vw', maxWidth: '1024px', margin: '0 auto', padding: '32px 16px 64px'}}>
        <Row>
            <Col flex={"48px"}>
                <img src="/icons/icon128.png" height={48} width={48}/>
            </Col>
            <Col flex={"auto"} style={{paddingLeft: 32}}>
                <Typography.Title>
                    Canvas+ Options
                </Typography.Title>
            </Col>
        </Row>
        <Row>
            <Col flex={"auto"}>
                <Tabs defaultActiveKey={0}>
                    {state.instances.map((instanceName, i) => {
                        return (
                            <Tabs.TabPane tab={instanceName} key={i}>
                                <Instance instance={state[instanceName]} instanceName={{instanceName}}
                                          updateInstance={instance => updateInstance(instanceName, instance)}/>
                            </Tabs.TabPane>
                        );
                    })}
                </Tabs>
            </Col>
        </Row>
    </div>;
}

export default Root;