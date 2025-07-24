import React, { useState, useEffect } from 'react';
import styles from '../css/Post.module.css';
import PostForm from './PostForm';
import Comment from './Comment';
function Post(props) {
  const [pop, setPop] = useState(false);
  const [edit, setEdit] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (pop && commentsVisible) {
      fetch(`http://localhost:3000/posts/${props.currentPost.id}/comments`)
        .then((response) => response.json())
        .then((data) => {
          setComments(data);
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
        });
    }
  }, [pop, commentsVisible, props.currentPost.id]);

  function toggleComments() {
    setCommentsVisible(!commentsVisible);
  }

  function addComment() {
    fetch(`http://localhost:3000/posts/${props.currentPost.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        body: newComment,
        postId: props.currentPost.id,
        name: props.currentUser.name
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments([...comments, data]);
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  }

  function handleClickPop() {
    setPop(true);
  }
  function handleDelete() {
    const postIdToDelete = props.currentPost.id;
    setPop(false);
    fetch(`http://localhost:3000/posts/${postIdToDelete}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const newPostsArray = props.posts.allPosts.filter(obj => obj.id != props.currentPost.id);
          const newPostsOnScreenArray = props.posts.postsOnScreen.filter(obj => obj.id != props.currentPost.id);
          props.setPosts({ allPosts: newPostsArray, postsOnScreen: newPostsOnScreenArray });
        } else {
          throw new Error('Failed to delete the post.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }

  function openEditForm() {
    setEdit(true);
  }
  function handleClosePopPost(event) {
    event.stopPropagation();
    setPop(false);
  }
  function handleEdit(title, body) {
    const updatedPost = {
      userId: props.currentUser.id,
      id: props.currentPost.id,
      title: title,
      body: body
    }
    fetch(`http://localhost:3000/posts/${props.currentPost.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost),
    })
      .then(response => response.json())
      .then(updatedPost => {
        console.log('Updated Post:', updatedPost);
        const newPostsOnScreenArray = props.posts.postsOnScreen.map(obj => {
          if (obj.id === props.currentPost.id) {
            obj.title = updatedPost.title;
            obj.body = updatedPost.body;
          }
          return obj;
        });
        const newPostsArray = props.posts.allPosts.map(obj => {
          if (obj.id == props.currentPost.id) {
            obj.title = updatedPost.title;
            obj.body = updatedPost.body;
          }
          return obj;
        });
        props.setPosts({ allPosts: newPostsArray, postsOnScreen: newPostsOnScreenArray });
      }).finally(() => {
        props.searchPosts();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    setEdit(false);
  }
  function handleDeleteComment(commentIdToDelete) {
    fetch(`http://localhost:3000/comments/${commentIdToDelete}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const newCommentsArray = comments.filter(comment => comment.id !== commentIdToDelete);
          setComments(newCommentsArray);
        } else {
          throw new Error('Failed to delete the comment.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function handleEditComment(commentIdToEdit, updatedCommentBody) {
    const updatedComment = {
      body: updatedCommentBody,
    };

    fetch(`http://localhost:3000/comments/${commentIdToEdit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedComment),
    })
      .then(response => response.json())
      .then(updatedComment => {
        const newCommentsArray = comments.map(comment => {
          if (comment.id === commentIdToEdit) {
            return { ...comment, body: updatedComment.body };
          }
          return comment;
        });
        setComments(newCommentsArray);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return (
    <>
      <div className={!pop ? styles.postContainer : styles.pop} onClick={handleClickPop}>
        <div className={styles.postContent}>
          <div className={styles.postHeader}>
            {pop && <p className={styles.pButton} onClick={handleClosePopPost}>✖️</p>}
            <h1 >Post Id: {props.currentPost.id}</h1>
            <h2 className={styles.title}>Title: {props.currentPost.title}</h2>
            {pop && <p>{props.currentPost.body}</p>}
          </div>
          {pop && props.currentPost.userId === props.currentUser.id && <div className={styles.postActions}>
            <button onClick={handleDelete} className={styles.button}>🗑️</button>
            <button onClick={openEditForm} className={styles.button}>🖊️</button>
          </div>}
        </div>
        {edit && <PostForm setForm={setEdit} formType={'Edit'} handleSubmit={handleEdit} title={props.currentPost.title} body={props.currentPost.body} />}
        {pop && !edit && (
          <div className={styles.commentsSection}>
            <button onClick={toggleComments} className={styles.toggleCommentsButton}>
              {commentsVisible ? 'Hide Comments' : 'Show Comments'}
            </button>
            {commentsVisible && (
              <div>
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    currentUser={props.currentUser}
                    onDelete={handleDeleteComment}
                    onEdit={handleEditComment} />
                ))}
                <div className={styles.addComment}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a new comment..."
                    className={styles.commentInput}
                  />
                  <button onClick={addComment} className={styles.plus}>
                  ➕
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Post;