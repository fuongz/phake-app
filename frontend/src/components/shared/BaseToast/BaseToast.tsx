import { Toast, ToastBody, ToastTitle, useId } from '@fluentui/react-components'

interface BaseToastProps {
  title?: string
  body?: Array<string> | undefined
  appearance?: string | undefined
}

const BaseToast: React.FC<BaseToastProps> = ({ title, body, appearance }) => {
  const toastId = useId('toast')
  return (
    <Toast appearance={appearance as any}>
      <ToastTitle>{title || ''}</ToastTitle>
      <ToastBody>
        {body &&
          body.length > 0 &&
          body.map((item, index) => {
            if (index === 0) {
              return (
                <p key={`base-toast-${toastId}-${index}`} className="text-zinc-400 text-sm">
                  {item}
                </p>
              )
            }
            return (
              <p key={`base-toast-${toastId}-${index}`} className="mt-1 text-zinc-400 text-sm">
                {item}
              </p>
            )
          })}
      </ToastBody>
    </Toast>
  )
}

export { BaseToast }
