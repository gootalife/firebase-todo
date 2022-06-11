import { AlertDialog } from 'components/AlertDialog'
import { useState } from 'react'

type UseAlertResult = [(title: string, text: string) => Promise<void>, () => JSX.Element]

export const useAlert = (): UseAlertResult => {
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
    <AlertDialog title={title} text={text} isOpen={isOpen} onClose={close} />
  )

  return [openAlertDialog, renderAlertDialog]
}
