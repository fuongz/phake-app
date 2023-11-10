import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { BaseDialog } from '../BaseDialog/BaseDialog'
import { BaseInputControl } from '../BaseInputControl/BaseInputControl'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCallback, useRef, useState } from 'react'
import { useSignIn } from './Auth.mutate'
import { capitalizeFirstLetter } from '@/utils/string'
import { MessageBar, MessageBarBody, MessageBarTitle, useToastController, useId } from '@fluentui/react-components'
import { useAuth } from '@/hooks/auth/index'
import { BaseToast } from '../BaseToast/BaseToast'

interface AuthDialogProps {
  status: boolean
  onStatusChange?: (status: boolean) => void
}

const formSchema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
})

const AuthDialog: React.FC<AuthDialogProps> = ({ status, onStatusChange }) => {
  const { setToken, setUser } = useAuth()
  const formRef = useRef<any>(null)
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)
  const [formError, setFormError] = useState<string | null>(null)
  const actions: Array<{ label: string; type: 'submit' | 'reset' | 'button'; onClick: () => void }> = [
    {
      label: 'Sign In',
      type: 'submit',
      onClick: () => {
        formRef?.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
      },
    },
  ]
  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  })
  const { mutate } = useSignIn()
  const handleSignIn: SubmitHandler<{ email: string; password: string }> = useCallback(
    (data) => {
      mutate(data, {
        onSuccess(data: any) {
          setFormError(null)
          setToken(data.access_token)
          setUser(data.user)
          dispatchToast(<BaseToast title="Sign In successfully!" />, { intent: 'success' })
        },
        onError(error: any) {
          setFormError(capitalizeFirstLetter(error?.response?.data?.message || error.message))
        },
      })
    },
    [mutate]
  )

  return (
    <BaseDialog hideCloseButton={true} status={status} onStatusChange={(status) => onStatusChange?.(status)} actions={actions}>
      <h1 className="text-3xl font-semibold">Sign In</h1>
      <p className="mt-2 text-zinc-400 text-base">Welcome to PhakeApp</p>

      {!!formError && (
        <MessageBar intent="error" className="mt-4">
          <MessageBarBody>
            <MessageBarTitle>Error:</MessageBarTitle>
            {formError}
          </MessageBarBody>
        </MessageBar>
      )}

      <FormProvider {...methods}>
        <form ref={formRef} className="my-4 flex flex-col gap-y-4" onSubmit={methods.handleSubmit(handleSignIn)}>
          <BaseInputControl label="Email" name="email" placeholder="Enter your username" />
          <BaseInputControl label="Password" name="password" type="password" placeholder="Enter your password" />
        </form>
      </FormProvider>
    </BaseDialog>
  )
}

export { AuthDialog }
