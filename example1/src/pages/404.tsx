import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0
  }
}))

const Error404 = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home')
    }, 3000) // Redirect after 3 seconds

    return () => clearTimeout(timer) // Cleanup timer on component unmount
  }, [router])

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Brak strony
          </Typography>
          <Typography variant='body2'>
            Nie znaleziono strony. Za chwilę nastąpi przekierowanie na stronę główną...
          </Typography>
        </BoxWrapper>
      </Box>
    </Box>
  )
}

Error404.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error404