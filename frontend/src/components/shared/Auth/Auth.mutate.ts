import httpClient from '@/utils/api'
import { useMutation } from '@tanstack/react-query'

const signIn = async (data: { email: string; password: string }) => {
  return await httpClient.post('/auth/signIn', data)
}

export const useSignIn = () => {
  return useMutation({ mutationFn: signIn })
}
