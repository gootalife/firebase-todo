import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Task } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { Close, LibraryAdd, Save } from '@mui/icons-material'
import { AlertDialog } from './AlertDialog'
import { useAuth } from './AuthProvider'

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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { data: tasks, error, mutate } = useSWR<Task[]>('/api/task/', fetcher)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertText, setAlertText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenForm = () => {
    setTitle('')
    setContent('')
    setIsFormOpen(true)
    setIsAlertOpen(false)
    setAlertTitle('')
    setAlertText('')
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setTitle('')
    setContent('')
  }

  const handleSave = async () => {
    setIsLoading(true)
    if (title === '' || content === '') {
      setIsAlertOpen(true)
      setAlertTitle('Error')
      setAlertText('Input is invalid.')
      setIsLoading(false)
      return
    }
    const param: Partial<Task> = {
      title: title,
      content: content
    }
    try {
      const token = (await currentUser?.getIdTokenResult(true))?.token
      const res = await fetch('/api/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        setAlertTitle('Completed')
        setAlertText('Save completed.')
        setIsAlertOpen(true)
        setIsFormOpen(false)
        mutate(tasks)
      } else {
        setAlertTitle('Error')
        setAlertText('Failed.')
        setIsAlertOpen(true)
      }
    } catch (err) {
      setAlertTitle('Error')
      setAlertText('Failed.')
      setIsAlertOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AlertDialog
        isOpen={isAlertOpen}
        title={<>{alertTitle}</>}
        text={<>{alertText}</>}
        onClose={() => {
          setIsAlertOpen(false)
          setAlertTitle('')
          setAlertText('')
        }}
      />

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
          {tasks && tasks.length > 0 && (
            <>
              {tasks.map((task) => (
                <ToDoItem
                  key={task.id}
                  task={task}
                  mutate={() => {
                    mutate(tasks)
                  }}
                  setIsAlertOpen={setIsAlertOpen}
                  setAlertTitle={setAlertTitle}
                  setAlertText={setAlertText}
                ></ToDoItem>
              ))}
            </>
          )}
        </>
      )}
      <Dialog open={isFormOpen} onClose={handleOpenForm}>
        <DialogTitle>New ToDo</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the items.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            required
            focused
            onChange={(e) => {
              setTitle(e.currentTarget.value)
            }}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            required
            focused
            multiline
            rows={4}
            onChange={(e) => {
              setContent(e.currentTarget.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={async () => {
              await handleSave()
            }}
            variant="contained"
            loading={isLoading}
            startIcon={<Save />}
          >
            Save
          </LoadingButton>
          <Button onClick={handleCloseForm} variant="outlined" startIcon={<Close />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
