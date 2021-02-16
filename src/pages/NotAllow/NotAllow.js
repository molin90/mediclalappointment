import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { error403, AdminLogo, footerError } from '../../../config/constants/picsLibrary';
import Button, { buttonThemes } from 'components/Button';
import Card from 'components/Card';
import { actions as uiActions } from 'reducers/ui';
import './NotAllow.scss';

class NotAllow extends Component {
  constructor(props) {
    super(...props);
    props.setHeaderVisibility(false);
  }

  componentWillUnmount = () => {
    this.props.setHeaderVisibility(true);
  }

  render() {
    return (
      <div className="NotAllow">
        <div className="infoContainer">
          <Card border={false}>
            <div className="errorAndLogo">
              <div className="errorCode">
                <img src={error403} alt="error403" />
              </div>
              <div className="logo">
                <img src={AdminLogo} alt="logo" />
              </div>      
            </div>
            <div className="infoText">
              <p>Usted no está autorizado para tener acceso a este contenido, o no ha ingresado sus credenciales correctamente. Si desea más información, por favor contacte con su webmaster.</p>
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

export default connect(null, mapDispatchToProps)(NotAllow);
