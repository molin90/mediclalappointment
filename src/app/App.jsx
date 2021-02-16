import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import ErrorBoundary from './ErrorBoundary';
import RenderApp from './RenderApp';
import store, { history } from './store';
import '../commonStyles/uxux.scss';
import '../commonStyles/fonts.scss';

/**
 * App component.
 * @returns {object} App rendered.
 */
window.getSize = () => ({
  h: window.innerHeight,
  w: window.innerWidth,
});
/* init value */
window.size = window.getSize();
/* calculate and store */
window.saveSize = () => {
  const currentSize = window.getSize();
  if (!(window.size) || (window.size.w !== currentSize.w)) {
    window.size = currentSize;
    return true;
  }
  return false;
}


const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ErrorBoundary history={history}>
          <RenderApp />
        </ErrorBoundary>
      </ConnectedRouter>
    </Provider>
  )
};

export default App;
