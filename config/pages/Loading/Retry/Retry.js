import React from 'react';
import PropTypes from 'prop-types';
import NotFound from '../../../../src/pages/NotFound/NotFound';
// import ReactHtmlParser from 'react-html-parser';

const Retry = ({ onClick }) => {
  return (
    <NotFound />
  )
}

Retry.propTypes = {
  onClick: PropTypes.func,
}

Retry.defaultProps = {
  onClick: null,
}


export default Retry;
