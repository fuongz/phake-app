import { useAuth } from '@/hooks/auth'
import { Avatar, Menu, MenuDivider, MenuGroup, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components'
import { SignOutRegular } from '@fluentui/react-icons'

interface AuthUserProps {}

const UserDropdown = (): JSX.Element => {
  const { user, removeToken, removeUser } = useAuth()

  const signOut = () => {
    removeToken()
    removeUser()
  }

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <div className="cursor-pointer">
          <Avatar initials={user?.username.slice(0, 2)} name="brand color avatar" badge={{ status: 'available' }} />
        </div>
      </MenuTrigger>

      <MenuPopover>
        <MenuList>
          <MenuGroup>
            <MenuItem>
              <div className="flex gap-2 mb-2 items-center">
                <Avatar initials={user?.username.slice(0, 2)} name="brand color avatar" badge={{ status: 'available' }} />
                <div className="flex flex-col">
                  <span className="text-zinc-600 font-semibold">{user?.username}</span>
                  <span className="text-zinc-400">{user?.email}</span>
                </div>
              </div>
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<SignOutRegular />} onClick={() => signOut()}>
              Sign out
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </MenuPopover>
    </Menu>
  )
}

const AuthUser: React.FC<AuthUserProps> = ({}) => {
  return (
    <div className="ml-auto">
      <UserDropdown />
    </div>
  )
}
export default AuthUser
