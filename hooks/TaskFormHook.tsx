import { Save, Close, Check } from '@mui/icons-material'
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
import { User } from 'firebase/auth'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { useAlert } from 'hooks/AlertHook'
import { useConfirm } from 'hooks/ConfirmHook'
import { apiPath } from 'utils/api'

type UseTaskFormResult = [
  (
    title: string,
    text: string,
    updateMode: boolean,
    user: User | null | undefined,
    task?: Task
  ) => Promise<void>,
  () => JSX.Element
]

export const useTaskForm = (): UseTaskFormResult => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [updateMode, setUpdateMode] = useState(false)
  const [user, setUser] = useState<User | null | undefined>()
  const [task, setTask] = useState<Task | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [resolveCallback, setResolveCallback] = useState<{
    do: (value: void | PromiseLike<void>) => void
  }>({ do: () => {} })

  const [taskTitle, setTaskTitle] = useState('')
  const [taskContent, setTaskContent] = useState('')

  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()

  const { mutate } = useSWRConfig()

  const openForm = async (
    title: string,
    text: string,
    updateMode: boolean,
    user: User | null | undefined,
    task?: Task
  ): Promise<void> => {
    setTitle(title)
    setText(text)
    setUpdateMode(updateMode)
    setUser(user)
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
    resolveCallback.do()
  }

  const save = async () => {
    if (taskTitle === '' || taskContent === '') {
      await openAlertDialog('Error', 'Input is invalid.')
      return
    }
    setIsLoading(true)
    const param: Partial<Task> = {
      title: taskTitle,
      content: taskContent
    }
    try {
      const token = (await user?.getIdTokenResult(true))?.token
      const res = await fetch(apiPath.task, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        await openAlertDialog('Completed', 'Save completed.')
        mutate(apiPath.task)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed.')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
      resolveCallback.do()
    }
  }

  const update = async () => {
    if (taskTitle === '' || taskContent === '') {
      await openAlertDialog('Error', 'Input is invalid.')
      return
    }
    if (taskTitle === task?.title && taskContent === task?.content) {
      await openAlertDialog('Error', 'Not edited.')
      return
    }
    const isConfirmed = await openConfirmDialog('Confirm', 'Update This?')
    if (!isConfirmed) {
      return
    }
    setIsLoading(true)
    const param: Partial<Task> = {
      id: task?.id,
      title: taskTitle,
      content: taskContent
    }
    try {
      const token = (await user?.getIdTokenResult(true))?.token
      const res = await fetch(apiPath.task, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        await openAlertDialog('Completed', 'Update completed.')
        mutate(apiPath.task)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
      resolveCallback.do()
    }
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
            onClick={updateMode === true ? update : save}
            variant="contained"
            loading={isLoading}
            startIcon={updateMode === true ? <Check /> : <Save />}
          >
            {updateMode === true ? 'Update' : 'Save'}
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
