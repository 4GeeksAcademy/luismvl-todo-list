import React, { useState } from 'react'
import styles from '../../styles/TodosList.module.css'
import TodoItem from './TodoItem.jsx'

import { updateTodos } from '../utils'

const TodosList = ({ todos, user, loadTodos, deleteUser }) => {
  const [newTodoText, setNewTodoText] = useState('')

  const addTodo = (e) => {
    if (!user) return
    if (e.key === 'Enter' && e.target !== '') {
      const newTodo = { label: newTodoText.trim(), done: false }
      updateTodos(user, [...todos, newTodo]).then(() => {
        setNewTodoText('')
        loadTodos()
      })
    }
  }

  const removeTodo = (id) => {
    if (todos.length === 1) {
      const answer = confirm(
        'This action will delete the user if there are no todos. Are you sure you want to continue?'
      )
      if (answer) deleteUser()
    } else
      updateTodos(
        user,
        todos.filter((todo) => todo.id !== id)
      ).then(() => loadTodos())
  }

  const toggleDone = (id) => {
    updateTodos(
      user,
      todos.map((todo) => {
        if (todo.id === id) todo.done = !todo.done
        return todo
      })
    ).then(() => loadTodos())
  }

  const handleInputChange = (e) => {
    setNewTodoText(e.target.value)
  }

  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type='text'
        placeholder='add todo'
        onKeyDown={addTodo}
        onChange={handleInputChange}
        value={newTodoText}
      />
      <ul>
        {todos.length === 0 && (
          <li className={styles.empty}>No tasks, add a task</li>
        )}
        {todos.length > 0 &&
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              text={todo.label}
              done={todo.done}
              id={todo.id}
              removeTodo={removeTodo}
              toggleDone={toggleDone}
            />
          ))}
      </ul>
      <span className={styles.count}>{todos.length} items left</span>
    </div>
  )
}

export default TodosList
