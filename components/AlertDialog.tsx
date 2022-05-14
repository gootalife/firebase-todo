import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Check } from '@mui/icons-material'

type Props = {
  title: JSX.Element
  text: JSX.Element
  isOpen: boolean
  onClose: () => void | Promise<void>
}

export const AlertDialog = (props: Props) => {
  return (
    <Dialog open={props.isOpen} fullWidth>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={props.onClose} startIcon={<Check />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
