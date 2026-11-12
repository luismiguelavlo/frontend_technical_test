import { useEffect } from 'react'
import { ToastProvider } from './components/ui/Toaster.tsx'
import { UserDetailPage } from './features/users/UserDetailPage.tsx'
import { UsersPage } from './features/users/UsersPage.tsx'
import { useHashRoute } from './hooks/useHashRoute.ts'

function App() {
  const route = useHashRoute()
  const routeKey = route.name === 'userDetail' ? `user-${route.id}` : route.name

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeKey])

  return (
    <ToastProvider>
      {route.name === 'userDetail' ? <UserDetailPage key={route.id} id={route.id} /> : <UsersPage />}
    </ToastProvider>
  )
}

export default App
