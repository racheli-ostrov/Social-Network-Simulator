import React, { useState } from 'react';
import styles from '../css/ToDo.module.css';

const ToDo = (props) => {
  const [isChecked, setChecked] = useState(props.currentTodo.completed);
  const [edit, setEdit] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(props.currentTodo.title);

  const getCurrentUserId = () => {
    const user = localStorage.getItem('currentUser');
    return user;
  };

  const handleCheckboxChange = () => {
    const updatedTodo = {
      userId: getCurrentUserId(),
      id: props.currentTodo.id,
      title: props.currentTodo.title,
      completed: !isChecked,
    };

    fetch(`http://localhost:3000/todos/${props.currentTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        const newTodosOnScreenArray = props.todos.todosOnScreen.map((obj) => {
          if (obj.id === props.currentTodo.id) {
            obj.completed = updatedTodo.completed;
          }
          return obj;
        });
        const newTodosArray = props.todos.allTodos.map((obj) => {
          if (obj.id === props.currentTodo.id) {
            obj.completed = updatedTodo.completed;
          }
          return obj;
        });
        props.setTodos({ allTodos: newTodosArray, todosOnScreen: newTodosOnScreenArray });
        setChecked(!isChecked);
      })
      .finally(() => {
        props.filterTodos();
        props.searchTodos();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEdit = () => {
    const updatedTodo = {
      userId: getCurrentUserId(),
      id: props.currentTodo.id,
      title: updatedTitle,
      completed: isChecked,
    };

    fetch(`http://localhost:3000/todos/${props.currentTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then((response) => response.json())
      .then((updatedTodo) => {
        const newTodosOnScreenArray = props.todos.todosOnScreen.map((obj) => {
          if (obj.id === props.currentTodo.id) {
            obj.title = updatedTodo.title;
          }
          return obj;
        });
        const newTodosArray = props.todos.allTodos.map((obj) => {
          if (obj.id === props.currentTodo.id) {
            obj.title = updatedTodo.title;
          }
          return obj;
        });
        props.setTodos({ allTodos: newTodosArray, todosOnScreen: newTodosOnScreenArray });
      })
      .finally(() => {
        props.searchTodos();
        props.filterTodos();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setEdit(false);
  };

  const handleEditForm = () => {
    setEdit(!edit);
  };

  const handleDelete = () => {
    const todoIdToDelete = props.currentTodo.id;

    fetch(`http://localhost:3000/todos/${todoIdToDelete}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          const newTodosArray = props.todos.allTodos.filter((obj) => obj.id !== props.currentTodo.id);
          const newTodosOnScreenArray = props.todos.todosOnScreen.filter((obj) => obj.id !== props.currentTodo.id);
          props.setTodos({ allTodos: newTodosArray, todosOnScreen: newTodosOnScreenArray });
        } else {
          throw new Error('Failed to delete the post.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className={styles.toDosContainer}>
      <div className={styles.todoContent}>
        <p>ID: {props.currentTodo.id}</p>
        <h2>{props.currentTodo.title}</h2>
        <div className="completed-container">
          <label>
            Completed:
            <input
              type="checkbox"
              checked={props.currentTodo.completed}
              onChange={handleCheckboxChange}
              className={styles.input}
            />
          </label>
        </div>
        <div className={styles.todoActions}>
          {!edit && <button onClick={handleDelete} className={styles.todoButton}>🗑️</button>}
          <button
            onClick={handleEditForm}
            className={edit ? styles.todoButtonCancel : styles.todoButton}
          >
            {edit ? '❌' : '🖊️'}
          </button>
          {edit && <button onClick={handleEdit} className={styles.edit}>✔</button>}
        </div>
        {edit && (
          <div className={styles.editContainer}>
            <div className={styles.edititlebtn}>
              <label>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className={styles.input}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToDo;