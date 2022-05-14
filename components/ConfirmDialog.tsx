import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Check, Close } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import { useState } from 'react'

type Props = {
  title: JSX.Element
  text: JSX.Element
  isOpen: boolean
  onClose: () => void | Promise<void>
  onExecute: () => void | Promise<void>
}

export const ConfirmDialog = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleExecute = async () => {
    setIsLoading(true)
    await props.onExecute()
    setIsLoading(false)
  }

  return (
    <Dialog open={props.isOpen} fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton variant="contained" onClick={handleExecute} startIcon={<Check />} loading={isLoading}>
          YES
        </LoadingButton>
        <Button variant="outlined" onClick={props.onClose} startIcon={<Close />}>
          NO
        </Button>
      </DialogActions>
    </Dialog>
  )
}
