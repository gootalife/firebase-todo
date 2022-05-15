import { useState } from 'react'
import { Task } from '@prisma/client'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { Check, Close, Delete, Edit } from '@mui/icons-material'
import { useAuth } from './AuthProvider'
import { ConfirmDialog } from './ConfirmDialog'

type Props = {
  task: Task
  mutate: () => void
  setIsAlertOpen: (isOpen: boolean) => void
  setAlertTitle: (title: string) => void
  setAlertText: (text: string) => void
}

export const ToDoItem = (props: Props) => {
  const { currentUser } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)

  const handleOpenFormDialog = (task: Task) => {
    setIsOpenForm(true)
    props.setIsAlertOpen(false)
    setTitle(task.title)
    setContent(task.content)
  }

  const handleCloseFormDialog = () => {
    setIsOpenForm(false)
    setTitle('')
    setContent('')
  }

  const handleUpdate = async (task: Task) => {
    setIsLoading(true)
    if (title === '' || content === '') {
      props.setAlertTitle('Error')
      props.setAlertText('Input is invalid.')
      props.setIsAlertOpen(true)
      setIsLoading(false)
      return
    }
    if (title === task.title && content === task.content) {
      props.setAlertTitle('Error')
      props.setAlertText('Not edited.')
      props.setIsAlertOpen(true)
      setIsLoading(false)
      return
    }
    const param: Partial<Task> = {
      id: task.id,
      title: title,
      content: content
    }
    try {
      const token = (await currentUser?.getIdTokenResult(true))?.token
      const res = await fetch('/api/task/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        setIsOpenForm(false)
        props.setAlertTitle('Completed')
        props.setAlertText('Update completed.')
        props.setIsAlertOpen(true)
        props.mutate()
      } else {
        props.setAlertTitle('Error')
        props.setAlertText('Failed.')
        props.setIsAlertOpen(true)
      }
    } catch (err) {
      props.setAlertTitle('Error')
      props.setAlertText('Failed.')
      props.setIsAlertOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenConfirmDialog = (task: Task) => {
    setIsOpenConfirm(true)
    setTitle(task.title)
    setContent(task.content)
    props.setIsAlertOpen(false)
  }

  const handleCloseConfirmDialog = () => {
    setIsOpenConfirm(false)
  }

  const handleDelete = async (id: string) => {
    try {
      const token = (await currentUser?.getIdTokenResult(true))?.token
      const param: Partial<Task> = {
        id: id
      }
      const res = await fetch('/api/task', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        props.setAlertTitle('Completed')
        props.setAlertText('Delete completed.')
        props.setIsAlertOpen(true)
        props.mutate()
      } else {
        props.setAlertTitle('Error')
        props.setAlertText('Failed.')
        props.setIsAlertOpen(true)
      }
    } catch (err) {
      props.setAlertTitle('Error')
      props.setAlertText('Failed.')
      props.setIsAlertOpen(true)
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
            multiline
            rows={4}
            onChange={(e) => {
              setContent(e.currentTarget.value)
            }}
          />
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
          <Button variant="outlined" onClick={handleCloseFormDialog} startIcon={<Close />}>
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
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onCancel={handleCloseConfirmDialog}
        onExecute={async () => {
          await handleDelete(props.task.id)
        }}
        title={<>Confirm</>}
        text={<>Delete this?</>}
      />
      <hr />
    </>
  )
}
