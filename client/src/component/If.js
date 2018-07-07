import PropTypes from 'prop-types';

function render (renderable) {
  if (typeof renderable === 'function') {
    return renderable();
  }
  return renderable;
}

const If = props => {
    if(props.true) {
      if (props.children) {
        return render(props.children);
      } if (props.then) {
        return render(props.then);
      }
      throw new Error(
        'If component must be provided with either a "children" or "then" render function or node.'
      );
    }
    if(props.match) {
      const match = props.match[props.on];
      if (match) {
        return render(match);
      }
    }
    if (props.else) {
      return render(props.else);
    }
    return null;
};
If.propTypes = {
  true: PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  then: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  match: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.node, PropTypes.func])),
  on: PropTypes.string,
  else: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};
export default If;
