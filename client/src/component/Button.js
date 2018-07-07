import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = props => (
  <button
    type="button"
    {...props}
    className={classNames('btn', props.className)}
  />
);
Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit']),
  className: PropTypes.string,
};
export default Button;
