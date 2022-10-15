import { Task } from '@prisma/client'
import useSWR from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { apiPath } from 'utils/api'
import { useAuth } from 'hooks/authHook'

const isArray = <T,>(maybeArray: T | readonly T[]): maybeArray is T[] => {
  return Array.isArray(maybeArray)
}

export const ToDoList = () => {
  const currentUser = useAuth()
  const fetcher = async (url: string) => {
    const token = await currentUser?.getIdToken(true)
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    return res.json()
  }
  const { data: tasks } = useSWR<Task[]>(apiPath.task, fetcher, { suspense: true })

  return (
    <>
      {tasks && isArray<Task>(tasks) && (
        <>
          {tasks?.map((task) => (
            <ToDoItem key={task.id} task={task}></ToDoItem>
          ))}
        </>
      )}
    </>
  )
}
