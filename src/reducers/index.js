import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import UIReducers from './ui';

const rootReducers = history => combineReducers({
  ui: UIReducers,
  router: connectRouter(history),
});

export default rootReducers;
