import { Check, Close } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { useState } from 'react'

type ConfirmHook = [(title: string, text: string) => Promise<boolean>, () => JSX.Element]

export const useConfirm = (): ConfirmHook => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resolveCallback, setResolveCallback] = useState<{
    do: (value: boolean | PromiseLike<boolean>) => void
  }>({ do: () => {} })

  const openConfirmDialog = async (title: string, text: string): Promise<boolean> => {
    setTitle(title)
    setText(text)
    setIsOpen(true)
    // ボタンを押すまで待機
    return new Promise((resolve) => {
      setResolveCallback({ do: resolve })
    })
  }

  const cancel = () => {
    setIsOpen(false)
    resolveCallback.do(false)
  }

  const execute = () => {
    setIsLoading(true)
    setIsOpen(false)
    resolveCallback.do(true)
    setIsLoading(false)
  }

  const renderConfirmDialog = () => (
    <Dialog open={isOpen} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant="contained"
          onClick={execute}
          startIcon={<Check />}
          loading={isLoading}
        >
          YES
        </LoadingButton>
        <Button variant="outlined" onClick={cancel} startIcon={<Close />}>
          NO
        </Button>
      </DialogActions>
    </Dialog>
  )

  return [openConfirmDialog, renderConfirmDialog]
}
