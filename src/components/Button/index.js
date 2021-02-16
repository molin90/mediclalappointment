/* eslint-disable react/button-has-type */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import ReactHtmlParser from 'react-html-parser';
import './Button.scss';

export const buttonThemes = {
  ADPANEL: 'Panel',
  GREY1: 'GREY1',
  WHITE: 'White',
}

export const buttonTypes = {
  SOFT: 'Soft',
  SOLID: 'Solid',
  TRANSPARENT: 'Transparent',
}

export const buttonOperation = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
}

const Button = ({
  type,
  theme,
  label,
  disable,
  onClick,
  wrapperClass,
  operation,
  infoOp,
  buttonType,
}) => {
  const handleclick = () => {
    if (onClick) {
      onClick()
    }
  }
  const wrapperClassFinal = wrapperClass ? ` ${wrapperClass}` : '';
  const operationWorking = operation && operation !== 'loading' ? ' operation' : ' loading';
  const disableButton = disable || operation ? ' disable' : '';

  return (
    <Fragment>
      <button
        onClick={handleclick}
        type={buttonType}
        className={`button type${type} theme${theme}${disableButton}${wrapperClassFinal}${operationWorking}`}>
        {operation === 'loading' && (
          <Loader
            type="TailSpin"
            color={(theme === 'Solid') ? 'white' : '#989a9e'}
            height={30}
            width={30}
          />
        )}
        {operation === 'success' && (
          <svg className={`svganimation ${operation}`} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
          </svg>
        )}
        {operation === 'error' && (
          <svg className={`svganimation ${operation}`} version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle className="path circle" fill="none" stroke="#D06079" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
            <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
            <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
          </svg>
        )}

        {operation === 'success' && (<span className="label success">{label}</span>)}
        {operation === 'error' && (<span className="label error">{label}</span>)}
        {operation !== 'success' && operation !== 'error' && operation !== 'loading' && (<span className="label">{label}</span>)}
      </button>
      {infoOp && (<p className={`infoOp ${operation}`}>{ReactHtmlParser(infoOp)}</p>)}
    </Fragment>

  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  theme: PropTypes.string,
  wrapperClass: PropTypes.string,
  operation: PropTypes.string,
  infoOp: PropTypes.string,
  onClick: PropTypes.func,
  buttonType: PropTypes.string,
};

Button.defaultProps = {
  type: buttonTypes.SOLID,
  theme: buttonThemes.GREY1,
  buttonType: 'submit',
  wrapperClass: '',
  operation: '',
  infoOp: '',
  onClick: null,
}

export default Button;
