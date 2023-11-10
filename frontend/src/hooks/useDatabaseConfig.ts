import httpClient from '@/utils/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from './auth'

const useDatabaseConfig = () => {
  const { accessToken } = useAuth()
  return useQuery<any, any>({
    queryKey: ['database-connection'],
    queryFn: () =>
      httpClient.get('/database', {
        params: {
          default: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
  })
}

export { useDatabaseConfig }
