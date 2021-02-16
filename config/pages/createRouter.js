import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { pageList, getPage } from './index';
import Page from './Page';
import URL_LIBRARY from './urlLibrary.json';

const createRouter = () => {
  if (!pageList) {
    return null;
  }

  return (
    <Switch>
      {URL_LIBRARY.map((pageData) => {
        const { loader: pageKey } = pageData;
        const component = getPage(pageKey);
        if (pageData) {
          const {
            pathName,
            exact,
            redirection,
            onlyDev,
            seoReqData,
          } = pageData;

          let allowToShow = true;
          if (onlyDev) {
            const { NODE_ENV } = process.env;
            allowToShow = NODE_ENV === 'development';
          }
          if (allowToShow) {
            if (component && !redirection) {
              return (
                <Route
                  exact={exact}
                  key={`route${pathName}`}
                  path={`${pathName}`}
                  render={(props) => {
                    const ComponentPage = component;
                    return (
                      <Page
                        key={`${props.location.key}`}
                        ComponentPage={<ComponentPage {...props} />}
                        seoReqData={seoReqData}
                        {...props}
                      />
                    )
                  }}
                />
              )
            }
            if (redirection) {
              return <Route key={`redirect${pathName}`} exact={exact} path={`${pathName}`} render={() => (<Redirect to={redirection} />)} />
            }
          }
        }

        return null;
      })}
    </Switch>
  )
}


export default createRouter;
