import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Home.scss';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="Home">
        <div className="container firstModule">
          <p>hola</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mainInfo: state.ui.mainInfo,
})

export default connect(mapStateToProps, null)(Home);
