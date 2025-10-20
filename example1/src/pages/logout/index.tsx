import Grid from '@mui/material/Grid'
import React from 'react'
import {
  Box
} from '@mui/material'

import { Logout } from "src/components/login"


interface TabPanelProps {
  children?: React.ReactNode;
  catlist?: any;
  index: number;
  value: number;
}

const LogoutPage = (props: TabPanelProps) => {

  return (
    <Grid container spacing={6}>

      <Grid item xs={12} md={6} lg={8}>
        <Box sx={{ width: '100%' }}
          component="div"
        >
              <Logout />
              </Box>
      </Grid>
    </Grid>
  )
}



export default LogoutPage
