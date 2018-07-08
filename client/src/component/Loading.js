import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './loading.scss';

class Loading extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      showing: false,
    };
  }
  componentDidMount () {
    this.timeout = setTimeout(() => {
      this.setState({ showing: true });
    }, 250);
  }
  componentWillUnmount () {
    clearTimeout(this.timeout);
  }
  render () {
    if (!this.state.showing) {
      return null;
    }
    const align = this.props.align || 'center';
    const size = this.props.size;
    return (
      <div
        className={classNames(styles.loadingContainer, {
          [styles.alignLeft]: align === 'left',
          [styles.alignRight]: align === 'right',
          [styles.alignCenter]: align === 'center',
        })}
      >
        <div className="sr-only">Loading</div>
        <div
          className={classNames(styles.loading, styles.dark, {
            [styles.sizeSm]: size === 0,
            // Default size, so no class
            [styles.size2x]: size === 2,
            [styles.size3x]: size === 3,
          })}
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}
Loading.propTypes = {
  align: PropTypes.oneOf(['left', 'right', 'center']),
  size: PropTypes.oneOf([0, 1, 2, 3]),
};
export default Loading;
