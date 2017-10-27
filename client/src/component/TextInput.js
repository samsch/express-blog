import React from 'react';
import PropTypes from 'prop-types';

const TextInput = props => (
  <div>
    <label>
      <span>{props.label}</span>
      <input
        type={props.type || 'text'}
        name={props.name}
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        {...props.inputProps || {}}
      />
    </label>
    <div>{props.errors.map(error => <div key={error}>{error}</div>)}</div>
  </div>
);
TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string,
  inputProps: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string).isRequired,
};
export default TextInput;
