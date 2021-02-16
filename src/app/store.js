import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory as createHistory } from 'history';
import rootReducers from '../reducers/index';
import rootSaga from '../sagas/index';
import { howAppIsRunning } from '../utils/commonUtils';

const preloadedState = {};

const sagaMiddleware = createSagaMiddleware();
export const history = createHistory();

/* Let us know if we are on development or production */
let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
if (howAppIsRunning() !== 'development') {
  composeEnhancers = compose;
}

const store = createStore(
  rootReducers(history),
  preloadedState,
  composeEnhancers(
    applyMiddleware(
      sagaMiddleware,
      routerMiddleware(history),
    ),
  )
);

sagaMiddleware.run(rootSaga)


export default store;
