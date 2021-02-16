import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { actions as uiActions } from 'reducers/ui';
import ScrollMemory from 'react-router-scroll-memory';
import CreateRouter from '../../config/pages/createRouter';

export const NO_PUBLIC_PLACES = [
  '/admin',
  '/404',
  '/500',
  '/403',
]

class RenderApp extends Component {

  componentDidMount = () => {
    const { getMainInfo, mainInfo } = this.props;
    if (!mainInfo || !mainInfo.data) {
      getMainInfo();
    }
  }

  checkIfPublicSection = (location) => {
    const { pathname } = location;
    let res = true;

    NO_PUBLIC_PLACES.forEach((noPublicPage) => {
      const check = pathname.indexOf(noPublicPage) > -1;
      if (check) {
        res = false;
      }
    })

    return res;
  }

  render() {
    const { mainInfo, location } = this.props;
    // const publicPlace = this.checkIfPublicSection(location);
    return (
      <Fragment>
        <ScrollMemory />
        {CreateRouter()}
      </Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  getMainInfo: () => dispatch(uiActions.getMainInfo()),
})

const mapStateToProps = state => ({
  mainInfo: state.ui.mainInfo,
  location: state.router.location,
})

export default connect(mapStateToProps, mapDispatchToProps)(RenderApp);
