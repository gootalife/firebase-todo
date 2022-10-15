import { Task } from '@prisma/client'
import useSWR from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { useAuth } from 'contexts/AuthProvider'
import { apiPath } from 'utils/api'

export const ToDoList = () => {
  const { currentUser } = useAuth()
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
      {tasks && (
        <>
          {tasks.map((task) => (
            <ToDoItem key={task.id} task={task}></ToDoItem>
          ))}
        </>
      )}
    </>
  )
}
