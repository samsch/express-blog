import React from 'react';
import PropTypes from 'prop-types';
import Button from '../component/Button';
import styles from './dropdownOpener.scss';

class DropdownOpener extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
    };
  }
  render () {
    return (
      <div>
        <div className={styles.buttonRow}>
          <Button
            className="btn-outline-secondary"
            onClick={() => this.setState(state => ({ open: !state.open }))}
          >
            {this.state.open ? 'Close' : 'Register'}
          </Button>
        </div>
        <div>
          {this.state.open ? this.props.children : null}
        </div>
      </div>
    );
  }
}
DropdownOpener.propTypes = {
  children: PropTypes.node.isRequired,
};
export default DropdownOpener;
