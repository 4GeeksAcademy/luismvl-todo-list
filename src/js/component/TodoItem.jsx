import React from 'react'
import styles from '../../styles/TodoItem.module.css'

const TodoItem = ({ text, todoRemover }) => {
  return (
    <li className={styles.todoItem}>
      <span>{text}</span>
      <button className={styles.deleteBtn} onClick={todoRemover}>
        X
      </button>
    </li>
  )
}

export default TodoItem
