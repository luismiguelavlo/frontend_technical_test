import { useEffect } from 'react'
import { Toaster } from './components/ui/Toaster.tsx'
import { UserDetailPage } from './features/users/UserDetailPage.tsx'
import { UsersPage } from './features/users/UsersPage.tsx'
import { useHashRoute } from './hooks/useHashRoute.ts'
import { useToasts } from './hooks/useToasts.ts'

function App() {
  const route = useHashRoute()
  // Toasts live above the pages so a message survives navigation (e.g. "Usuario eliminado").
  const { toasts, notify, dismiss } = useToasts()
  const routeKey = route.name === 'userDetail' ? `user-${route.id}` : route.name

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeKey])

  return (
    <>
      {route.name === 'userDetail' ? (
        <UserDetailPage key={route.id} id={route.id} notify={notify} />
      ) : (
        <UsersPage notify={notify} />
      )}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </>
  )
}

export default App
