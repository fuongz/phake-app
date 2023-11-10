import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from '@fluentui/react-components'
import { ReactNode, useEffect, useState } from 'react'

interface BaseDialogProps {
  status: boolean
  hideCloseButton?: boolean
  title?: string
  actions?: Array<{ label: string; onClick: () => void; type: 'button' | 'reset' | 'submit' }>
  onStatusChange: (status: boolean) => void
  children: ReactNode
}

const BaseDialog: React.FC<BaseDialogProps> = ({ title, hideCloseButton, actions, status, onStatusChange, children }) => {
  const [open, setOpen] = useState(status)

  useEffect(() => {
    setOpen(status)
  }, [status])

  return (
    <Dialog
      open={open}
      onOpenChange={(_event, data) => {
        setOpen(data.open)
        onStatusChange?.(data.open)
      }}
    >
      <DialogSurface>
        <DialogBody>
          {!!title && <DialogTitle>{title}</DialogTitle>}
          <DialogContent>{children}</DialogContent>
          <DialogActions>
            {!hideCloseButton && (
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
            )}
            {actions &&
              actions.length > 0 &&
              actions.map((action, index) => (
                <Button key={`action-${index}`} type={action.type || 'button'} appearance="primary" onClick={() => action.onClick?.()}>
                  {action.label || 'Submit'}
                </Button>
              ))}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export { BaseDialog }
