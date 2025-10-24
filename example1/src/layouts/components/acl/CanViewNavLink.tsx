// ** React Imports
import { ReactNode } from 'react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { NavLink } from 'src/@core/layouts/types'

interface Props {
  navLink?: NavLink
  children: ReactNode
}

const CanViewNavLink = (props: Props) => {
  // ** Props
  const { children, navLink } = props

  // ** Hook
  const auth = useAuth()
  const userRole = auth.user?.role // Załóżmy, że masz 'role' w obiekcie user

  // 1. Jeśli link nie ma zdefiniowanych ról, pokaż go każdemu
  if (!navLink?.roles || navLink.roles.length === 0) {
    return <>{children}</>
  }

  // 2. Jeśli link ma role i użytkownik ma pasującą rolę, pokaż go
  if (userRole && navLink.roles.includes(userRole)) {
    return <>{children}</>
  }

  // 3. W przeciwnym razie ukryj
  return null
}

export default CanViewNavLink