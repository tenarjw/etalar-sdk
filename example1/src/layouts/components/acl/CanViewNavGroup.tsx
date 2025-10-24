// ** React Imports
import { ReactNode  } from 'react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { NavGroup  } from 'src/@core/layouts/types'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const auth = useAuth()
  const userRole = auth.user?.role 

  const canViewMenuGroup = (item: NavGroup) => {
    /* todo....
    const hasAnyVisibleChild =
      item.children && item.children.some((i: NavLink) => 
        ability && ability.can(i.action, i.subject))

    return ability && ability.can(item.action, item.subject) && hasAnyVisibleChild
    */
   /*
         if (!navLink?.roles || navLink.roles.length === 0){
        return hasAnyVisibleChild
      }
        // 1. Jeśli link nie ma zdefiniowanych ról, pokaż go każdemu
  if (!navLink?.roles || navLink.roles.length === 0) {
    return <>{children}</>
  }

  // 2. Jeśli link ma role i użytkownik ma pasującą rolę, pokaż go
  if (userRole && navLink.roles.includes(userRole)) {
    return <>{children}</>
  }
    */
   return true
  }

  return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  
}

export default CanViewNavGroup
