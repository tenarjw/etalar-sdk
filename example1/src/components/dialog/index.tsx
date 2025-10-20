
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** MUI Imports
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import MuiDrawer, { DrawerProps } from '@mui/material/Drawer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Trans
import {useTranslation, Trans} from "react-i18next";
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/store'
import { setMBoxOpened, pushMessage, Message } from 'src/store/messages';
import React from 'react'


const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '50%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const drawerWidth = '100%';

const Drawer = styled(MuiDrawer)<DrawerProps>(({ theme }) => ({
  width: drawerWidth,
  zIndex: theme.zIndex.modal,
  flexShrink: 10,
  '& .MuiFormControlLabel-root': {
    marginRight: '0.6875rem'
  },
  '& .MuiDrawer-paper': {
    border: 0,
    width: drawerWidth,
    zIndex: theme.zIndex.modal,
    boxShadow: theme.shadows[9]
  }
}))

const DialogSpacing = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 6)
}))

const Details = (props: {show : boolean, sx : {}, content : string, vswith:(v:boolean)=>void}) => {
  if (props.show)
   return<>
     <Typography sx={props.sx}>{props.content}</Typography><div onClick={()=>props.vswith(false)}>
      <b>
      <br />(<Trans>Hide</Trans>)</b></div>
   </>
   else
   return<>
     <div onClick={()=>props.vswith(true)}><b><Trans>Details</Trans>&gt;&gt;</b></div>
   </>
}


const DialogBox = () => {
  //const { t, i18n } = useTranslation();
  const store_messages = useSelector((state: RootState) => state.messages)
  const dispatch = useDispatch<AppDispatch>()
  const [showDetails, setDetails] = React.useState(false);



  return (
    <div className='mbox'>

      <Drawer open={store_messages.mBoxOpened} hideBackdrop anchor='top' variant='persistent'>
        <Box
          className='mbox-header'
          sx={{
            position: 'relative',
            p: theme => theme.spacing(3.5, 5),
            borderBottom: theme => `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
            <Trans>Messages</Trans>
          </Typography>
          <IconButton
            onClick={() => dispatch(setMBoxOpened(false))}
            sx={{
              right: 20,
              top: '50%',
              position: 'absolute',
              color: 'error',
              transform: 'translateY(-50%)'
            }}
          >
            <Icon icon='mdi:close' fontSize={20} />
            <Trans>Close</Trans>
          </IconButton>
        </Box>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <DialogSpacing className='mbox-body'>
              { store_messages.messages.map((a,i)=>{
                if (a?.class=='details') {
                  return <><Details
                   content={a?.message} show={showDetails} vswith={
                    (v : boolean) => setDetails(v)
                   }
                   sx={{
                    mb: 4,
                    color:a?.color,
                    fontWeight:a?.weight,
                    fontSize:a?.size
                  }} /></>
                } else {
                  return <><Typography sx={{
                    mb: 4,
                    color:a?.color,
                    fontWeight:a?.weight,
                    fontSize:a?.size
                  }}>{a?.message}</Typography></>}
                }
               )
              }
          </DialogSpacing>


          <Divider sx={{ m: '0 !important' }} />

          <DialogSpacing className='mbox-body'>
          <Button
            onClick={() => dispatch(setMBoxOpened(false))}
            sx={{ mb: 4, color: 'text.disabled', textTransform: 'uppercase' }}
            >
            <Trans>Close</Trans>
          </Button>

          </DialogSpacing>

        </PerfectScrollbar>
      </Drawer>
    </div>
  )
}

export default DialogBox

