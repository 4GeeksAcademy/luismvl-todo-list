import React, { useState } from 'react'
import styles from '../../styles/TodosList.module.css'
import TodoItem from './TodoItem.jsx'

const TodosList = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = (e) => {
    const trimmedTodo = newTodo.trim()
    if (e.key === 'Enter' && trimmedTodo !== '') {
      setTodos([...todos, trimmedTodo])
      setNewTodo('')
    }
  }

  const removeTodo = (index) => {
    return () => {
      setTodos(todos.filter((todo, i) => i !== index))
    }
  }

  const handleInputChange = (e) => {
    setNewTodo(e.target.value)
  }

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type='text'
        placeholder='add todo'
        onKeyDown={addTodo}
        onChange={handleInputChange}
        value={newTodo}
      />
      <ul>
        {todos.length !== 0 &&
          todos.map((todo, index) => (
            <TodoItem key={index} text={todo} todoRemover={removeTodo(index)} />
          ))}
        {todos.length === 0 && (
          <li className={styles.empty}>No tasks, add a task</li>
        )}
      </ul>
      <span className={styles.count}>{todos.length} items left</span>
    </div>
  )
}

export default TodosList
