// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Types
import { NavSectionTitle } from 'src/@core/layouts/types'

interface Props {
  children: ReactNode
  navTitle?: NavSectionTitle
}

const CanViewNavSectionTitle = (props: Props) => {
  // ** Props
  const { children, navTitle } = props
/* todo:
  // ** Hook
  const ability = useContext(AbilityContext)

  return ability && ability.can(navTitle?.action, navTitle?.subject) ? <>{children}</> : null
  */
 return <>{children}</>
}

export default CanViewNavSectionTitle
