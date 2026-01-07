import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import App from './App.tsx'

import { BrowserRouter as Router} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(

    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>

)
