import React from 'react'

import styles from '../../styles/TodoItem.module.css'

const TodoItem = ({ text, done, id, removeTodo, toggleDone }) => {
  return (
    <li className={`${styles.todoItem} ${done && styles.done}`}>
      <div className={styles.buttons}>
        {!done && (
          <button
            className={`${styles.button} ${styles.doneBtn}`}
            onClick={() => toggleDone(id)}
          >
            <i className='fa-solid fa-check'></i>
          </button>
        )}
        {done && (
          <button
            className={`${styles.button} ${styles.undoneBtn}`}
            onClick={() => toggleDone(id)}
          >
            <i className='fa-solid fa-x'></i>
          </button>
        )}
        <button
          className={`${styles.button} ${styles.removeBtn}`}
          onClick={() => removeTodo(id)}
        >
          <i className='fa-solid fa-trash'></i>
        </button>
      </div>
      <span>{text}</span>
    </li>
  )
}

export default TodoItem
