import ReactDOM from 'react-dom';
import './header.scss';

const headerRoot = document.getElementById('header-root');

const Header = ({ children }) => {
  return ReactDOM.createPortal(children, headerRoot);
}

export default Header;
