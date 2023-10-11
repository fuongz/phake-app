import { useQuery } from '@tanstack/react-query'
import { useFetch } from './useFetch'

const useSystemInfo = () => {
  const fetchSystemInfo = useFetch(`${import.meta.env.VITE_API_URL}/system-info`)
  return useQuery<any, any>({
    queryKey: ['system'],
    queryFn: () => fetchSystemInfo,
  })
}

export { useSystemInfo }
