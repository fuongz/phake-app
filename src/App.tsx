import { useRoutes } from 'react-router-dom'

import routes from './routes'

export default function App() {
  const rootRoutes = useRoutes(routes)
  return (
    <>
      <main>{rootRoutes}</main>
    </>
  )
}
