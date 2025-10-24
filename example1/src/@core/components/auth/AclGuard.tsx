// ** React Imports
import { ReactNode } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

interface AclGuardProps {
  children: ReactNode
  guestGuard: boolean
  pageRoles: string[] // To jest nowa właściwość z _app.tsx
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { pageRoles, children, guestGuard } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // Jeśli to strona dla gości lub błędu, renderuj bez sprawdzania
  if (guestGuard || router.route === '/404' || router.route === '/500' || router.route === '/') {
    return <>{children}</>
  }

  // Użytkownik jest zalogowany, sprawdź rolę
  if (auth.user && auth.user.role) {
    // Jeśli strona nie wymaga żadnych ról, zezwól
    if (pageRoles.length === 0) {
      return <>{children}</>
    }

    // Jeśli użytkownik ma wymaganą rolę, zezwól
    if (pageRoles.includes(auth.user.role)) {
      return <>{children}</>
    }
  }

  // Jeśli użytkownik nie jest zalogowany (a strona nie jest dla gości)
  // LUB nie ma odpowiedniej roli, pokaż 401
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard