/* Dependencies */
import Loadable from 'react-loadable';
import Loading from './Loading/Loading';
// MODULES_APPEND_INDEX_ON_IMPORTS
/* This files links all pages components "entry points" of a project */

export const modules = [
  /* web */
  { id: 'Home', loader: () => import('../../src/pages/Home') },
  /* panel */
  { id: 'NotFound', loader: () => import('../../src/pages/NotFound/NotFound') },
  { id: 'NotAllow', loader: () => import('../../src/pages/NotAllow/NotAllow') },
  { id: 'Error', loader: () => import('../../src/pages/Error/Error') },
  // MODULES_APPEND_INDEX_ON_MODULES
]

export const pageList = modules.map(item => item.id);

export const getPage = (key) => {
  const currentModule = modules.find(item => item.id === key);
  if (currentModule) {
    return Loadable({
      loader: currentModule.loader,
      loading: Loading,
    });
  }
  if (!currentModule) {
    const notFoundModule = modules.find(item => item.id === 'NotFound');
    return Loadable({
      loader: notFoundModule.loader,
      loading: Loading,
    });
  }
  return null;
}
