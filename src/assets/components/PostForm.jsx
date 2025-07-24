import React, { useState, useEffect } from 'react';
import styles from '../css/PostForm.module.css';

function PostForm(props) {
  const [title, setTitle] = useState(props.title || ''); 
  const [body, setBody] = useState(props.body || '');

  useEffect(() => {
    setTitle(props.title || '');
    setBody(props.body || '');
  }, [props.title, props.body]);

  function handleCancle() {
    props.setForm(false);
  }
  
  function handleEdit() {
    props.handleSubmit(title, body);
  }
  return (
    <div className={props.formType === "Add" && styles.form}>
      <p className={styles.x} onClick={handleCancle}>✖️</p>
      <input
        className={styles.input}
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={handleEdit}>{props.formType}</button>
    </div>
  );
}

export default PostForm;