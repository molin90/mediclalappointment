import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './Modal.scss';

const modalRoot = document.getElementById('modalviewer-root');

class Modal extends Component {
  constructor(props) {
    super(props);
    const { idModal } = props;

    this.state = {
      idModal,
      show:true,
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    const { show } = props;
    if(state.show !== show){
      return {
        ...state,
        show,
      }
    }
    return {
      ...state,
    }
  }

  closeModal = () => {
   if(this.props.onClose) {
     this.props.onClose();
   }
  }

  render() {
    const { children, idModal,title } = this.props;
    const { show } = this.state;
    if (!show) {
      return null;
    }

    return ReactDOM.createPortal(
      <div id={idModal} key={idModal} className="Modal">
        <div className="opacityLayout">
          <div className="modal_body">
            <div className="title">
              {title}
              <div className="close" onClick={this.closeModal}>X</div>
            </div>
            <div className="children">
              {children}
            </div>
          </div>
        </div>
      </div>,
      modalRoot
    )
  }
}

export default Modal;