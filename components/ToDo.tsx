import { Suspense } from 'react'
import { Button, CircularProgress, Grid } from '@mui/material'
import { Task } from '@prisma/client'
import { LibraryAdd } from '@mui/icons-material'
import useSWR, { useSWRConfig } from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { useAuth } from 'contexts/AuthProvider'
import { useTaskForm } from 'hooks/taskFormHook'
import { useAlert } from 'hooks/alertHook'
import { apiPath, insertTask } from 'utils/api'

export const ToDo = () => {
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
  const { mutate } = useSWRConfig()
  const [openTaskForm, renderTaskForm] = useTaskForm()
  const [openAlertDialog, renderAlertDialog] = useAlert()

  const insert = async () => {
    const task = await openTaskForm('TaskForm', 'Input items', undefined)
    if (!task || !currentUser) {
      return
    }
    if (task.title === '' || task.content === '') {
      await openAlertDialog('Error', 'Input is invalid.')
      return
    }
    const param: Partial<Task> = {
      title: task.title,
      content: task.content
    }
    try {
      const res = await insertTask(param, currentUser)
      if (res.ok) {
        await openAlertDialog('Completed', 'Save completed.')
        mutate(apiPath.task)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed.')
    }
  }

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={insert} startIcon={<LibraryAdd />}>
          Add
        </Button>
      </Grid>
      <hr />
      <Suspense
        fallback={
          <>
            <Grid container alignContent="center" justifyContent="center">
              <CircularProgress color="inherit" />
            </Grid>
          </>
        }
      >
        {tasks && (
          <>
            {tasks.map((task) => (
              <ToDoItem key={task.id} task={task}></ToDoItem>
            ))}
          </>
        )}
      </Suspense>
      {renderAlertDialog()}
      {renderTaskForm()}
    </>
  )
}
