import AppRouter from './router/AppRouter'
import { ToastProvider } from './components/ui/Toast'
import { Toaster } from 'sonner'

export default function App() {
  return (
    <ToastProvider>
      <AppRouter />
      {/* Sonner toaster — used by the Temple Registration flow for inline feedback */}
      <Toaster position="bottom-right" richColors />
    </ToastProvider>
  )
}
