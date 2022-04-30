import React from 'react';
import ReactDOM from "react-dom";
import DocPreviewToolbar from "./components/DocPreviewToolbar";
import '../css/doc-preview-tools.css';

const docPreviewToolsInit = () => {
    let docPreviewElement = document.getElementById('doc_preview');

    if (docPreviewElement) {
        let docPreviewToolbar = document.createElement('div');
        docPreviewToolbar.style.marginBottom = '8px';
        docPreviewElement.prepend(docPreviewToolbar);

        ReactDOM.render(<DocPreviewToolbar originalParent={docPreviewElement.parentNode}
                                           originalIndex={[...docPreviewElement.parentNode.children].indexOf(docPreviewElement)}
                                           docPreviewElement={docPreviewElement}/>, docPreviewToolbar);
    }
};

export default docPreviewToolsInit;