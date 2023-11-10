import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FluentProvider, webLightTheme } from '@fluentui/react-components'

import AppProvider from './hooks/userAppProvider'

import App from './App'
import './styles/global.css'

const queryClient = new QueryClient()

function RootApp() {
  return (
    <FluentProvider theme={webLightTheme}>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AppProvider>
              <App />
            </AppProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </React.StrictMode>
    </FluentProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootApp />)
