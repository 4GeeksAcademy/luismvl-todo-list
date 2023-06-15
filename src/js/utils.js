const baseUrl = 'https://assets.breatheco.de/apis/fake/todos/user/'

export async function getTodos(username) {
  return await makeRequest(baseUrl + username)
}

export async function createUser(username) {
  return await makeRequest(baseUrl + username, 'POST', [])
}

export async function updateTodos(username, todos) {
  return await makeRequest(
    baseUrl + username,
    'PUT',
    todos.map((todo) => {
      delete todo.id
      return todo
    })
  )
}

export async function deleteUser(username) {
  return await makeRequest(baseUrl + username, 'DELETE')
}

async function makeRequest(url, method = 'GET', body = null) {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body && JSON.stringify(body),
    })
    const data = await response.json()
    if (!response.ok) {
      const newError = new Error(data.msg)
      newError.httpStatus = response.status
      throw newError
    }
    return data
  } catch (error) {
    throw error
  }
}
