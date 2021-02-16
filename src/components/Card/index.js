import React from 'react';
import './Card.scss';

const Card = ({children, wrapperClass}) => {
  return (
    <div className={`Card${wrapperClass ? ` ${wrapperClass}` : ''}`}>
      {children}
    </div>
  )
}

export default Card;