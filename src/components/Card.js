import React from 'react';

import '../styles/Card.css';

const Card = ({title, children, ...props}) => (
  <div className={"Card"} {...props}>
    <div style={{display: 'flex'}}>
      {title}
    </div>
    <div>
      {children}
    </div>
  </div>
)

export default Card;