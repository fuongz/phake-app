import { ReactNode, createContext, useContext, useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { UserModel } from 'src/models/user.model'

export interface UserProviderInterface {
  cookies: { [x: string]: string }
  user: UserModel | null
  isLoggedIn: boolean
  accessToken: string | null
  setToken: (token: string) => void
  removeToken: () => void
  setUser: (user: UserModel) => void
  removeUser: () => void
}

const UserContext = createContext<UserProviderInterface>({
  cookies: {},
  user: null,
  isLoggedIn: false,
  accessToken: null,
  setToken: () => {},
  removeToken: () => {},
  setUser: () => {},
  removeUser: () => {},
})

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cookies, setCookies, removeCookie] = useCookies()

  const setToken = (token: string) => {
    setCookies('access_token', token)
  }

  const setUser = (user: UserModel) => {
    setCookies('user', JSON.stringify(user))
  }

  const removeToken = () => {
    removeCookie('access_token')
  }

  const removeUser = () => {
    removeCookie('user')
  }

  const value = useMemo(
    () => ({
      cookies,
      isLoggedIn: !!cookies?.access_token,
      accessToken: cookies?.access_token,
      user: cookies?.user,
      setToken,
      removeToken,
      setUser,
      removeUser,
    }),
    [cookies]
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useAuth = (): UserProviderInterface => {
  return useContext(UserContext)
}
