import { Task } from '@prisma/client'
import { Button } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { useAuth } from 'contexts/AuthProvider'
import { useConfirm } from 'hooks/ConfirmHook'
import { useAlert } from 'hooks/AlertHook'
import { useTaskForm } from 'hooks/TaskFormHook'
import { apiPath } from 'utils/api'
import { useSWRConfig } from 'swr'

type Props = {
  task: Task
}

export const ToDoItem = (props: Props) => {
  const { currentUser } = useAuth()
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()
  const [openTaskForm, renderTaskForm] = useTaskForm()
  const { mutate } = useSWRConfig()

  const handleDelete = async () => {
    try {
      const isConfirmed = await openConfirmDialog('Confirm', 'Delete This?')
      if (!isConfirmed) {
        return
      }
      const token = (await currentUser?.getIdTokenResult(true))?.token
      const param: Partial<Task> = {
        id: props.task.id
      }
      const res = await fetch(apiPath.task, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(param)
      })
      if (res.ok) {
        await openAlertDialog('Completed', 'Delete completed.')
        mutate(apiPath.task)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed')
    }
  }

  return (
    <>
      <h3>{props.task.title}</h3>
      <div>{props.task.content}</div>

      <Button
        sx={{ mr: 1 }}
        variant="contained"
        onClick={async () => {
          await openTaskForm('Update ToDo', 'Edit items.', true, currentUser, props.task)
        }}
        startIcon={<Edit />}
      >
        Edit
      </Button>
      <Button variant="contained" onClick={handleDelete} startIcon={<Delete />}>
        Delete
      </Button>
      {renderTaskForm()}
      {renderAlertDialog()}
      {renderConfirmDialog()}
      <hr />
    </>
  )
}
