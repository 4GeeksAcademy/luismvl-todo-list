import React from 'react'
import styles from '../../styles/Home.module.css'
import TodosList from './TodosList.jsx'

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>todos</h1>
      <TodosList />
    </div>
  )
}

export default Home
