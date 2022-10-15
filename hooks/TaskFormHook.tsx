import { Close, Check } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button
} from '@mui/material'
import { Task } from '@prisma/client'
import { useState } from 'react'
import { useAlert } from 'hooks/alertHook'
import { useConfirm } from 'hooks/confirmHook'

type TaskFormItem = {
  title: string
  content: string
}

type TaskFormHook = [
  (title: string, text: string, task?: Task) => Promise<TaskFormItem | undefined>,
  () => JSX.Element
]

export const useTaskForm = (): TaskFormHook => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [task, setTask] = useState<Task | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [resolveCallback, setResolveCallback] = useState<{
    do: (value: TaskFormItem | PromiseLike<TaskFormItem> | undefined) => void
  }>({ do: () => {} })

  const [taskTitle, setTaskTitle] = useState('')
  const [taskContent, setTaskContent] = useState('')

  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()

  const openForm = async (
    title: string,
    text: string,
    task?: Task
  ): Promise<TaskFormItem | undefined> => {
    setTitle(title)
    setText(text)
    setTask(task)
    setTaskTitle(task?.title ?? '')
    setTaskContent(task?.content ?? '')
    setIsOpen(true)
    // ボタンを押すまで待機
    return new Promise((resolve) => {
      setResolveCallback({ do: resolve })
    })
  }

  const close = () => {
    setIsOpen(false)
    resolveCallback.do(undefined)
  }

  const validateItem = async () => {
    setIsLoading(true)
    const isConfirmed = await openConfirmDialog('Confirm', 'OK?')
    if (!isConfirmed) {
      setIsLoading(false)
      return
    }
    if (taskTitle === '' || taskContent === '') {
      await openAlertDialog('error', 'Empty exists.')
      setIsLoading(false)
      return
    }
    if (taskTitle === task?.title && taskContent === task?.content) {
      await openAlertDialog('error', 'No edit.')
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    setIsOpen(false)
    resolveCallback.do({ title: taskTitle, content: taskContent })
  }

  const renderForm = () => (
    <>
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
          <TextField
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            required
            onChange={(e) => {
              setTaskTitle(e.currentTarget.value)
            }}
            defaultValue={taskTitle}
          />
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            variant="outlined"
            required
            multiline
            rows={4}
            onChange={(e) => {
              setTaskContent(e.currentTarget.value)
            }}
            defaultValue={taskContent}
          />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            onClick={validateItem}
            variant="contained"
            loading={isLoading}
            startIcon={<Check />}
          >
            OK
          </LoadingButton>
          <Button onClick={close} variant="outlined" startIcon={<Close />}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {renderAlertDialog()}
      {renderConfirmDialog()}
    </>
  )

  return [openForm, renderForm]
}
