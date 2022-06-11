import { ConfirmDialog } from 'components/ConfirmDialog'
import { useState } from 'react'

type UseConfirmResult = [(title: string, text: string) => Promise<boolean>, () => JSX.Element]

export const useConfirm = (): UseConfirmResult => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
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
    setIsOpen(false)
    resolveCallback.do(true)
  }

  const renderConfirmDialog = () => (
    <ConfirmDialog
      title={title}
      text={text}
      isOpen={isOpen}
      onCancel={cancel}
      onExecute={execute}
    />
  )

  return [openConfirmDialog, renderConfirmDialog]
}
