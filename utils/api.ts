import { Task } from '@prisma/client'
import { User } from 'firebase/auth'

export const apiPath = {
  task: '/api/task'
}

export const fetchTask = async (user: User) => {
  const token = await user.getIdToken(true)
  const res = await fetch(apiPath.task, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })
  const tasks = (await res.json()) as Task[]
  return tasks
}

export const insertTask = async (param: Partial<Task>, user: User) => {
  const token = (await user?.getIdTokenResult(true))?.token
  const res = await fetch(apiPath.task, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(param)
  })
  return res
}

export const updateTask = async (param: Partial<Task>, user: User) => {
  const token = (await user?.getIdTokenResult(true))?.token
  const res = await fetch(apiPath.task, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(param)
  })
  return res
}

export const deleteTask = async (id: string, user: User) => {
  const token = (await user?.getIdTokenResult(true))?.token
  const param: Partial<Task> = {
    id: id
  }
  const res = await fetch(apiPath.task, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(param)
  })
  return res
}
