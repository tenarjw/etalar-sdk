import React, { useEffect, useState } from 'react';
// ** MUI Imports
import Box from '@mui/material/Box'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Components

import ShortcutsDropdown  from 'src/@core/layouts/components/shared-components/ShortcutsDropdown'

import {useTranslation} from "react-i18next";

import Flag from 'react-flagkit'

import i18n from '../../../configs/i18n'
import {  Grid,  IconButton, Link } from '@mui/material';


import getShortcuts from '../Shortcuts';

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
}

const setLanguage = (lang : string) => {   i18n.changeLanguage(lang) }

const AppBarContent = (props: Props) => {
  // ** Props
  const { hidden, settings, saveSettings } = props
  const [langIcon, setLangIcon] = useState<any>(null);

  const {t, i18n} = useTranslation();

  useEffect(() => {
      console.log('language', i18n.language)
      if (i18n.language) {
          setLangIcon(() =>
          {
            if (i18n.language === 'pl') return  <Flag country="PL" />;
            else if (i18n.language === 'ua') return  <Flag country="UA" />;
            else return <Flag country="GB"/> ;
        })
      }
  }, [i18n, i18n.language])


  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width:'100%' }}>
    
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} style={{ display: 'flex'}}>
        <Link href='/'>
    LOGO
        </Link>
       
        </Grid>
        <Grid item xs={12} md={4} >
          
        <Box className='actions-right' 
        component="div"
        width={"100%"} sx={{ mr:2, display: 'flex',
        alignItems: 'center' }}>
        <div>
        </div>
      </Box>


        </Grid>
        <Grid item xs={12} md={4} >
        <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
 
      </Box>
        </Grid>
      </Grid>
      
     </Box>
  )
}

export default AppBarContent

