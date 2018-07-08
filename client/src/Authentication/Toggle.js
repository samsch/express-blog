import React from 'react';
import PropTypes from 'prop-types';

class Toggle extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: this.props.defaultOpen || false,
    };
    this.toggle = () => { this.setState(state => ({ open: !state.open })); };
    this.open = () => { this.setState({ open: true }); };
    this.close = () => { this.setState({ open: false }); };
    this.methods = {
      toggle: this.toggle,
      open: this.open,
      close: this.close,
    };
  }
  render () {
    return this.props.children(this.state.open, this.methods);
  }
}
Toggle.propTypes = {
  children: PropTypes.func.isRequired,
  defaultOpen: PropTypes.bool,
};
export default Toggle;
