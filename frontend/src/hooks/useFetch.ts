const useFetch = async (url: string, options: any = {}) => {
  const res = await fetch(url, options)
  return await res.json()
}

export { useFetch }
