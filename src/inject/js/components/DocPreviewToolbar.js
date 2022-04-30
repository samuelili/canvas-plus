import React, {useState, useEffect} from 'react';

const DocPreviewToolbar = ({originalParent, originalIndex, docPreviewElement}) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (!expanded) { // hide
            document.body.style.overflow = "initial";
            docPreviewElement.classList.remove('expanded');
            if (originalParent >= originalParent.children.length) {
                originalParent.appendChild(docPreviewElement);
            } else {
                originalParent.insertBefore(docPreviewElement, originalParent.children[originalIndex]);
            }
        } else { // expand
            document.body.style.overflow = "hidden";
            docPreviewElement.classList.add('expanded');
            document.body.appendChild(docPreviewElement);
        }
    }, [expanded]);

    return (<>
        <div className={"btn"} style={{marginRight: 8}} onClick={() => setExpanded(!expanded)}>{expanded ? "Shrink" : "Expand"}</div>
        <div className={"btn"} onClick={() => {
            window.open(docPreviewElement.getElementsByTagName("iframe")[0].src);
        }}>Open in new tab</div>
        </>);
};

export default DocPreviewToolbar;