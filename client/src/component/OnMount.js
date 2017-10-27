import React from 'react';
import PropTypes from 'prop-types';

class OnMount extends React.Component {
  componentDidMount() {
    this.props.onMount(this.props.argument);
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return null;
  }
}
OnMount.propTypes = {
  onMount: PropTypes.func.isRequired,
  argument: PropTypes.any,
};
export default OnMount;
