import React from 'react';
import PropTypes from 'prop-types';
import TextInput from './component/TextInput';

const NewPost = props => (
  <div>
    <form
      onSubmit={e => {
        e.preventDefault();
        props.newPostAction.submit();
      }}
    >
      <TextInput
        label="Title"
        name="title"
        value={props.newPost.title}
        onChange={props.newPostAction.updateTitle}
        errors={props.newPost.titleError}
      />
      <div>
        <label>
          <span>Post</span>
          <textarea
            name="post"
            value={props.newPost.post}
            onChange={e => props.newPostAction.updatePost(e.target.value)}
          />
        </label>
        <div>
          {props.newPost.postError.map(error => <div key={error}>{error}</div>)}
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={
            props.newPost.saving ||
            props.newPost.titleError.length > 0 ||
            props.newPost.postError.length > 0
          }
        >
          {props.newPost.saving ? 'Saving...' : 'Publish'}
        </button>
      </div>
      {props.newPost.error && (
        <div>
          <p>{props.newPost.error}</p>
        </div>
      )}
    </form>
  </div>
);
NewPost.propTypes = {
  newPost: PropTypes.shape({
    title: PropTypes.string.isRequired,
    titleError: PropTypes.arrayOf(PropTypes.string).isRequired,
    post: PropTypes.string.isRequired,
    postError: PropTypes.arrayOf(PropTypes.string).isRequired,
    saving: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
  newPostAction: PropTypes.shape({
    submit: PropTypes.func.isRequired,
    updateTitle: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
  }).isRequired,
};
export default NewPost;
