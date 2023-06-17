import React, { useEffect, useState } from 'react'

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

  const loadTodos = async (useCurrentUser = true, forceCreateUSer = false) => {
    if (!currentUser || !inputUser) return
    setIsLoading(true)
    try {
      const todos = await getTodos(useCurrentUser ? currentUser : inputUser)
      setTodos(
        todos
          .map((todo) => ({ ...todo, id: uuidv4() })) // Agrega un ID para que sea más fácil manipular los todos
          .toSorted((todo1, todo2) => {
            if (todo1.done && !todo2.done) return 1 // todo1 va antes que todo2
            if (!todo1.done && todo2.done) return -1 // todo2 va antes que todo1
            return 0 // no se realiza ningún cambio en la posición de los elementos
          })
      )
    } catch (error) {
      // Si el usuario no existe, preguntar si desea crearlo
      // si es sí, se crea el usuario y luego se obtienen las tareas pendientes de ese usuario
      // si es no, resetea el input al valor anterior
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

  const handleLoad = (e) => {
    e.preventDefault()
    loadTodos(false)
      .then(() => setCurrentUser(inputUser))
      .finally(() => setIsLoading(false))
  }

  const deleteCurrentUser = () => {
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
          <form onSubmit={handleLoad} action=''>
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
                onClick={handleLoad}
              >
                load
              </button>
              <button
                type='button'
                className={`${styles.button} ${styles.danger}`}
                onClick={deleteCurrentUser}
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
          deleteCurrentUser={deleteCurrentUser}
        />
      }
    </div>
  )
}

export default Home
