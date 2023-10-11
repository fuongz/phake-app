import { useFetch } from './useFetch'

const useConfig = () => {
  return {
    get: (name: string) => useFetch(`${import.meta.env.VITE_API_URL}/configs/${name}`),
    put: (name: string, description: string) =>
      useFetch(`${import.meta.env.VITE_API_URL}/configs/${name}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
        }),
      }),
  }
}

export { useConfig }
