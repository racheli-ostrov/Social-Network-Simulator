import React from 'react';
import styles from '../css/Comment.module.css';

function Comment({ comment, currentUser, onDelete, onEdit }) {
  const isCurrentUserComment = comment.name === currentUser.name;

  const handleDelete = () => {
    onDelete(comment.id);
  };

  const handleEdit = () => {
    const updatedCommentBody = prompt('Edit your comment:', comment.body);
    if (updatedCommentBody !== null) {
      onEdit(comment.id, updatedCommentBody);
    }
  };

  return (
    <div className={styles.comment}>
      <p>{comment.body}</p>
      <p className={styles.commentBy}>Comment by: {comment.name}</p>
      
      {isCurrentUserComment && (
        <div className={styles.commentActions}>
          <button onClick={handleEdit} className={styles.editButton}>
          🖊️
          </button>
          <button onClick={handleDelete} className={styles.deleteButton}>
          🗑️
          </button>
        </div>
      )}
    </div>
  );
}

export default Comment;