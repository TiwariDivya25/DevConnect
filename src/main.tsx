import { createRoot } from 'react-dom/client'
import './index.css'
import './theme.css'
import App from './App.tsx'

import { BrowserRouter as Router} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(

    <Router>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <App />
             <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} closeOnClick pauseOnHover />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Router>

)
