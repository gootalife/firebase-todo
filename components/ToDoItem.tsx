import { Task } from '@prisma/client'
import { Button } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { useSWRConfig } from 'swr'
import { useConfirm } from 'hooks/confirmHook'
import { useAlert } from 'hooks/alertHook'
import { useTaskForm } from 'hooks/taskFormHook'
import { apiPath, updateTask, deleteTask } from 'utils/api'
import { useAuth } from 'hooks/authHook'

type Props = {
  task: Task
}

export const ToDoItem = (props: Props) => {
  const currentUser = useAuth()
  const [openAlertDialog, renderAlertDialog] = useAlert()
  const [openConfirmDialog, renderConfirmDialog] = useConfirm()
  const [openTaskForm, renderTaskForm] = useTaskForm()
  const { mutate } = useSWRConfig()

  const update = async () => {
    const task = await openTaskForm('TaskForm', 'Input items', props.task)
    if (!task || !currentUser) {
      return
    }
    if (task.title === '' || task.content === '') {
      await openAlertDialog('Error', 'Input is invalid.')
      return
    }
    const param: Partial<Task> = {
      id: props.task.id,
      title: task.title,
      content: task.content
    }
    try {
      const res = await updateTask(param, currentUser)
      if (res.ok) {
        await openAlertDialog('Completed', 'Update completed.')
        mutate(apiPath.task)
      } else {
        throw new Error()
      }
    } catch (err) {
      await openAlertDialog('Error', 'Failed')
    }
  }

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

      <Button sx={{ mr: 1 }} variant="contained" onClick={update} startIcon={<Edit />}>
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
