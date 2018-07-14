import React from 'react';
// import PropTypes from 'prop-types';
import { Machine } from 'xstate';
import { Link } from 'react-router-dom';
import { post } from '../shared/http';
import If from '../component/If';
import Button from '../component/Button';

const newPostPageMachine = Machine({
  key: 'newPostPage',
  initial: 'editing',
  states: {
    editing: {
      on: {
        SAVING: 'saving',
        NEW_POST: 'editing',
      },
    },
    saving: {
      on: {
        SUCCESS: 'saved',
        FAILURE: 'editing',
      },
    },
    saved: {
      on: {
        NEW_POST: 'editing',
      },
    },
  }
});

function saving () {
  return function (state) {
    return {
      state: newPostPageMachine.transition(state.state, 'SAVING'),
      error: false,
    };
  };
}

function saveError (error) {
  return function (state) {
    return {
      state: newPostPageMachine.transition(state.state, 'FAILURE'),
      error,
    };
  };
}

function saveSuccess (data) {
  return function (state) {
    return {
      state: newPostPageMachine.transition(state.state, 'SUCCESS'),
      saved: data,
    };
  };
}

function newPost () {
  return function (state) {
    return {
      state: newPostPageMachine.transition(state.state, 'NEW_POST'),
      error: false,
      content: '',
      title: '',
      imgUrl: '',
      imgAlt: '',
    };
  };
}

function formFieldRow (label, id, value, onChange, text = false) {
  const Element = text ? 'textarea' : 'input';
  return (
    <div className="form-group row">
      <label htmlFor={id} className="col-4 col-form-label">{label}</label>
      <div className="col-8">
        <Element
          value={value}
          onChange={onChange}
          id={id}
          type="text"
          className="form-control"
        />
      </div>
    </div>
  );
}

class NewPost extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      state: newPostPageMachine.initialState,
      error: false,
      content: '',
      title: '',
      imgUrl: '',
      imgAlt: '',
      saved: false,
    };
    this.onContentChange = e => { this.setState({ content: e.target.value }); };
    this.onTitleChange = e => { this.setState({ title: e.target.value }); };
    this.onImgUrlChange = e => { this.setState({ imgUrl: e.target.value }); };
    this.onImgAltChange = e => { this.setState({ imgAlt: e.target.value }); };
    this.onSubmit = e => {
      e.preventDefault();
      this.setState(saving());
      post('/api/post', {
        post: {
          title: this.state.title,
          post: this.state.content,
        },
      })
        .then(({ res, data }) => {
          if (res.ok) {
            this.setState(saveSuccess(data));
          } else {
            const { error } = data;
            this.setState(saveError(
              error || 'Something went wrong! Save a copy of your post somewhere else, refresh and try again.'
            ));
          }
        })
        .catch(() => {
          this.setState(saveError(
            'Not able to connect, check your network and try again.'
          ));
        });
    };
    this.startNewPost = () => {
      this.setState(newPost());
    };
  }
  renderForm (status) {
    return (
      <form onSubmit={this.onSubmit} className="container">
        {formFieldRow('Title', 'new-post-title', this.state.title, this.onTitleChange)}
        {formFieldRow('Post', 'new-post-content', this.state.content, this.onContentChange, true)}
        {/* {formFieldRow('Image URL', 'new-post-img-url', this.state.imgUrl, this.onImgUrlChange)}
        {formFieldRow('Image Alt Text', 'new-post-img-alt', this.state.imgAlt, this.onImgAltChange)} */}
        <div className="row justify-content-end">
          <div className="col-md-auto">
            <Button
              type="submit"
              className="btn-primary"
              disabled={status !== 'editing'}
            >
              {status !== 'editing' ? '...saving...' : 'Publish'}
            </Button>
          </div>
        </div>
        <If true={this.state.error}>
          <div className="row">
            <p className="col alert alert-danger">{this.state.error}</p>
          </div>
        </If>
      </form>
    );
  }
  renderSaved () {
    return (
      <div className="jumbotron">
        <h1 className="display-4 alert alert-success">Published!</h1>
        <p className="lead">
          Your new post <i>{this.state.title}</i> is now published! What do you want to do next?
        </p>
        <hr className="my-4" />
        <Link to={`/Post/${this.state.saved.id}`} className="btn btn-success">
          View {this.state.title}
        </Link>
        {' '}
        <Link to="/Posts" className="btn btn-secondary">Go to Posts</Link>
        {' '}
        <Button onClick={this.startNewPost} className="btn-primary">Write New Post</Button>
      </div>
    );
  }
  render () {
    const state = this.state.state.value;
    return (
      <div>
        <h2>New Blog Post</h2>
        <If
          match={{
            'editing': () => this.renderForm(state),
            'saving': () => this.renderForm(state),
            'saved': () => this.renderSaved(state),
          }}
          on={state}
        />
      </div>
    );
  }
}
// NewPost.propTypes = {};
export default NewPost;
