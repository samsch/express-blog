import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { get } from '../shared/http';
import If from '../component/If';
import Loading from '../component/Loading';
import styles from './post.scss';

class Post extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      post: false,
      loading: true,
      notFound: false,
      error: '',
    };
  }
  componentDidMount () {
    get(`/api/post/${this.props.match.params.id}`)
      .then(({ res, data }) => {
        if (res.ok) {
          this.setState({
            post: data.post,
            loading: false,
          });
        } else if (res.status === 404) {
          this.setState({
            notFound: true,
            loading: false,
          });
        } else {
          this.setState({
            error: data.error || 'Something went wrong. Refresh the page and try again.',
            loading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          error: 'Not able to connect, check your network and try again.',
          loading: false,
        });
      });
  }
  render () {
    const post = this.state.post;
    return (
      <div className={classNames('container', styles.page)}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Link to="/Posts">Back to Posts</Link>
          </div>
        </div>
        {(() => {
          if (this.state.loading) {
            return <Loading size={3} />;
          }
          if (this.state.notFound) {
            return (
              <div className="alert alert-warning">Post not found</div>
            );
          }
          if (this.state.error) {
            return (
              <div className="alert alert-danger">{this.state.error}</div>
            );
          }
          return (
            <div className="row justify-content-center">
              <div key={post.id} className={classNames('card', 'col-md-8')}>
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
            </div>
          );
        })()}
      </div>
    );
  }
}
Post.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
export default Post;
