import { useState } from 'react'
import { Task } from '@prisma/client'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Cancel, Check, Delete, Edit } from '@mui/icons-material'

type Props = {
  task: Task
  setStatusText: (text: string | undefined) => void
  mutate: () => void
}

export const ToDoItem = (props: Props) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isStatusOk, setIsStatusOk] = useState(true)
  const [alertDialogText, setAlertDialogText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)

  const handleOpenFormDialog = (task: Task) => {
    setIsOpenForm(true)
    setIsStatusOk(true)
    setTitle(task.title)
    setContent(task.content)
    props.setStatusText(undefined)
  }

  const handleCloseFormDialog = () => {
    setIsOpenForm(false)
  }

  const handleUpdate = async (task: Task) => {
    setIsLoading(true)
    if (title === '' || content === '') {
      setIsStatusOk(false)
      setAlertDialogText('Input is invalid.')
      setIsLoading(false)
      return
    }
    if (title === task.title && content === task.content) {
      setIsStatusOk(false)
      setAlertDialogText('Not edited.')
      setIsLoading(false)
      return
    }
    const param: Partial<Task> = {
      uuid: task.uuid,
      title: title,
      content: content
    }
    try {
      const res = await fetch('/api/task', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        setIsStatusOk(true)
        setIsOpenForm(false)
        props.setStatusText('Update completed.')
        props.mutate()
      } else {
        setIsStatusOk(false)
        setAlertDialogText('Failed.')
      }
    } catch (err) {
      setIsStatusOk(false)
      setAlertDialogText('Failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenConfirmDialog = (task: Task) => {
    setIsOpenConfirm(true)
    setIsStatusOk(true)
    setTitle(task.title)
    setContent(task.content)
    props.setStatusText(undefined)
  }

  const handleCloseConfirmDialog = () => {
    setIsOpenConfirm(false)
  }

  const handleDelete = async (uuid: string) => {
    try {
      const param: Partial<Task> = {
        uuid: uuid
      }
      const res = await fetch('/api/task', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        setIsStatusOk(true)
        props.setStatusText('Delete completed.')
        props.mutate()
      } else {
        setIsStatusOk(false)
        setAlertDialogText('Failed.')
      }
    } catch (err) {
      setIsStatusOk(false)
      setAlertDialogText('Failed.')
    }
  }

  return (
    <>
      <h3>{props.task.title}</h3>
      <div>{props.task.content}</div>

      <Button
        sx={{ mr: 1 }}
        variant="contained"
        onClick={() => {
          handleOpenFormDialog(props.task)
        }}
        startIcon={<Edit />}
      >
        Edit
      </Button>
      <Dialog open={isOpenForm} onClose={handleCloseFormDialog}>
        <DialogTitle>Update ToDo</DialogTitle>
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
            defaultValue={title}
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
            defaultValue={content}
            onChange={(e) => {
              setContent(e.currentTarget.value)
            }}
          />
          {!isStatusOk && <Alert severity="error">{alertDialogText}</Alert>}
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="contained"
            onClick={async () => {
              await handleUpdate(props.task)
            }}
            startIcon={<Check />}
            loading={isLoading}
          >
            Update
          </LoadingButton>
          <Button variant="outlined" onClick={handleCloseFormDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        onClick={() => {
          handleOpenConfirmDialog(props.task)
        }}
        startIcon={<Delete />}
      >
        Delete
      </Button>
      <Dialog open={isOpenConfirm} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete this?</DialogContentText>
          {!isStatusOk && <Alert severity="error">{alertDialogText}</Alert>}
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="contained"
            onClick={async () => {
              await handleDelete(props.task.uuid)
            }}
            startIcon={<Delete />}
            loading={isLoading}
          >
            Delete
          </LoadingButton>
          <Button variant="outlined" onClick={handleCloseConfirmDialog} startIcon={<Cancel />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <hr />
    </>
  )
}
