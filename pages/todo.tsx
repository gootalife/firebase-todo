import Head from 'next/head'
import { ToDoList } from 'components/ToDoList'
import { Button, CircularProgress, Grid } from '@mui/material'
import { Suspense } from 'react'
import { apiPath, insertTask } from 'utils/api'
import { useTaskForm } from 'hooks/taskFormHook'
import { useAlert } from 'hooks/alertHook'
import { Task } from '@prisma/client'
import { LibraryAdd } from '@mui/icons-material'
import { mutate } from 'swr'
import { useAuth } from 'hooks/authHook'
import { GetServerSideProps } from 'next'
import { firebaseAdmin } from 'utils/firebaseAdmin'
import { path } from 'utils/path'

const ToDo = () => {
  const user = useAuth()
  const [openTaskForm, renderTaskForm] = useTaskForm()
  const [openAlertDialog, renderAlertDialog] = useAlert()

  const insert = async () => {
    const task = await openTaskForm('TaskForm', 'Input items', undefined)
    if (!task || !user) {
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
      const res = await insertTask(param, user)
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
      <h1>ToDo List</h1>
      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={insert} startIcon={<LibraryAdd />}>
          Add
        </Button>
      </Grid>
      <Suspense fallback={<CircularProgress color="inherit" />}>
        <ToDoList></ToDoList>
      </Suspense>
      {renderTaskForm()}
      {renderAlertDialog()}
    </>
  )
}

export default ToDo

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const accessToken = req.cookies['accessToken']
  try {
    await firebaseAdmin.auth().verifyIdToken(accessToken)
    return { props: {} }
  } catch {
    return {
      redirect: {
        destination: path.home,
        permanent: false
      }
    }
  }
}
