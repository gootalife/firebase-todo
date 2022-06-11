import { Button, CircularProgress, Grid } from '@mui/material'
import { Task } from '@prisma/client'
import { LibraryAdd } from '@mui/icons-material'
import useSWR from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { useAuth } from 'contexts/AuthProvider'
import { useTaskForm } from 'hooks/TaskFormHook'
import { apiPath } from 'utils/api'

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
  const { data: tasks, error } = useSWR<Task[]>(apiPath.task, fetcher)

  const [openTaskForm, renderTaskForm] = useTaskForm()

  const handleOpenForm = async () => {
    await openTaskForm('New ToDo', 'Input items.', false, currentUser)
  }

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={handleOpenForm} startIcon={<LibraryAdd />}>
          Add
        </Button>
      </Grid>
      <hr />
      {!tasks && !error ? (
        <Grid container alignContent="center" justifyContent="center">
          <CircularProgress color="inherit" />
        </Grid>
      ) : (
        <>
          {tasks && (
            <>
              {tasks.map((task) => (
                <ToDoItem key={task.id} task={task}></ToDoItem>
              ))}
            </>
          )}
        </>
      )}
      {renderTaskForm()}
    </>
  )
}
