// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'

const Home = () => {
  const router = useRouter()

  useEffect(
   () => {
      router.replace('/home')
    }, [router]
  )
  return
}

export default Home
