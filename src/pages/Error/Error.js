import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { error500, AdminLogo, footerError } from '../../../config/constants/picsLibrary';
import Button, { buttonThemes } from 'components/Button';
import { actions as uiActions } from 'reducers/ui';
import Card from 'components/Card';
import './Error.scss';

class Error extends Component {
  constructor(props) {
    super(...props);
    props.setHeaderVisibility(false);
  }

  componentWillUnmount = () => {
    this.props.setHeaderVisibility(true);
  }

  render() {
    return (
      <div className="NotFound">
        <div className="infoContainer">
          <Card border={false}>
            <div className="errorAndLogo">
              <div className="errorCode">
                <img src={error500} alt="error500" />
              </div>
              <div className="logo">
                <img src={AdminLogo} alt="logo" />
              </div>      
            </div>
            <div className="infoText">
              <p>Ha ocurrido un error en el servidor</p>
              <div className="button_container">
                <Link to="/">
                  <Button
                    theme={buttonThemes.ADPANEL}
                    type={buttonThemes.SOLID}
                    label="Volver"
                    operation=""
                  />
                </Link>
                <a href="mailto:josemaria@imei.media" target="_blank">
                  <Button
                    theme={buttonThemes.ADPANEL}
                    type={buttonThemes.SOLID}
                    label="Contacto"
                    operation=""
                  />
                </a>

              </div>
            </div>
            <div className="errorFooter" style={{backgroundImage: `url(${footerError})`}}>
            </div>
          </Card>
        </div>
      </div>
      )
  }
}

const mapDispatchToProps = dispatch => ({
  setHeaderVisibility: flag => dispatch(uiActions.setHeaderVisibility(flag)),
})

export default connect(null, mapDispatchToProps)(Error);
