import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { whichAnimationEvent } from '../../utils/htmlUtils';
import {
  ANIMATION_FLYOUT_IN_1,
  ANIMATION_FLYOUT_OUT_1,
  ANIMATION_FLYOUT_IN_2,
  ANIMATION_FLYOUT_OUT_2,
} from '../../constants/constants';
import { actions as uiActions } from '../../reducers/ui';
import Icon from '../../components/Icon/Icon';
import iconLibrary from '../../constants/iconLibrary';
import './FlyOut.scss';

/* This indicates in which div, modal is going to be placed <div id="modal-root"></div> */
const flyOutRoot = document.getElementById('flyout-root')


/**
 * Statefull component to flyOut
 * @param {string} idFlyOut Identifies this flyOut on setupBasics
 * @param {JSX} children Children rendered.
 * @returns {JSX} Component JSX.
 */
class FlyOut extends Component {
  constructor(props) {
    super(...props);
    const { idFlyOut, idFlyOutVisible } = props;
    this.state = {
      idFlyOut,
      mounted: (idFlyOutVisible && idFlyOutVisible === idFlyOut),
      animation1: ANIMATION_FLYOUT_IN_1,
      animation2: ANIMATION_FLYOUT_IN_2,
      animationListener: null,
    }
  }
  /* For handle animation */
  static getDerivedStateFromProps(props, state) {
    const { idFlyOut, idFlyOutVisible } = props;
    const newMountedValue = (idFlyOutVisible && idFlyOutVisible === idFlyOut);

    if (!newMountedValue) {
      return {
        ...state,
        animation1: ANIMATION_FLYOUT_OUT_1,
        animation2: ANIMATION_FLYOUT_OUT_2,
      }
    }

    return {
      ...state,
      animation1: ANIMATION_FLYOUT_IN_1,
      animation2: ANIMATION_FLYOUT_IN_2,
      mounted: newMountedValue,
    };
  }

  /* Adding animation listener */
  componentDidUpdate = () => {
    const { animationListener, mounted } = this.state;
    if (!animationListener && mounted) {
      document.body.classList.add('modal-open');
      const transitionEvent = whichAnimationEvent();
      const element = document.getElementById('animationReferenceFO');
      if (transitionEvent) {
        element.addEventListener(transitionEvent, () => { this.unMount() });
        this.setState({ animationListener: true })
      }
    }
  }

  setMyVisibility = () => {
    const { idFlyOutVisible, idFlyOut } = this.props;
    if (!idFlyOutVisible) {
      // si es distinto de null apago
      this.props.setFlyOutVisibility(idFlyOut);
    } else if (idFlyOut === idFlyOutVisible) {
      // si tiene algo lo pongo a null y es de mi modal
      this.props.setFlyOutVisibility(null);
    }
  }

  unMount = () => {
    const { animation2, mounted } = this.state;
    if (animation2 === ANIMATION_FLYOUT_OUT_2 && mounted) {
      this.setState({
        mounted: false,
        animationListener: false,
      });
      document.body.classList.remove('modal-open');
    }
  }

  render() {
    const { mounted } = this.state;

    if (mounted) {
      const { animation1, animation2, idFlyOut } = this.state;
      const { kind } = this.props;
      return ReactDOM.createPortal(
        <div idflyout={idFlyOut} className="flyOutContainer">
          <div className={`${animation1}`} onClick={this.setMyVisibility} />
          <section id="animationReferenceFO" className={`flyOut ${kind} ${animation2}`}>
            <Icon
              className="renderXClose"
              classIcon={iconLibrary.close}
              onClick={this.setMyVisibility}
            />
            {this.props.children && <div className="ownContent">{this.props.children}</div>}
          </section>
        </div>,
        flyOutRoot
      )
    }
    return null;
  }
}

FlyOut.propTypes = {
  children: PropTypes.node,
};

FlyOut.defaultProps = {
  children: null,
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFlyOutVisibility: idFlyOut => dispatch(uiActions.setFlyOutVisibility(idFlyOut)),
  }
}

const mapStateToProps = state => ({
  idFlyOutVisible: state.ui.idFlyOutVisible,
})

export default connect(mapStateToProps, mapDispatchToProps)(FlyOut);
