import Head from 'next/head'
import { ToDoList } from 'components/ToDoList'
import { useAuth } from 'contexts/AuthProvider'
import { Button, CircularProgress, Grid } from '@mui/material'
import { Suspense } from 'react'
import { apiPath, insertTask } from 'utils/api'
import { useTaskForm } from 'hooks/taskFormHook'
import { useAlert } from 'hooks/alertHook'
import { Task } from '@prisma/client'
import { LibraryAdd } from '@mui/icons-material'
import { mutate } from 'swr'
import { authAtom } from 'atoms/atoms'
import { useAtom } from 'jotai'
import { loginWithGoogle } from 'utils/firebase'

const Index = () => {
  const [currentUser] = useAtom(authAtom)
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
      <Head>
        <title>ToDoApp</title>
      </Head>
      {currentUser ? (
        <>
          <h1>ToDo List</h1>
          <Grid container justifyContent="flex-end">
            <Button variant="contained" onClick={insert} startIcon={<LibraryAdd />}>
              Add
            </Button>
          </Grid>
          <hr />
          <Suspense fallback={<CircularProgress color="inherit" />}>
            <ToDoList></ToDoList>
          </Suspense>
        </>
      ) : (
        <>
          <h1>Login</h1>
          <Button variant="contained" onClick={async () => await loginWithGoogle()}>
            Login with google
          </Button>
        </>
      )}
      {renderTaskForm()}
      {renderAlertDialog()}
    </>
  )
}

export default Index
