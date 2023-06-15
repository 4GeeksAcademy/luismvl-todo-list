import React, { useEffect, useState, useTransition } from 'react'

import styles from '../../styles/Home.module.css'
import TodosList from './TodosList.jsx'
import Loader from './Loader.jsx'

import { getTodos, createUser, deleteUser } from '../utils'
import { v4 as uuidv4 } from 'uuid'

const Home = () => {
  const [currentUser, setCurrentUser] = useState('luismvl')
  const [inputUser, setInputUser] = useState('luismvl')
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(true)

  // El parámetro 'current' indica si cargar los todos de currentUser
  const loadTodos = async (useCurrentUser = true, forceCreateUSer = false) => {
    if (!currentUser || !inputUser) return
    setIsLoading(true)
    try {
      const todos = await getTodos(useCurrentUser ? currentUser : inputUser)
      // Agrega un ID para que sea más fácil manipular los todos
      setTodos(
        todos
          .map((todo) => ({ ...todo, id: uuidv4() }))
          .toSorted((todo1, todo2) => {
            if (todo1.done && !todo2.done) return 1 // todo1 va antes que todo2
            if (!todo1.done && todo2.done) return -1 // todo2 va antes que todo1
            return 0 // no se realiza ningún cambio en la posición de los elementos
          })
      )
    } catch (error) {
      // Si el usuario no existe, preguntar si desea crearlo
      // si es sí, se crea el usuario y luego se obtienen las tareas pendientes de ese usuario
      // si es no, resetea el valor de entrada (input) al valor anterior
      if (error.httpStatus === 404) {
        // TODO: Crear componente de notificación (?)
        if (forceCreateUSer) {
          createUser(inputUser).then(() => {
            setCurrentUser(inputUser)
            loadTodos(false)
          })
          return
        }
        const answer = confirm(
          `User "${inputUser}" does not exist. Do you want to create the user?`
        )
        if (answer) {
          createUser(inputUser).then(() => {
            setCurrentUser(inputUser)
            loadTodos(false)
          })
        } else setInputUser(currentUser)
      }
    }
    setIsLoading(false)
  }

  const handleLoadButton = (e) => {
    e.preventDefault()
    loadTodos(false)
      .then(() => setCurrentUser(inputUser))
      .finally(() => setIsLoading(false))
  }

  const handleDeleteUserButton = () => {
    setIsLoading(true)
    deleteUser(currentUser).then(() => {
      setCurrentUser('')
      setInputUser('')
      setTodos([])
      setIsLoading(false)
    })
  }

  useEffect(() => {
    loadTodos(true, true)
  }, [])

  if (isLoading) return <Loader />

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        {showMenu && (
          <form onSubmit={handleLoadButton} action=''>
            <label>
              user:
              <input
                type='text'
                value={inputUser}
                onChange={(e) =>
                  setInputUser(e.target.value.replace(/[^a-zA-Z0-9]/gi, ''))
                }
              />
            </label>
            <div className={styles.actionButtons}>
              <button
                className={styles.button}
                type='submit'
                onClick={handleLoadButton}
              >
                load
              </button>
              <button
                type='button'
                className={`${styles.button} ${styles.danger}`}
                onClick={handleDeleteUserButton}
              >
                delete user
              </button>
            </div>
          </form>
        )}
        <button
          className={`${styles.button} ${styles.toggleMenuBtn}`}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {!showMenu && <i className='fa-solid fa-chevron-right'></i>}
          {showMenu && <i className='fa-solid fa-chevron-left'></i>}
        </button>
      </div>

      <h1>todos</h1>

      {
        <TodosList
          todos={todos}
          user={currentUser}
          loadTodos={loadTodos}
          deleteUser={handleDeleteUserButton}
        />
      }
    </div>
  )
}

export default Home
