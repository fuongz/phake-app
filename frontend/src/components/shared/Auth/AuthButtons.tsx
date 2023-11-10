import { Button } from '@fluentui/react-components'
import { AuthDialog } from './AuthDialog'
import { useState } from 'react'

const AuthButtons = () => {
  const [dialogStatus, setDialogStatus] = useState(false)
  return (
    <>
      <div className="ml-auto">
        <Button appearance="primary" onClick={() => setDialogStatus(true)}>
          Sign in
        </Button>
      </div>
      <AuthDialog status={dialogStatus} onStatusChange={(status) => setDialogStatus(status)} />
    </>
  )
}
export { AuthButtons }
