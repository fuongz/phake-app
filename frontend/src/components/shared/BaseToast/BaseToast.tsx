import { Toast, ToastBody, ToastTitle } from '@fluentui/react-components'

interface BaseToastProps {
  title?: string
  body?: Array<string> | undefined
  appearance?: string | undefined
}

const BaseToast: React.FC<BaseToastProps> = ({ title, body, appearance }) => {
  return (
    <Toast appearance={appearance as any}>
      <ToastTitle>{title || ''}</ToastTitle>
      <ToastBody>
        {body &&
          body.length > 0 &&
          body.map((item, index) => {
            if (index === 0) {
              return <p className="text-zinc-400 text-sm">{item}</p>
            }
            ;<p className="mt-1 text-zinc-400 text-sm">{item}</p>
          })}
      </ToastBody>
    </Toast>
  )
}

export { BaseToast }
