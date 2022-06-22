import { Task } from '@prisma/client'
import { Button } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { useAuth } from 'contexts/AuthProvider'
import { useConfirm } from 'hooks/confirmHook'
import { useAlert } from 'hooks/alertHook'
import { useTaskForm } from 'hooks/taskFormHook'
import { apiPath } from 'utils/api'
import { useSWRConfig } from 'swr'
import { deleteTask } from 'utils/api'

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
      if (!isConfirmed || !currentUser) {
        return
      }
      const res = await deleteTask(props.task.id, currentUser)
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
