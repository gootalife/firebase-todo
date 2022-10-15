import { Check } from '@mui/icons-material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { useState } from 'react'

type AlertHook = [(title: string, text: string) => Promise<void>, () => JSX.Element]

export const useAlert = (): AlertHook => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [resolveCallback, setResolveCallback] = useState<{
    do: (value: void | PromiseLike<void>) => void
  }>({ do: () => {} })

  const close = () => {
    setIsOpen(false)
    resolveCallback.do()
  }

  const openAlertDialog = async (title: string, text: string): Promise<void> => {
    setTitle(title)
    setText(text)
    setIsOpen(true)
    // ボタンを押すまで待機
    return new Promise((resolve) => {
      setResolveCallback({ do: resolve })
    })
  }

  const renderAlertDialog = () => (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={close} startIcon={<Check />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )

  return [openAlertDialog, renderAlertDialog]
}
