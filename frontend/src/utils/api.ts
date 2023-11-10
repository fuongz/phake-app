import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

httpClient.interceptors.response.use((response) => {
  if (response.data) {
    return response.data
  }
  return response
})

export default httpClient
