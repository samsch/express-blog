import React from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from '../shared/http';
import If from '../component/If';
import styles from './posts.scss';

class Posts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      error: false,
    };
  }
  componentDidMount () {

    get('/api/posts')
      .then(({ res, data }) => {
        if (res.ok) {
          this.setState({ posts: data.posts, loading: false });
        } else {
          this.setState({
            error: 'Error loading Posts. Please refresh to try again.',
            loading: false,
          });
        }
      })
      .catch(e => {
        console.log(e); // eslint-disable-line no-console
        this.setState({
          error: 'Check your connection...',
          loading: false,
        });
      });
  }
  render () {
    return (
      <div>
        {(() => {
          if (this.state.loading) {
            return 'Loading...';
          }
          if (this.state.error) {
            return this.state.error;
          }
          return this.state.posts.map(post => (
            <div key={post.id} className={classNames('card', styles.card)}>
              {post.imgUrl}
              <If true={post.imgUrl}>
                {() => (
                  <img className="card-img-top" src={post.imgUrl} alt={post.imgAlt} />
                )}
              </If>
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.post}</p>
              </div>
            </div>
          ));
        })()}
      </div>
    );
  }
}
// Posts.propTypes = {};
export default Posts;
