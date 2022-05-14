import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Task } from '@prisma/client'
import { useState } from 'react'
import useSWR from 'swr'
import { ToDoItem } from 'components/ToDoItem'
import { Cancel, Check, LibraryAdd, Save } from '@mui/icons-material'
import { AlertDialog } from './AlertDialog'
import { ConfirmDialog } from './ConfirmDialog'

const fetcher = (url: string) => fetch(url).then((res) => res.json())
const url = '/api/task'

export const ToDo = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [success, setSuccess] = useState(true)
  const { data: tasks, error, mutate } = useSWR<Task[]>(url, fetcher)
  const [alertDialogText, setAlertDialogText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [statusText, setStatusText] = useState<string | undefined>(undefined)

  const handleOpenDialog = () => {
    setSuccess(true)
    setIsOpen(true)
    setStatusText(undefined)
  }

  const handleCloseDialog = () => {
    setSuccess(true)
    setIsOpen(false)
  }

  const handleSave = async () => {
    setIsLoading(true)
    if (title === '' || content === '') {
      setSuccess(false)
      setAlertDialogText('Input is invalid.')
      setIsLoading(false)
      return
    }
    const param: Partial<Task> = {
      title: title,
      content: content
    }
    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        setStatusText('Save completed.')
        setSuccess(true)
        setIsOpen(false)
        mutate(tasks)
      } else {
        setSuccess(false)
        setAlertDialogText('Input is invalid.')
      }
    } catch (err) {
      setSuccess(false)
      setAlertDialogText('Failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const [isTestOpen, setIsTestOpen] = useState(false)
  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setIsTestOpen(true)
        }}
        startIcon={<Check />}
      >
        Test
      </Button>
      <ConfirmDialog
        isOpen={isTestOpen}
        title={<>title</>}
        text={
          <Alert sx={{ mt: 1 }} severity="success">
            text
          </Alert>
        }
        onClose={() => {
          setIsTestOpen(false)
        }}
        onExecute={() => {
          setIsTestOpen(false)
        }}
      />

      <Grid container justifyContent="flex-end">
        <Button variant="contained" onClick={handleOpenDialog} startIcon={<LibraryAdd />}>
          Add
        </Button>
      </Grid>

      {success && !isOpen && statusText && (
        <Alert sx={{ mt: 1 }} severity="success">
          {statusText}
        </Alert>
      )}
      <hr />
      {(() => {
        if (!tasks && !error) {
          return <CircularProgress color="inherit" />
        } else {
          return (
            <>
              {tasks && (
                <>
                  {tasks.map((task) => (
                    <ToDoItem
                      key={task.uuid}
                      task={task}
                      setStatusText={setStatusText}
                      mutate={() => {
                        mutate(tasks)
                      }}
                    ></ToDoItem>
                  ))}
                </>
              )}
            </>
          )
        }
      })()}
      <Dialog open={isOpen} onClose={handleOpenDialog}>
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
            onChange={(e) => {
              setContent(e.currentTarget.value)
            }}
          />
          {!success && <Alert severity="error">{alertDialogText}</Alert>}
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
          <Button onClick={handleCloseDialog} variant="outlined" startIcon={<Cancel />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
