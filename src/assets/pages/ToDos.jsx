import React, { useState, useEffect, useContext } from 'react';
import styles from '../css/Todos.module.css';
import ToDo from '../components/ToDo';
import { UserContext } from '../components/UserContext';

function ToDos({ setInfo }) {
  const { currentUser } = useContext(UserContext);
  const [todos, setTodos] = useState({ allTodos: [], todosOnScreen: [] });
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState('Sequential');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    setInfo(false);
    fetch(`http://localhost:3000/users/${currentUser.id}/todos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        return response.json();
      })
      .then((todos) => {
        setTodos({ allTodos: todos, todosOnScreen: todos });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUser.id, setInfo]);

  useEffect(() => {
    filterTodos();
  }, [filterBy]);

  function filterTodos() {
    let filteredTodos = [...todos.todosOnScreen];
    switch (filterBy) {
      case 'Sequential':
        filteredTodos.sort((a, b) => a.id - b.id);
        break;
      case 'Completed':
        filteredTodos.sort((a, b) => (a.completed === b.completed ? 0 : !a.completed ? 1 : -1));
        break;
      case 'Alphabetical':
        filteredTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Random':
        for (let i = filteredTodos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filteredTodos[i], filteredTodos[j]] = [filteredTodos[j], filteredTodos[i]];
        }
        break;
      default:
        break;
    }
    setTodos((prev) => ({ ...prev, todosOnScreen: filteredTodos }));
  }

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }

  function searchTodos() {
    if (searchInput.trim() === '') {
      fetch(`http://localhost:3000/users/${currentUser.id}/todos`)
        .then((response) => response.json())
        .then((todos) => {
          setTodos({ allTodos: todos, todosOnScreen: todos });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const searchTerm = searchInput.toLowerCase().trim();
      const status = searchInput === 'completed' ? true : searchInput === 'not completed' ? false : null;
      const filteredTodos = todos.allTodos.filter(
        (todo) =>
          todo.id.toString().includes(searchTerm) ||
          todo.title.toLowerCase().includes(searchTerm) ||
          todo.completed === status
      );
      setTodos((prev) => ({ ...prev, todosOnScreen: filteredTodos }));
    }
  }

  function showAddTodo() {
    setAdd(true);
  }

  function handleAdd() {
    const newTodoData = {
      title,
      completed: false,
      userId: currentUser.id,
    };
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodoData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Can't create the todo");
        }
        return response.json();
      })
      .then((newTodo) => {
        setTodos((prev) => ({
          allTodos: [...prev.allTodos, newTodo],
          todosOnScreen: [...prev.allTodos, newTodo],
        }));
        setAdd(false);
        setTitle('');
      })
      .finally(() => {
        searchTodos();
        filterTodos();
      })
      .catch((error) => {
        console.error('Error creating todo:', error);
      });
  }

  return (
    <div>
      <div className={styles.addActions}>
        <button className={styles.button} onClick={showAddTodo}>➕</button>
        {add && (
          <div className={styles.add}>
            <button className={styles.button} onClick={() => { setAdd(false); setTitle(''); }}>❌</button>
            <input
              type="text"
              value={title}
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
            <button className={styles.button} onClick={handleAdd}>➕</button>
          </div>
        )}
        <div className={styles.filter}>
          <label htmlFor="filterSelect">Filter By:</label>
          <select id="filterSelect" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
            <option value="Sequential">Sequential</option>
            <option value="Completed">Completed</option>
            <option value="Alphabetical">Alphabetical</option>
            <option value="Random">Random</option>
          </select>
        </div>
      </div>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search by ID, Title or Status"
          value={searchInput}
          onChange={handleSearchInputChange}
          className={styles.input}
        />
        <button className={styles.button} onClick={searchTodos}>🔎</button>
      </div>
      <div className={styles.todosContainer}>
        {todos.allTodos.length === 0 && <p>You have no todos, feel free to create a new todo</p>}
        {todos.todosOnScreen.length === 0 && searchInput.trim() !== '' && (
          <p>No tasks found for your search 🤷‍♂️</p>
        )}
        {todos.todosOnScreen.map((todo) => (
          <ToDo
            key={todo.id}
            currentTodo={todo}
            todos={todos}
            setTodos={setTodos}
            filterTodos={filterTodos}
            searchTodos={searchTodos}
          />
        ))}
      </div>
    </div>
  );
}

export default ToDos;