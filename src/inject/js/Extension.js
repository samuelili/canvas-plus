import React, {useEffect, useState} from 'react';

export default class Extension {
    static INSTANCE_NAME;
    static instance;

    static listeners = [];

    static update() {
        for (let listener of Extension.listeners) {
            listener();
        }
    }
}

// attaches the child to instance
export const ExtensionWrapper = ({children}) => {
    const [instance, setInstance] = useState(Extension.instance);

    useEffect(() => {
        Extension.listeners.push(() => {
            setInstance(Extension.instance);
        });
    }, []);

    const childrenWithProps = React.Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {instance});
        }
        return child;
    });

    return <>{childrenWithProps}</>
}