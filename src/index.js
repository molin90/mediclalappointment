import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';

const mainSetup = require('../config/mainSetup');

ReactDOM.render(
  <App />,
  document.getElementById(mainSetup.projectId),
);

// Check if hot reloading is enable. If it is, changes won't reload the page.
// This is related to webpack-dev-server and works on development only.
if (module.hot) {
  module.hot.accept();
}

try {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const type = connection.effectiveType;
  let timeout = 10000;
  switch (type) {
    case 'slow-2g': timeout = -1; break;
    case '2g': timeout = -1; break;
    case '4g': timeout = 5000; break;
    case '3g': timeout = 15000; break;
    default: timeout = 10000; break;
  }

  if (timeout) {
    setTimeout(() => {
      require('offline-plugin/runtime').install(); // eslint-disable-line global-require
    }, timeout)
  }
} catch (err) {
  console.log(`err:  ${err}`)
}
