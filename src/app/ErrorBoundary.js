import React from 'react';
import { Redirect } from 'react-router-dom';
import Error from '../pages/Error/Error';
/**
  * Stateful component to draw ErrorBoundary
  * @param {string} error
  * @param {string} errorInfo Detailed error info, renders the page.
  * @returns {JSX} Component JSX.
  */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorInfo: null,
      redirect: '',
    };
  }

  componentDidMount = () => {
    const { history } = this.props;
    history.listen((location) => {
      if (this.state.errorInfo) {
        this.setState({ redirect: location.pathname, errorInfo: null });
      } else {
        this.setState({ redirect: '' })
      }
    });
  }

  componentWillUnmount = () => {
    const { history } = this.props;
    if (history) {
      try {
        history.removeEventListener('listen');
      } catch (err) {
        // console.log(`err: ${err}`);
      }
    }
  }

  static getDerivedStateFromError(error) {
    const errorsms = error.toString();
    return {
      errorInfo: errorsms,
    }
  }

  componentDidCatch = () => {
  }

  render() {
    if (this.state.redirect && this.state.errorInfo) {
      this.setState({ redirect: null, errorInfo: null });
      return <Redirect to={this.state.redirect} />
    }

    if (!this.state.errorInfo) {
      /* Error path */
      /* Normally, just render children */
      return this.props.children;
    }
    return (
      <Error />
    )
  }
}


export default ErrorBoundary;
