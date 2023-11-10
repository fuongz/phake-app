import { ReactNode } from 'react'
import { UserProvider } from './auth'

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <UserProvider>{children}</UserProvider>
}

export default AppProvider
